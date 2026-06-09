import { db } from "@/lib/db";

// GradeLevel enum (ILKOKUL_2 vb.) → sınıf numarası
export const GRADE_MAP: Record<string, number> = {
  ILKOKUL_1: 1,
  ILKOKUL_2: 2,
  ILKOKUL_3: 3,
  ILKOKUL_4: 4,
  ORTAOKUL_5: 5,
  ORTAOKUL_6: 6,
  ORTAOKUL_7: 7,
  ORTAOKUL_8: 8,
};

export function gradeLevelToNumber(gradeLevel: string): number {
  return GRADE_MAP[gradeLevel] ?? 2;
}

/**
 * Seviye testi sorularını DB'den çeker.
 * Seçilen konuya (topicId) bağlı soru yoksa sınıf+ders havuzuna geri düşer.
 *
 * ÖNEMLİ: GET (öğrenci gösterimi), POST (puanlama) ve results (öğretmen sonucu)
 * AYNI kaynağı ve `orderBy: { id: "asc" }` sırasını kullanmalı ki questionIndex
 * her üç yerde aynı soruya denk gelsin. Aksi halde sonuçlar yanlış eşleşir.
 */
export async function fetchAssessmentQuestions(
  gradeNumber: number,
  subject: string,
  topicId: string | null
) {
  if (topicId) {
    const byTopic = await db.levelAssessmentQuestion.findMany({
      where: { gradeLevel: gradeNumber, subject, topicId },
      orderBy: { id: "asc" },
      take: 10,
    });
    if (byTopic.length > 0) return byTopic;
  }
  return db.levelAssessmentQuestion.findMany({
    where: { gradeLevel: gradeNumber, subject },
    orderBy: { id: "asc" },
    take: 10,
  });
}

// Bir soru kaydının şıklarını [a,b,c,d] dizisine çevirir (boşları atar).
// Bazı kaynaklarda şıklar "A) ..." gibi harf ön ekli; UI zaten kendi A/B/C/D
// etiketini eklediği için bu ön eki temizleriz (yoksa dokunmaz) — çift harf önlenir.
export function questionOptions(q: {
  option1: string | null;
  option2: string | null;
  option3: string | null;
  option4: string | null;
}): string[] {
  return [q.option1, q.option2, q.option3, q.option4]
    .filter((o): o is string => Boolean(o))
    .map((o) => o.replace(/^\s*[A-Da-d]\)\s*/, ""));
}
