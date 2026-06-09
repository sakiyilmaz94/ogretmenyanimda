import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import {
  fetchAssessmentQuestions,
  gradeLevelToNumber,
  questionOptions,
} from "@/lib/assessment";

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

  // Öğrencinin gördüğü/çözdüğü SORULARIN AYNISINI çek (aynı kaynak + aynı sıralama)
  // ki questionIndex doğru soruya denk gelsin.
  const gradeNumber = gradeLevelToNumber(assessment.gradeLevel as string);
  const questions = await fetchAssessmentQuestions(
    gradeNumber,
    assessment.subject,
    assessment.topicId
  );

  const results = questions.map((q, i) => {
    const response = assessment.responses.find((r) => r.questionIndex === i);
    return {
      index: i,
      question: q.question,
      options: questionOptions(q),
      correct: q.correctAnswer,
      selected: response?.selectedAnswer ?? null,
    };
  });

  const correctCount = results.filter((r) => r.selected === r.correct).length;

  return NextResponse.json({
    subject: assessment.subject,
    gradeLevel: assessment.gradeLevel,
    studentName: assessment.booking.student.name,
    topic: assessment.booking.topic?.name ?? null,
    completedAt: assessment.completedAt,
    results,
    correctCount,
    total: questions.length,
  });
}
