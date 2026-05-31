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

  const topics = await db.curriculumTopic.findMany({
    where: {
      subject: {
        in: subjectVariants,
      },
      gradeLevel: parseInt(gradeLevel, 10),
    },
    select: {
      id: true,
      name: true,
      description: true,
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(topics);
}
