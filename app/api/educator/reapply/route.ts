import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { diplomaUrl, idCardUrl } = await req.json();

  if (!diplomaUrl || !idCardUrl)
    return NextResponse.json({ error: "Her iki belgeyi de yükleyin." }, { status: 400 });

  const educator = await db.educator.findUnique({ where: { userId: session.user.id } });
  if (!educator) return NextResponse.json({ error: "Profil bulunamadı" }, { status: 404 });
  if (educator.status !== "REJECTED")
    return NextResponse.json({ error: "Yalnızca reddedilen başvurular yeniden gönderilebilir." }, { status: 400 });

  await db.educator.update({
    where: { id: educator.id },
    data: {
      diplomaUrl,
      idCardUrl,
      status: "PENDING",
      rejectionNote: null,
    },
  });

  return NextResponse.json({ success: true });
}
