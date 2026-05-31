import { NextResponse } from "next/server";
import { db } from "@/lib/db";

function normalizeSubject(subject: string): string[] {
  const mappings: Record<string, string[]> = {
    MATEMATIK: ["MATEMATIK"],
    FEN_BILIMLERI: ["FEN_BILIMLERI", "FEN BİLİMLERİ"],
    SOSYAL_BILGILER: ["SOSYAL_BILGILER", "SOSYAL BİLGİLER"],
    INKILAP_TARIHI: ["TC_INKILAP_TARIHI", "T.C. İNKILAP TARİHİ VE ATATÜRKÇÜLÜK", "INKILAP_TARIHI"],
    TURKCE: ["TÜRKÇE", "TURKCE"],
    HAYAT_BILGISI: ["HAYAT BİLGİSİ", "HAYAT_BILGISI"],
  };

  for (const [key, values] of Object.entries(mappings)) {
    if (values.includes(subject)) {
      return values;
    }
  }

  return [subject];
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const subject = searchParams.get("subject");
  const gradeLevel = searchParams.get("gradeLevel");

  if (!subject || !gradeLevel) {
    return NextResponse.json({ error: "Subject ve gradeLevel gerekli" }, { status: 400 });
  }

  const subjectVariants = normalizeSubject(subject);
  const gradeLevelNum = parseInt(gradeLevel, 10);

  const allTopics = await db.curriculumTopic.findMany({
    where: {
      subject: {
        in: subjectVariants,
      },
      gradeLevel: gradeLevelNum,
    },
    select: {
      id: true,
      name: true,
      description: true,
      unit: true,
    },
  });

  // Group by theme/unit name and deduplicate
  const topicMap = new Map<string, { id: string; name: string; description?: string }>();

  for (const topic of allTopics) {
    // For new data: use name (already tema/ünite adı)
    // For old data: use unit field (tema adı) instead of name (learning outcome)
    const themeName = topic.unit || topic.name;

    if (!topicMap.has(themeName)) {
      topicMap.set(themeName, {
        id: topic.id,
        name: themeName,
        description: topic.description,
      });
    }
  }

  const topics = Array.from(topicMap.values()).sort((a, b) => a.name.localeCompare(b.name, "tr-TR"));

  return NextResponse.json(topics);
}
