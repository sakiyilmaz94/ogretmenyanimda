import { auth } from "@/auth";
import { db } from "@/lib/db";
import { notify } from "@/lib/notify";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { id } = await params;
  const { action, rejectionNote } = await req.json();

  const lesson = await db.educatorLesson.findUnique({
    where: { id },
    include: { educator: true, lessonProgram: true },
  });
  if (!lesson) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });

  if (action === "approve") {
    const updated = await db.educatorLesson.update({
      where: { id },
      data: { status: "APPROVED", approvedAt: new Date(), rejectionNote: null },
    });
    await notify({
      userId: lesson.educator.userId,
      title: "Ders Onaylandı",
      message: `"${lesson.lessonProgram.name}" programı onaylandı ve profilde yayına girdi.`,
      link: "/educator/derslerim",
    });
    return NextResponse.json(updated);
  }

  if (action === "reject") {
    const updated = await db.educatorLesson.update({
      where: { id },
      data: { status: "REJECTED", rejectionNote: rejectionNote ?? null },
    });
    await notify({
      userId: lesson.educator.userId,
      title: "Ders Reddedildi",
      message: rejectionNote
        ? `"${lesson.lessonProgram.name}" reddedildi. Sebep: ${rejectionNote}`
        : `"${lesson.lessonProgram.name}" programı reddedildi.`,
      link: "/educator/derslerim",
    });
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: "Geçersiz işlem" }, { status: 400 });
}
