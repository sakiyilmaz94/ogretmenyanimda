import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { notify } from "@/lib/notify";

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { educatorId, action, rejectionNote } = await req.json();

  const educator = await db.educator.findUnique({ where: { id: educatorId } });
  if (!educator) return NextResponse.json({ error: "Eğitmen bulunamadı" }, { status: 404 });

  if (action === "approve") {
    await db.educator.update({
      where: { id: educatorId },
      data: { status: "APPROVED", approvedAt: new Date() },
    });
    await notify({
      userId: educator.userId,
      title: "Başvurunuz Onaylandı",
      message: "Tebrikler! Eğitmen başvurunuz onaylandı. Artık profilinizi oluşturabilir ve ders verebilirsiniz.",
      link: "/educator/profile",
    });
  } else if (action === "reject") {
    await db.educator.update({
      where: { id: educatorId },
      data: { status: "REJECTED", rejectedAt: new Date(), rejectionNote },
    });
    await notify({
      userId: educator.userId,
      title: "Başvurunuz Reddedildi",
      message: rejectionNote
        ? `Başvurunuz reddedildi. Sebep: ${rejectionNote}`
        : "Başvurunuz değerlendirme sonucunda reddedildi.",
      link: "/educator",
    });
  }

  return NextResponse.json({ success: true });
}
