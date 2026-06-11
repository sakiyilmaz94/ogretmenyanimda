import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notify } from "@/lib/notify";
import { sendEmail, emailPaymentReminder, emailBookingAutoCancelled } from "@/lib/email";
import { formatCurrency, SUBJECT_LABELS } from "@/lib/utils";

export const dynamic = "force-dynamic";

// Harici cron servisi (cron-job.org) saatlik çağırır.
// Güvenlik: ?key=CRON_SECRET veya Authorization: Bearer CRON_SECRET
function authorized(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return null; // yapılandırılmamış
  const url = new URL(req.url);
  const key = url.searchParams.get("key");
  const bearer = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return key === secret || bearer === secret;
}

const PAYMENT_WINDOW_H = 24; // ödeme penceresi
const REMINDER_AFTER_H = 12; // onaydan kaç saat sonra hatırlatma

// Ödenmemiş onaylı rezervasyon filtresi
const unpaidConfirmed = {
  status: "CONFIRMED" as const,
  confirmedAt: { not: null },
  OR: [{ payment: { is: null } }, { payment: { status: { not: "PAID" as const } } }],
};

const include = {
  student: { include: { parent: { include: { user: true } } } },
  educator: { include: { user: true } },
  slot: true,
  payment: true,
} as const;

function fmt(slotDate: Date, start: string, end: string) {
  const date = new Date(slotDate).toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" });
  return { date, time: `${start}–${end}` };
}

export async function GET(req: Request) {
  const ok = authorized(req);
  if (ok === null) return NextResponse.json({ error: "CRON_SECRET tanımlı değil" }, { status: 500 });
  if (!ok) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const now = Date.now();
  const reminderCutoff = new Date(now - REMINDER_AFTER_H * 3600 * 1000); // confirmedAt <= bu → 12s geçmiş
  const cancelCutoff = new Date(now - PAYMENT_WINDOW_H * 3600 * 1000); // confirmedAt <= bu → 24s geçmiş

  let remindersSent = 0;
  let cancelled = 0;

  // 1) 12 saat geçmiş, henüz hatırlatılmamış (ve 24 saat dolmamış) → hatırlatma
  const toRemind = await db.booking.findMany({
    where: {
      ...unpaidConfirmed,
      paymentReminderSentAt: null,
      confirmedAt: { lte: reminderCutoff, gt: cancelCutoff },
    },
    include,
  });

  for (const b of toRemind) {
    const parentUser = b.student.parent.user;
    const { date, time } = fmt(b.slot.date, b.slot.startTime, b.slot.endTime);
    const deadline = b.confirmedAt
      ? new Date(b.confirmedAt.getTime() + PAYMENT_WINDOW_H * 3600 * 1000).toLocaleString("tr-TR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })
      : undefined;

    if (b.student.parent.paymentNotification !== false) {
      await notify({
        userId: parentUser.id,
        title: "Ödeme Hatırlatması ⏳",
        message: `${b.student.name} için dersin ödemesi bekliyor. Süre dolmadan ödeme yapın, aksi halde randevu iptal olur.`,
        link: "/parent/bookings",
      });
      await sendEmail({
        to: parentUser.email,
        subject: "Ödeme Hatırlatması — Randevunuz İptal Olmadan Ödeyin",
        html: emailPaymentReminder({
          parentName: parentUser.name ?? "Veli",
          educatorName: b.educator.user.name ?? "Öğretmen",
          studentName: b.student.name,
          date, time,
          amount: formatCurrency(b.totalPrice.toNumber()),
          deadline,
        }),
      }).catch((e) => console.error("Hatırlatma e-postası gönderilemedi:", e));
    }

    await db.booking.update({ where: { id: b.id }, data: { paymentReminderSentAt: new Date() } });
    remindersSent++;
  }

  // 2) 24 saat dolmuş, hâlâ ödenmemiş → otomatik iptal + slotu yeniden aç
  const toCancel = await db.booking.findMany({
    where: { ...unpaidConfirmed, confirmedAt: { lte: cancelCutoff } },
    include,
  });

  for (const b of toCancel) {
    const parentUser = b.student.parent.user;
    const { date, time } = fmt(b.slot.date, b.slot.startTime, b.slot.endTime);
    const subjectLabel = SUBJECT_LABELS[b.subject] ?? b.subject;

    await db.$transaction([
      db.booking.update({ where: { id: b.id }, data: { status: "CANCELLED" } }),
      db.availabilitySlot.update({ where: { id: b.slotId }, data: { isBooked: false } }),
      ...(b.payment ? [db.payment.update({ where: { bookingId: b.id }, data: { status: "FAILED" } })] : []),
    ]);

    await notify({
      userId: parentUser.id,
      title: "Randevu İptal Edildi",
      message: `${subjectLabel} dersi, 24 saat içinde ödeme yapılmadığı için otomatik iptal edildi. Saat yeniden açıldı.`,
      link: "/parent/book",
    });
    await sendEmail({
      to: parentUser.email,
      subject: "Randevunuz İptal Edildi — Ödeme Süresi Doldu",
      html: emailBookingAutoCancelled({
        parentName: parentUser.name ?? "Veli",
        educatorName: b.educator.user.name ?? "Öğretmen",
        studentName: b.student.name,
        date, time,
      }),
    }).catch((e) => console.error("İptal e-postası gönderilemedi:", e));

    // Öğretmene bilgi (saat yeniden açıldı)
    await notify({
      userId: b.educator.userId,
      title: "Saat Yeniden Açıldı",
      message: `${b.student.name} için ${date} ${time} dersi ödeme yapılmadığından iptal edildi; saatiniz yeniden müsait.`,
      link: "/educator/bookings",
    });

    cancelled++;
  }

  return NextResponse.json({ ok: true, remindersSent, cancelled, checkedAt: new Date().toISOString() });
}
