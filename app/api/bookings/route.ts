import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { notify } from "@/lib/notify";
import { sendEmail, emailBookingRequest } from "@/lib/email";
import { SUBJECT_LABELS } from "@/lib/utils";

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "PARENT") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { studentId, educatorId, slotId, subject, gradeLevel, totalPrice, notes, topicId } = await req.json();

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
    data: { studentId, educatorId, slotId, subject, gradeLevel: gradeLevel ?? null, topicId: topicId || null, totalPrice, notes: notes || null, status: "PENDING" },
  });

  await db.availabilitySlot.update({ where: { id: slotId }, data: { isBooked: true } });
  // Payment kaydı educator onayladıktan sonra oluşturulacak

  // Veliye: talep oluşturuldu
  await notify({
    userId: session.user.id,
    title: "Randevu Talebiniz Gönderildi",
    message: "Talebiniz öğretmene iletildi. Onayladığında ödeme bilgileri size ulaşacak.",
    link: "/parent/bookings",
  });

  // Öğretmene: yeni talep
  const educator = await db.educator.findUnique({
    where: { id: educatorId },
    include: { user: true },
  });
  if (educator) {
    await notify({
      userId: educator.userId,
      title: "Yeni Ders Talebi",
      message: `${student.name} için ${SUBJECT_LABELS[subject as keyof typeof SUBJECT_LABELS] ?? subject} dersine randevu talebi var.`,
      link: "/educator/bookings",
    });

    // Email to educator (hata booking'i engellemesin)
    try {
      const dateStr = new Date(slot.date).toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" });
      await sendEmail({
        to: educator.user.email,
        subject: `Yeni ders talebi — ${student.name}`,
        html: emailBookingRequest({
          educatorName: educator.user.name ?? "Öğretmen",
          studentName: student.name,
          subject: SUBJECT_LABELS[subject as keyof typeof SUBJECT_LABELS] ?? subject,
          date: dateStr,
          time: `${slot.startTime}–${slot.endTime}`,
          notes: notes || null,
        }),
      });
    } catch (emailErr) {
      console.error("Educator email gönderilemedi:", emailErr);
    }
  }

  return NextResponse.json(booking, { status: 201 });
}
