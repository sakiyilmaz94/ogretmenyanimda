import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "EDUCATOR") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const {
    bio, subjects, gradeLevels, hourlyRate, phone,
    photoUrl, titleName, experience, skills, certificates, linkedinUrl, isProfilePublic,
  } = await req.json();

  const educator = await db.educator.findUnique({ where: { userId: session.user.id } });
  if (!educator) return NextResponse.json({ error: "Eğitmen bulunamadı." }, { status: 404 });

  const updated = await db.educator.update({
    where: { id: educator.id },
    data: {
      bio, subjects, gradeLevels, hourlyRate, phone,
      photoUrl: photoUrl ?? null,
      titleName: titleName ?? null,
      experience: experience ? Number(experience) : null,
      skills: skills ?? [],
      certificates: certificates ?? [],
      linkedinUrl: linkedinUrl ?? null,
      isProfilePublic: isProfilePublic ?? false,
    },
  });

  return NextResponse.json(updated);
}
