import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { MIN_HOURLY_RATE, MIN_RATE_MESSAGE } from "@/lib/educator-requirements";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "EDUCATOR") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const educator = await db.educator.findUnique({ where: { userId: session.user.id } });
  if (!educator) return NextResponse.json({ error: "Öğretmen bulunamadı." }, { status: 404 });
  return NextResponse.json(educator);
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "EDUCATOR") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const {
    bio, subjects, gradeLevels, hourlyRate, phone,
    photoUrl, titleName, experience, skills, certificates, linkedinUrl, isProfilePublic,
  } = await req.json();

  if (hourlyRate !== undefined && !(Number(hourlyRate) >= MIN_HOURLY_RATE)) {
    return NextResponse.json({ error: MIN_RATE_MESSAGE }, { status: 400 });
  }

  const educator = await db.educator.findUnique({ where: { userId: session.user.id } });
  if (!educator) return NextResponse.json({ error: "Öğretmen bulunamadı." }, { status: 404 });

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
      // APPROVED öğretmenin mevcut değeri korunur; form göndermediyse false'a düşmez
      ...(isProfilePublic !== undefined ? { isProfilePublic } : {}),
    },
  });

  return NextResponse.json(updated);
}
