import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const subject = searchParams.get("subject");
  const gradeLevel = searchParams.get("gradeLevel");

  if (!subject || !gradeLevel) {
    return NextResponse.json({ error: "Subject ve gradeLevel gerekli" }, { status: 400 });
  }

  const gradeLevelNum = parseInt(gradeLevel, 10);

  const all = await db.curriculumTopic.findMany({
    where: { subject, gradeLevel: gradeLevelNum },
    select: {
      id: true,
      name: true,
      description: true,
      learningObjects: true, // kapsadığı konular
      _count: { select: { questions: true } },
    },
    orderBy: { name: "asc" },
  });

  // Soru içeren konu varsa yalnızca onları göster (sınav doğru çalışsın).
  // Hiçbirinde soru yoksa (ör. 1. sınıf — sınav yok) tüm konuları göster ki ders seçilebilsin.
  const withQuestions = all.filter((t) => t._count.questions > 0);
  const topics = withQuestions.length > 0 ? withQuestions : all;

  // UI için sadeleştir: kapsadığı konular + soru sayısı
  const result = topics.map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    coveredTopics: t.learningObjects ?? [],
    questionCount: t._count.questions,
  }));

  // Doğal (numerik) sıralama: "10. Ünite" düz alfabetik sıralamada "2. Ünite"nin
  // önüne düşmesin diye — "1, 2, ... 10" doğru sırada gelsin.
  result.sort((a, b) => a.name.localeCompare(b.name, "tr", { numeric: true }));

  return NextResponse.json(result);
}
