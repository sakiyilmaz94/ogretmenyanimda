import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { notify } from "@/lib/notify";
import { sendEmail, emailEducatorApproved } from "@/lib/email";

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { educatorId, action, rejectionNote } = await req.json();

  const educator = await db.educator.findUnique({ where: { id: educatorId }, include: { user: true } });
  if (!educator) return NextResponse.json({ error: "Öğretmen bulunamadı" }, { status: 404 });

  if (action === "approve") {
    await db.educator.update({
      where: { id: educatorId },
      data: {
        status: "APPROVED",
        approvedAt: new Date(),
        isProfilePublic: true,
        // Subjects/gradeLevels set edilmemişse, default values
        ...(educator.subjects.length === 0 && { subjects: ["MATEMATIK"] }),
        ...(educator.gradeLevels.length === 0 && { gradeLevels: ["ILKOKUL_1", "ILKOKUL_2", "ILKOKUL_3", "ILKOKUL_4", "ORTAOKUL_5", "ORTAOKUL_6", "ORTAOKUL_7", "ORTAOKUL_8"] }),
      },
    });
    await notify({
      userId: educator.userId,
      title: "Başvurunuz Onaylandı",
      message: "Tebrikler! Öğretmen başvurunuz onaylandı. Artık profilinizi oluşturabilir ve ders verebilirsiniz.",
      link: "/educator/profile",
    });
    // Onay sonrası "aramıza hoş geldin" maili
    sendEmail({
      to: educator.user.email,
      subject: "Aramıza Hoş Geldiniz! Başvurunuz Onaylandı 🎉",
      html: emailEducatorApproved({ name: educator.user.name ?? "Öğretmenim" }),
    }).catch(console.error);
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
