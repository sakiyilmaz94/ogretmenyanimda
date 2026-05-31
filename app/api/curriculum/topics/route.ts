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

  const topics = await db.curriculumTopic.findMany({
    where: {
      subject,
      gradeLevel: gradeLevelNum,
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(topics);
}
