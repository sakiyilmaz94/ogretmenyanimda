import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { retrieveCheckoutForm } from "@/lib/iyzico";
import { notify } from "@/lib/notify";
import { sendEmail, emailPaymentReceived } from "@/lib/email";
import { SUBJECT_LABELS, formatCurrency } from "@/lib/utils";

// iyzico POST callback ile token gönderir
export async function POST(req: Request) {
  let token: string | undefined;

  const contentType = req.headers.get("content-type") ?? "";
  if (contentType.includes("application/x-www-form-urlencoded")) {
    const text = await req.text();
    const params = new URLSearchParams(text);
    token = params.get("token") ?? undefined;
  } else {
    const body = await req.json().catch(() => ({}));
    token = body.token;
  }

  if (!token) {
    return NextResponse.redirect(new URL("/parent/bookings?payment=failed", req.url));
  }

  const result = await retrieveCheckoutForm(token);

  if (!result.success || !result.bookingId) {
    return NextResponse.redirect(new URL("/parent/bookings?payment=failed", req.url));
  }

  try {
    const booking = await db.booking.findUnique({
      where: { id: result.bookingId },
      include: {
        payment: true,
        educator: { include: { user: true } },
        student: { include: { parent: { include: { user: true } } } },
        slot: true,
      },
    });

    if (!booking) {
      return NextResponse.redirect(new URL("/parent/bookings?payment=failed", req.url));
    }

    await db.booking.update({ where: { id: booking.id }, data: { status: "COMPLETED" } });

    if (booking.payment) {
      await db.payment.update({
        where: { id: booking.payment.id },
        data: { status: "PAID", iyzicoPaymentId: result.paymentId ?? null },
      });
    }

    const dateStr = new Date(booking.slot.date).toLocaleDateString("tr-TR", {
      weekday: "long", day: "numeric", month: "long",
    });
    const timeStr = `${booking.slot.startTime}–${booking.slot.endTime}`;
    const amount = formatCurrency(booking.totalPrice.toNumber());
    const subjectLabel = SUBJECT_LABELS[booking.subject] ?? booking.subject;

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

    await notify({
      userId: booking.student.parent.user.id,
      title: "Ödeme Tamamlandı — Randevu Kesinleşti ✓",
      message: `${subjectLabel} dersi için ödemeniz alındı. Randevunuz kesinleşmiştir.`,
      link: "/parent/bookings",
    });
  } catch {
    return NextResponse.redirect(new URL("/parent/bookings?payment=failed", req.url));
  }

  return NextResponse.redirect(
    new URL(`/parent/bookings?payment=success&bookingId=${result.bookingId}`, req.url)
  );
}
