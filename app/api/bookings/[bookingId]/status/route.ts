import { auth } from "@/auth";
import { db } from "@/lib/db";
import { notify } from "@/lib/notify";
import { sendEmail, emailBookingConfirmed, emailPaymentReceived } from "@/lib/email";
import { NextResponse } from "next/server";
import { SUBJECT_LABELS, formatCurrency } from "@/lib/utils";

export async function PATCH(req: Request, { params }: { params: Promise<{ bookingId: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { bookingId } = await params;
  const { action } = await req.json();

  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: {
      educator: { include: { user: true } },
      student: { include: { parent: { include: { user: true } } } },
      slot: true,
    },
  });
  if (!booking) return NextResponse.json({ error: "Rezervasyon bulunamadı" }, { status: 404 });

  const dateStr = new Date(booking.slot.date).toLocaleDateString("tr-TR", {
    weekday: "long", day: "numeric", month: "long",
  });
  const timeStr = `${booking.slot.startTime}–${booking.slot.endTime}`;
  const subjectLabel = SUBJECT_LABELS[booking.subject] ?? booking.subject;

  if (session.user.role === "EDUCATOR") {
    if (booking.educator.userId !== session.user.id) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
    }
    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Geçersiz işlem" }, { status: 400 });
    }

    if (action === "approve") {
      await db.booking.update({ where: { id: bookingId }, data: { status: "CONFIRMED" } });
      // Ödeme kaydını şimdi oluştur
      await db.payment.upsert({
        where: { bookingId },
        update: {},
        create: { bookingId, amount: booking.totalPrice, currency: "TRY", status: "PENDING" },
      });

      const parentUser = booking.student.parent.user;
      const amount = formatCurrency(booking.totalPrice.toNumber());

      await notify({
        userId: parentUser.id,
        title: "Randevunuz Onaylandı!",
        message: `${booking.educator.user.name} talebinizi onayladı. Dersi kesinleştirmek için ödeme yapın.`,
        link: "/parent/bookings",
      });

      await sendEmail({
        to: parentUser.email,
        subject: "Randevunuz Onaylandı — Ödeme Yapın",
        html: emailBookingConfirmed({
          parentName: parentUser.name ?? "Veli",
          educatorName: booking.educator.user.name ?? "Öğretmen",
          studentName: booking.student.name,
          date: dateStr,
          time: timeStr,
          amount,
        }),
      });
    } else {
      await db.booking.update({ where: { id: bookingId }, data: { status: "CANCELLED" } });
      await db.availabilitySlot.update({ where: { id: booking.slotId }, data: { isBooked: false } });

      await notify({
        userId: booking.student.parent.user.id,
        title: "Randevu Talebi Reddedildi",
        message: `${booking.educator.user.name} randevu talebinizi reddetmiştir. Başka bir tarih veya öğretmen seçebilirsiniz.`,
        link: "/parent/bookings",
      });
    }

    return NextResponse.json({ success: true });
  }

  // Veli: ödeme tamamlandı
  if (session.user.role === "PARENT") {
    const parent = await db.parent.findUnique({ where: { userId: session.user.id } });
    if (!parent || booking.student.parentId !== parent.id) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
    }
    if (action !== "payment_complete") {
      return NextResponse.json({ error: "Geçersiz işlem" }, { status: 400 });
    }
    if (booking.status !== "CONFIRMED") {
      return NextResponse.json({ error: "Ödeme için önce öğretmen onayı gerekli." }, { status: 400 });
    }

    await db.payment.update({ where: { bookingId }, data: { status: "PAID" } });
    await db.booking.update({ where: { id: bookingId }, data: { status: "COMPLETED" } });

    // Öğretmene bildirim + email
    const amount = formatCurrency(booking.totalPrice.toNumber());
    await notify({
      userId: booking.educator.userId,
      title: "Ödeme Alındı — Randevu Kesinleşti",
      message: `${booking.student.name} için ödeme tamamlandı. Randevu kesinleşmiştir.`,
      link: "/educator/bookings",
    });
    try {
      await sendEmail({
        to: booking.educator.user.email,
        subject: `Ödeme Alındı — ${booking.student.name}`,
        html: emailPaymentReceived({
          educatorName: booking.educator.user.name ?? "Öğretmen",
          studentName: booking.student.name,
          date: dateStr,
          time: timeStr,
          amount,
        }),
      });
    } catch (e) { console.error("Ödeme emaili gönderilemedi:", e); }

    // Veliye bildirim
    await notify({
      userId: session.user.id,
      title: "Ödeme Tamamlandı — Randevu Kesinleşti ✓",
      message: `${subjectLabel} dersi için ödemeniz alındı. Randevunuz kesinleşmiştir.`,
      link: "/parent/bookings",
    });

    return NextResponse.json({ success: true });
  }

  // Admin
  if (session.user.role === "ADMIN") {
    const statusMap: Record<string, string> = {
      confirm: "CONFIRMED", cancel: "CANCELLED", complete: "COMPLETED",
    };
    if (!statusMap[action]) return NextResponse.json({ error: "Geçersiz işlem" }, { status: 400 });
    await db.booking.update({ where: { id: bookingId }, data: { status: statusMap[action] as never } });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
}
