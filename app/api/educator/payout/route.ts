import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { isValidTrIban, normalizeIban } from "@/lib/iban";

// Öğretmen: haftalık ders ödemesinin yapılacağı IBAN'ı ekler/günceller
export async function PATCH(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "EDUCATOR") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const body = await req.json();
  const rawIban = typeof body.iban === "string" ? body.iban.trim() : "";
  const holder = typeof body.ibanHolderName === "string" ? body.ibanHolderName.trim() : "";

  if (!isValidTrIban(rawIban)) {
    return NextResponse.json({ error: "Geçerli bir IBAN girin (TR ile başlayan 26 karakter). Kontrol edip tekrar deneyin." }, { status: 400 });
  }
  if (holder.length < 3 || holder.length > 80) {
    return NextResponse.json({ error: "Hesap sahibinin adını soyadını yazın." }, { status: 400 });
  }
  const updated = await db.educator.updateMany({
    where: { userId: session.user.id },
    data: { iban: normalizeIban(rawIban), ibanHolderName: holder },
  });
  if (updated.count === 0) return NextResponse.json({ error: "Öğretmen bulunamadı." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
