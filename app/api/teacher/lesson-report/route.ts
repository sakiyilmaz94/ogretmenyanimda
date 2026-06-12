import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { sendEmail, emailLessonReport } from "@/lib/email";
import { SUBJECT_LABELS } from "@/lib/utils";
import { Prisma } from "@prisma/client";

const clampInt = (v: unknown, min: number, max: number) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min;
};

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "EDUCATOR") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const educator = await db.educator.findUnique({ where: { userId: session.user.id }, include: { user: true } });
  if (!educator) return NextResponse.json({ error: "Öğretmen bulunamadı" }, { status: 404 });

  const body = await req.json();
  const { bookingId } = body;
  const topics: string[] = Array.isArray(body.topics) ? body.topics.map((t: string) => String(t).trim()).filter(Boolean).slice(0, 5) : [];

  if (!bookingId) return NextResponse.json({ error: "bookingId gerekli" }, { status: 400 });
  if (topics.length === 0) return NextResponse.json({ error: "En az bir işlenen konu girilmeli." }, { status: 400 });

  const booking = await db.booking.findFirst({
    where: { id: bookingId, educatorId: educator.id },
    include: { student: { include: { parent: { include: { user: true } } } }, slot: true },
  });
  if (!booking) return NextResponse.json({ error: "Rezervasyon bulunamadı" }, { status: 404 });

  const participation = clampInt(body.participation, 1, 5);
  const comprehension = clampInt(body.comprehension, 1, 5);
  const confidence = clampInt(body.confidence, 1, 5);
  const mastery = clampInt(body.mastery, 1, 4);
  const highlight = typeof body.highlight === "string" ? body.highlight.trim().slice(0, 200) || null : null;
  const parentTip = typeof body.parentTip === "string" ? body.parentTip.trim().slice(0, 300) || null : null;
  const homework = Array.isArray(body.homework)
    ? body.homework
        .filter((h: { title?: string }) => h && String(h.title ?? "").trim())
        .slice(0, 3)
        .map((h: { title: string; source?: string }) => ({ title: String(h.title).trim(), source: String(h.source ?? "").trim() }))
    : [];

  const data = {
    topics,
    participation, comprehension, confidence, mastery,
    highlight, parentTip,
    homework: (homework as Prisma.InputJsonValue),
    sentAt: new Date(),
  };

  const report = await db.lessonReport.upsert({
    where: { bookingId },
    update: data,
    create: { bookingId, educatorId: educator.id, ...data },
  });

  // Veliye zengin rapor e-postası
  const parentUser = booking.student.parent.user;
  const subjectLabel = SUBJECT_LABELS[booking.subject] ?? booking.subject;
  const date = booking.slot.date.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
  const time = `${booking.slot.startTime}–${booking.slot.endTime}`;

  sendEmail({
    to: parentUser.email,
    subject: `${booking.student.name} · Ders Dönüt Raporu`,
    html: emailLessonReport({
      studentName: booking.student.name,
      educatorName: educator.user.name ?? "Öğretmen",
      educatorBranch: subjectLabel,
      subjectLabel,
      date, time,
      topics, participation, comprehension, confidence, mastery, highlight, homework, parentTip,
    }),
  }).catch((e) => console.error("Rapor e-postası gönderilemedi:", e));

  revalidatePath("/educator/bookings");
  revalidatePath("/parent/bookings");
  return NextResponse.json({ success: true, id: report.id });
}
