import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ studentId: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "PARENT") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { studentId } = await params;
  const parent = await db.parent.findUnique({ where: { userId: session.user.id } });
  if (!parent) return NextResponse.json({ error: "Veli bulunamadı." }, { status: 404 });

  const student = await db.student.findUnique({ where: { id: studentId } });
  if (!student || student.parentId !== parent.id) {
    return NextResponse.json({ error: "Öğrenci bulunamadı." }, { status: 404 });
  }

  await db.student.delete({ where: { id: studentId } });
  return NextResponse.json({ success: true });
}
