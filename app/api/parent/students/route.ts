import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "PARENT") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { parentId, name, gradeLevel, birthDate, notes } = await req.json();

  const parent = await db.parent.findUnique({ where: { id: parentId } });
  if (!parent || parent.userId !== session.user.id) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const student = await db.student.create({
    data: {
      parentId,
      name,
      gradeLevel,
      birthDate: birthDate ? new Date(birthDate) : null,
      notes,
    },
  });

  return NextResponse.json(student);
}
