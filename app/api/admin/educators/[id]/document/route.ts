import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { signedDocUrl } from "@/lib/private-docs";

// Yalnızca ADMIN: öğretmenin diploma / kimlik / koçluk sertifikasını kısa ömürlü imzalı bağlantıyla açar.
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const { id } = await params;
  const type = new URL(req.url).searchParams.get("type");

  const educator = await db.educator.findUnique({
    where: { id },
    select: { diplomaUrl: true, idCardUrl: true, coachingCertUrl: true },
  });
  if (!educator) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });

  const value =
    type === "diploma" ? educator.diplomaUrl :
    type === "idcard" ? educator.idCardUrl :
    type === "coaching" ? educator.coachingCertUrl : null;

  const url = await signedDocUrl(value);
  if (!url) return NextResponse.json({ error: "Belge bulunamadı" }, { status: 404 });

  const res = NextResponse.redirect(url, 302);
  res.headers.set("Cache-Control", "no-store");
  return res;
}
