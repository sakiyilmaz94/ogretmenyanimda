import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getQuestions } from "@/lib/assessment-questions";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "EDUCATOR") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { id } = await params;
  const assessment = await db.levelAssessment.findUnique({
    where: { id },
    include: {
      responses: { orderBy: { questionIndex: "asc" } },
      booking: { include: { educator: true, student: true, topic: true } },
    },
  });

  if (!assessment) return NextResponse.json({ error: "Test bulunamadı" }, { status: 404 });

  // Sadece ilgili öğretmen görebilir
  if (assessment.booking.educator.userId !== session.user.id) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  const questions = getQuestions(assessment.subject, assessment.gradeLevel).slice(0, 7);

  const results = questions.map((q, i) => {
    const response = assessment.responses.find((r) => r.questionIndex === i);
    return {
      index: i,
      question: q.question,
      options: q.options,
      correct: q.correct,
      selected: response?.selectedAnswer ?? null,
    };
  });

  const correctCount = results.filter((r) => r.selected === r.correct).length;

  return NextResponse.json({
    subject: assessment.subject,
    gradeLevel: assessment.gradeLevel,
    studentName: assessment.booking.student.name,
    topic: (assessment.booking.topic as any)?.name || null,
    completedAt: assessment.completedAt,
    results,
    correctCount,
    total: questions.length,
  });
}
