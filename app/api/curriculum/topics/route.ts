import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const subjectMap: Record<string, string> = {
  TURKCE: "TÜRKÇE",
  MATEMATIK: "MATEMATIK",
  FEN_BILIMLERI: "FEN BİLİMLERİ",
  SOSYAL_BILGILER: "SOSYAL BİLGİLER",
  INGILIZCE: "INGILIZCE",
  INKILAP_TARIHI: "T.C. İNKILAP TARİHİ VE ATATÜRKÇÜLÜK",
  ILK_OKUMA_YAZMA: "İLK OKUMA YAZMA",
  HAYAT_BILGISI: "HAYAT BİLGİSİ",
  OGRENCI_KOCLUGU: "ÖĞRENCI KOÇLUĞU",
  DIGER: "DİĞER",
};

const gradeMap: Record<string, number> = {
  ILKOKUL_1: 1,
  ILKOKUL_2: 2,
  ILKOKUL_3: 3,
  ILKOKUL_4: 4,
  ORTAOKUL_5: 5,
  ORTAOKUL_6: 6,
  ORTAOKUL_7: 7,
  ORTAOKUL_8: 8,
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get("subject");
    const gradeLevel = searchParams.get("gradeLevel");

    if (!subject || !gradeLevel) {
      return NextResponse.json(
        { error: "Subject and gradeLevel parameters required" },
        { status: 400 }
      );
    }

    // Convert enum to database subject name
    const dbSubject = subjectMap[subject] || subject;

    // Parse grade level (could be enum like "ILKOKUL_1" or number like "1")
    const gradeLevelNum = gradeMap[gradeLevel] || parseInt(gradeLevel);

    // Sadece sorularının olduğu topic'leri getir
    const allTopics = await db.curriculumTopic.findMany({
      where: {
        subject: dbSubject,
        gradeLevel: gradeLevelNum,
      },
      orderBy: { name: "asc" },
      include: {
        questions: {
          select: { id: true },
          take: 1, // Sadece birinin var olup olmadığını kontrol et
        },
      },
    });

    // Sorularının olduğu topic'leri filter'le
    const topicsWithQuestions = allTopics
      .filter((t) => t.questions.length > 0)
      .map((t) => ({
        id: t.id,
        name: t.name,
        description: t.description,
      }));

    return NextResponse.json(topicsWithQuestions, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    console.error("Error fetching topics:", error);
    return NextResponse.json({ error: "Failed to fetch topics" }, { status: 500 });
  }
}
