import { auth } from "@/auth";
import { db } from "@/lib/db";
import { notify } from "@/lib/notify";
import { sendEmail, emailBookingConfirmed, emailPaymentReceived, emailLessonReportRequest } from "@/lib/email";
import { createMeetingSpace } from "@/lib/google-meet";
import { gradeLevelToNumber } from "@/lib/assessment";
import { NextResponse } from "next/server";
import { SUBJECT_LABELS, formatCurrency, formatDate } from "@/lib/utils";

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
      topic: true,
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
      // Google Meet linki oluştur
      const meetingUrl = await createMeetingSpace();

      // Onay anı + 24 saatlik ödeme penceresi (son ödeme tarihi)
      const confirmedAt = new Date();
      const deadlineStr = new Date(confirmedAt.getTime() + 24 * 3600 * 1000).toLocaleString("tr-TR", {
        day: "numeric", month: "long", hour: "2-digit", minute: "2-digit",
      });

      await db.booking.update({
        where: { id: bookingId },
        data: { status: "CONFIRMED", confirmedAt, paymentReminderSentAt: null, ...(meetingUrl ? { meetingUrl } : {}) },
      });
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
          deadline: deadlineStr,
        }),
      });

      // Seviye belirleme testi — yalnızca o sınıf+derste soru varsa (ör. 1. sınıfta soru yok)
      const gradeNumber = gradeLevelToNumber(booking.gradeLevel as string);
      const questionCount = await db.levelAssessmentQuestion.count({
        where: { gradeLevel: gradeNumber, subject: booking.subject },
      });
      if (booking.gradeLevel && questionCount > 0) {
        const assessmentData = {
          bookingId,
          studentId: booking.studentId,
          subject: booking.subject,
          gradeLevel: booking.gradeLevel,
          ...(booking.topic ? { topicId: booking.topic.id } : {}),
        };
        const assessment = await db.levelAssessment.create({ data: assessmentData });
        const baseUrl = process.env.NEXTAUTH_URL ?? "https://ogretmenyanimda.com.tr";
        sendEmail({
          to: parentUser.email,
          subject: `${booking.student.name} için seviye testi hazır`,
          html: `
            <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
              <h2 style="color:#0f172a">Seviye Belirleme Testi 📝</h2>
              <p>Merhaba <strong>${parentUser.name ?? "Veli"}</strong>,</p>
              <p>Öğretmenin <strong>${booking.student.name}</strong>'e özel ilk ders planını hazırlayabilmesi için kısa bir seviye belirleme testi hazırlandı.</p>
              <p>Lütfen <strong>${booking.student.name}</strong>'e aşağıdaki linki verin ve testi birlikte yapın:</p>
              <a href="${baseUrl}/test/${assessment.id}" style="display:inline-block;background:#0f172a;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Testi Başlat →</a>
              <p style="color:#64748b;font-size:13px;margin-top:16px">Test yaklaşık 5–10 dakika sürmektedir.</p>
            </div>`,
        }).catch(console.error);
      }
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

    // Ders sonu rapor hatırlatıcısı — ders günü için planlanmış (şimdilik aynı anda gönderilir)
    sendEmail({
      to: booking.educator.user.email,
      subject: `Ders Raporu — ${booking.student.name} (${formatDate(booking.slot.date)})`,
      html: emailLessonReportRequest({
        educatorName: booking.educator.user.name ?? "Öğretmen",
        studentName: booking.student.name,
        date: formatDate(booking.slot.date),
      }),
    }).catch(console.error);

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
