import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { sendEmail, emailLessonReportReady } from "@/lib/email";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const educator = await db.educator.findUnique({
    where: { userId: session.user.id },
    include: { user: true },
  });
  if (!educator) return NextResponse.json({ error: "Öğretmen bulunamadı" }, { status: 404 });

  const { bookingId, topicsCovered, nextSteps, homework, notes } = await req.json();

  if (!bookingId || !topicsCovered?.trim() || !nextSteps?.trim()) {
    return NextResponse.json({ error: "İşlenen konular ve sonraki adımlar zorunludur." }, { status: 400 });
  }

  const booking = await db.booking.findFirst({
    where: { id: bookingId, educatorId: educator.id },
    include: {
      student: { include: { parent: { include: { user: true } } } },
      slot: true,
    },
  });

  if (!booking) return NextResponse.json({ error: "Rezervasyon bulunamadı" }, { status: 404 });

  const existing = await db.lessonReport.findUnique({ where: { bookingId } });
  if (existing) return NextResponse.json({ error: "Bu ders için rapor zaten oluşturulmuş." }, { status: 409 });

  const report = await db.lessonReport.create({
    data: {
      bookingId,
      educatorId: educator.id,
      topicsCovered: topicsCovered.trim(),
      nextSteps: nextSteps.trim(),
      homework: homework?.trim() || null,
      notes: notes?.trim() || null,
    },
  });

  const parentEmail = booking.student.parent.user.email;
  const parentName = booking.student.parent.user.name ?? "Veli";
  const date = booking.slot.date.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });

  sendEmail({
    to: parentEmail,
    subject: `${booking.student.name} için ders raporu hazır`,
    html: emailLessonReportReady({
      parentName,
      educatorName: educator.user.name ?? "Öğretmen",
      studentName: booking.student.name,
      date,
    }),
  }).catch(console.error);

  return NextResponse.json(report, { status: 201 });
}
