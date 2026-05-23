import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getQuestions } from "@/lib/assessment-questions";
import { notify } from "@/lib/notify";
import { sendEmail } from "@/lib/email";
import { SUBJECT_LABELS, GRADE_LABELS } from "@/lib/utils";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const assessment = await db.levelAssessment.findUnique({
    where: { id },
    include: { responses: true },
  });

  if (!assessment) return NextResponse.json({ error: "Test bulunamadı" }, { status: 404 });
  if (assessment.status === "COMPLETED") {
    return NextResponse.json({ error: "Bu test zaten tamamlandı." }, { status: 409 });
  }

  const questions = getQuestions(assessment.subject, assessment.gradeLevel);
  const subset = questions.slice(0, 7);

  return NextResponse.json({
    id: assessment.id,
    subject: assessment.subject,
    gradeLevel: assessment.gradeLevel,
    questions: subset.map((q, i) => ({
      index: i,
      question: q.question,
      options: q.options,
    })),
  });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const assessment = await db.levelAssessment.findUnique({
    where: { id },
    include: {
      booking: {
        include: {
          educator: { include: { user: true } },
          student: true,
        },
      },
    },
  });
  if (!assessment) return NextResponse.json({ error: "Test bulunamadı" }, { status: 404 });
  if (assessment.status === "COMPLETED") {
    return NextResponse.json({ error: "Bu test zaten tamamlandı." }, { status: 409 });
  }

  const { answers } = await req.json() as { answers: { index: number; selected: number }[] };

  const questions = getQuestions(assessment.subject, assessment.gradeLevel).slice(0, 7);

  await db.$transaction([
    db.assessmentResponse.deleteMany({ where: { assessmentId: id } }),
    ...answers.map((a) =>
      db.assessmentResponse.create({
        data: {
          assessmentId: id,
          questionIndex: a.index,
          selectedAnswer: a.selected,
        },
      })
    ),
    db.levelAssessment.update({
      where: { id },
      data: { status: "COMPLETED", completedAt: new Date() },
    }),
  ]);

  const correct = answers.filter((a) => questions[a.index]?.correct === a.selected).length;

  // Öğretmene bildirim ve email gönder
  const educator = assessment.booking.educator;
  const student = assessment.booking.student;
  const subjectLabel = SUBJECT_LABELS[assessment.subject] ?? assessment.subject;
  const gradeLabel = GRADE_LABELS[assessment.gradeLevel] ?? assessment.gradeLevel;
  const pct = Math.round((correct / questions.length) * 100);

  await notify({
    userId: educator.userId,
    title: "Seviye Testi Tamamlandı 📊",
    message: `${student.name}, ${subjectLabel} (${gradeLabel}) seviye testini tamamladı. Sonuç: ${correct}/${questions.length} (${pct}%)`,
    link: "/educator/bookings",
  });

  sendEmail({
    to: educator.user.email,
    subject: `${student.name} seviye testini tamamladı — ${subjectLabel}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
        <h2 style="color:#0f172a">Seviye Testi Sonucu 📊</h2>
        <p>Merhaba <strong>${educator.user.name ?? "Öğretmenim"}</strong>,</p>
        <p><strong>${student.name}</strong>, <strong>${subjectLabel}</strong> (${gradeLabel}) seviye belirleme testini tamamladı.</p>
        <div style="background:#f1f5f9;border-radius:12px;padding:20px;margin:16px 0;text-align:center">
          <p style="font-size:36px;font-weight:bold;color:#0f172a;margin:0">${pct}%</p>
          <p style="color:#64748b;margin:4px 0">${correct} / ${questions.length} doğru</p>
        </div>
        <p>İlk ders planını hazırlarken bu sonucu göz önünde bulundurabilirsiniz.</p>
      </div>`,
  }).catch(console.error);

  return NextResponse.json({ correct, total: questions.length });
}
