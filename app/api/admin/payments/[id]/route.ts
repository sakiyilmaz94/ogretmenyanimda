import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { notify } from "@/lib/notify";
import { getCommissionRate } from "@/lib/finance";
import { sendEmail, emailPaymentReceived, emailPaymentSuccessParent } from "@/lib/email";
import { formatCurrency } from "@/lib/utils";
import { revalidatePath } from "next/cache";

// Admin bir IBAN havalesini onaylar (PAID) — velinin havalesini bankadan görüp işaretler.
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { id } = await params;
  const { action } = await req.json();

  const payment = await db.payment.findUnique({
    where: { id },
    include: {
      booking: {
        include: {
          student: { include: { parent: { include: { user: true } } } },
          educator: { include: { user: true } },
          slot: true,
        },
      },
    },
  });
  if (!payment) return NextResponse.json({ error: "Ödeme bulunamadı" }, { status: 404 });

  if (action !== "approve") {
    return NextResponse.json({ error: "Geçersiz işlem" }, { status: 400 });
  }
  if (payment.status === "PAID") {
    return NextResponse.json({ error: "Bu ödeme zaten onaylanmış." }, { status: 400 });
  }

  await db.payment.update({ where: { id }, data: { status: "PAID", commissionRate: await getCommissionRate() } });
  await db.booking.update({ where: { id: payment.bookingId }, data: { status: "COMPLETED" } });

  const parentUserId = payment.booking.student.parent.user.id;
  await notify({
    userId: parentUserId,
    title: "Ödemeniz Onaylandı ✓",
    message: `${payment.booking.student.name} için havaleniz onaylandı, randevunuz kesinleşti.`,
    link: "/parent/bookings",
  });
  await notify({
    userId: payment.booking.educator.userId,
    title: "Ödeme Onaylandı — Randevu Kesinleşti",
    message: `${payment.booking.student.name} için ödeme onaylandı. Randevu kesinleşmiştir.`,
    link: "/educator/bookings",
  });

  // E-postalar: hata ödeme onayını geri almasın, ama serverless'ta yarıda kesilmesin diye await
  const { booking } = payment;
  const parentUser = booking.student.parent.user;
  const dateStr = new Date(booking.slot.date).toLocaleDateString("tr-TR", {
    weekday: "long", day: "numeric", month: "long",
  });
  const timeStr = `${booking.slot.startTime}–${booking.slot.endTime}`;
  const amount = formatCurrency(booking.totalPrice.toNumber());

  try {
    await sendEmail({
      to: parentUser.email,
      subject: "Ödemeniz Alındı — Randevunuz Kesinleşti ✓",
      html: emailPaymentSuccessParent({
        parentName: parentUser.name ?? "Veli",
        studentName: booking.student.name,
        educatorName: booking.educator.user.name ?? "Öğretmen",
        date: dateStr,
        time: timeStr,
        amount,
      }),
    });
  } catch (e) { console.error("Veli ödeme emaili gönderilemedi:", e); }

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
  } catch (e) { console.error("Öğretmen ödeme emaili gönderilemedi:", e); }

  revalidatePath("/admin/payments");
  return NextResponse.json({ ok: true });
}
