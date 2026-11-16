import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { notify } from "@/lib/notify";
import { sendEmail, emailEducatorApproved } from "@/lib/email";
import { missingEducatorFields } from "@/lib/educator-requirements";

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { educatorId, action, rejectionNote } = await req.json();

  const educator = await db.educator.findUnique({ where: { id: educatorId }, include: { user: true } });
  if (!educator) return NextResponse.json({ error: "Öğretmen bulunamadı" }, { status: 404 });

  if (action === "approve") {
    const missing = missingEducatorFields({
      phone: educator.phone,
      subjects: educator.subjects,
      gradeLevels: educator.gradeLevels,
      hourlyRate: educator.hourlyRate.toNumber(),
      experience: educator.experience,
      coachingCertUrl: educator.coachingCertUrl,
    });
    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Eksik bilgi var, onaylanamaz: ${missing.join(", ")}.` },
        { status: 400 }
      );
    }
    await db.educator.update({
      where: { id: educatorId },
      data: {
        status: "APPROVED",
        approvedAt: new Date(),
        isProfilePublic: true,
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
