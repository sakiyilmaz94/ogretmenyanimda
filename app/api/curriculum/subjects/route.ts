import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Bir sınıf seviyesinde müfredatı (soru içeren konusu) olan dersleri döner.
// Rezervasyon sihirbazında, öğretmenin branşları bu listeyle kesiştirilir.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const gradeLevel = searchParams.get("gradeLevel");
  if (!gradeLevel) {
    return NextResponse.json({ error: "gradeLevel gerekli" }, { status: 400 });
  }

  const rows = await db.curriculumTopic.findMany({
    where: { gradeLevel: parseInt(gradeLevel, 10), questions: { some: {} } },
    select: { subject: true },
    distinct: ["subject"],
  });

  return NextResponse.json(rows.map((r) => r.subject));
}
