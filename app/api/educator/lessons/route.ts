import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "EDUCATOR") return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const educator = await db.educator.findUnique({ where: { userId: session.user.id } });
  if (!educator) return NextResponse.json({ error: "Öğretmen bulunamadı" }, { status: 404 });

  const lessons = await db.educatorLesson.findMany({
    where: { educatorId: educator.id },
    include: { lessonProgram: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(lessons);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "EDUCATOR") return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const educator = await db.educator.findUnique({ where: { userId: session.user.id } });
  if (!educator) return NextResponse.json({ error: "Öğretmen bulunamadı" }, { status: 404 });

  const { lessonProgramId, price } = await req.json();

  if (!lessonProgramId || !price) {
    return NextResponse.json({ error: "Ders programı ve fiyat zorunludur." }, { status: 400 });
  }

  const lesson = await db.educatorLesson.upsert({
    where: { educatorId_lessonProgramId: { educatorId: educator.id, lessonProgramId } },
    update: { price, status: "PENDING_APPROVAL" },
    create: { educatorId: educator.id, lessonProgramId, price },
    include: { lessonProgram: true },
  });

  return NextResponse.json(lesson, { status: 201 });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "EDUCATOR") return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const educator = await db.educator.findUnique({ where: { userId: session.user.id } });
  if (!educator) return NextResponse.json({ error: "Öğretmen bulunamadı" }, { status: 404 });

  const { id } = await req.json();
  await db.educatorLesson.delete({ where: { id, educatorId: educator.id } });
  return NextResponse.json({ ok: true });
}
