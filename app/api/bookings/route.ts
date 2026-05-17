import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "PARENT") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { studentId, educatorId, slotId, subject, totalPrice } = await req.json();

  if (!studentId || !educatorId || !slotId || !subject || !totalPrice) {
    return NextResponse.json({ error: "Eksik alan." }, { status: 400 });
  }

  const slot = await db.availabilitySlot.findUnique({ where: { id: slotId } });
  if (!slot || slot.isBooked) {
    return NextResponse.json({ error: "Bu slot müsait değil." }, { status: 400 });
  }

  const parent = await db.parent.findUnique({ where: { userId: session.user.id } });
  if (!parent) return NextResponse.json({ error: "Veli bulunamadı." }, { status: 404 });

  const student = await db.student.findUnique({ where: { id: studentId } });
  if (!student || student.parentId !== parent.id) {
    return NextResponse.json({ error: "Öğrenci bulunamadı." }, { status: 404 });
  }

  const booking = await db.booking.create({
    data: {
      studentId,
      educatorId,
      slotId,
      subject,
      totalPrice,
      status: "PENDING",
    },
  });

  await db.availabilitySlot.update({ where: { id: slotId }, data: { isBooked: true } });

  await db.payment.create({
    data: {
      bookingId: booking.id,
      amount: totalPrice,
      currency: "TRY",
      status: "PENDING",
    },
  });

  await db.notification.create({
    data: {
      userId: session.user.id,
      title: "Rezervasyon Oluşturuldu",
      message: `Ders rezervasyonunuz oluşturuldu. Ödeme tamamlandığında onaylanacak.`,
      link: "/parent/bookings",
    },
  });

  return NextResponse.json(booking, { status: 201 });
}
