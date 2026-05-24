import { NextResponse } from "next/server";
import { db } from "@/lib/db";

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

    const topics = await db.curriculumTopic.findMany({
      where: {
        subject,
        gradeLevel: parseInt(gradeLevel),
      },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    return NextResponse.json(topics);
  } catch (error) {
    console.error("Error fetching topics:", error);
    return NextResponse.json({ error: "Failed to fetch topics" }, { status: 500 });
  }
}
