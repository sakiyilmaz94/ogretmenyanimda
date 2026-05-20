import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import PaymentPage from "@/components/dashboard/PaymentPage";

export default async function BookingPaymentPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const session = await auth();
  if (!session || session.user.role !== "PARENT") redirect("/login");

  const { bookingId } = await params;

  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: {
      student: { include: { parent: true } },
      educator: { include: { user: true } },
      slot: true,
      payment: true,
    },
  });

  if (!booking || booking.student.parent.userId !== session.user.id) {
    notFound();
  }

  if (booking.payment?.status === "PAID") {
    redirect("/parent/bookings?payment=already_paid");
  }

  const data = {
    bookingId: booking.id,
    studentName: booking.student.name,
    educatorName: booking.educator.user.name ?? "Öğretmen",
    subject: booking.subject,
    slotDate: booking.slot.date.toISOString().split("T")[0],
    slotStartTime: booking.slot.startTime,
    slotEndTime: booking.slot.endTime,
    totalPrice: Number(booking.totalPrice),
  };

  return <PaymentPage booking={data} />;
}
