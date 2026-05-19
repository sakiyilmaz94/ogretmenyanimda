import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const programs = await db.lessonProgram.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(programs);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const body = await req.json();
  const { name, description, subject, gradeLevel, durationMin, maxStudents } = body;

  if (!name || !subject || !gradeLevel) {
    return NextResponse.json({ error: "Ad, konu ve sınıf zorunludur." }, { status: 400 });
  }

  const program = await db.lessonProgram.create({
    data: {
      name,
      description: description || null,
      subject,
      gradeLevel,
      durationMin: durationMin ?? 45,
      maxStudents: maxStudents ?? 1,
    },
  });

  return NextResponse.json(program, { status: 201 });
}
