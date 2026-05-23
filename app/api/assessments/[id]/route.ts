import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getQuestions } from "@/lib/assessment-questions";

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
  const assessment = await db.levelAssessment.findUnique({ where: { id } });
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

  return NextResponse.json({ correct, total: questions.length });
}
