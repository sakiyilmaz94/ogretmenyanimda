import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const program = await db.lessonProgram.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(program);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { id } = await params;

  await db.lessonProgram.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
