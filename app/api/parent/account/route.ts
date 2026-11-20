import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { isValidTrIban, normalizeIban } from "@/lib/iban";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "PARENT") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const body = await req.json() as {
    name?: string;
    phone?: string | null;
    lessonReminder?: boolean;
    paymentNotification?: boolean;
    iban?: string | null;
    ibanHolderName?: string | null;
  };

  // Ad → User; telefon + bildirim tercihleri → Parent
  if (typeof body.name === "string" && body.name.trim()) {
    await db.user.update({ where: { id: session.user.id }, data: { name: body.name.trim() } });
  }

  const parentData: Record<string, unknown> = {};
  if (body.phone !== undefined) parentData.phone = body.phone?.trim() || null;
  if (typeof body.lessonReminder === "boolean") parentData.lessonReminder = body.lessonReminder;
  if (typeof body.paymentNotification === "boolean") parentData.paymentNotification = body.paymentNotification;

  // İade bilgileri: boş gönderilirse silinir; doluysa doğrulanır
  if (body.iban !== undefined || body.ibanHolderName !== undefined) {
    const rawIban = typeof body.iban === "string" ? body.iban.trim() : "";
    const holder = typeof body.ibanHolderName === "string" ? body.ibanHolderName.trim() : "";
    if (!rawIban && !holder) {
      parentData.iban = null;
      parentData.ibanHolderName = null;
    } else {
      if (!isValidTrIban(rawIban)) {
        return NextResponse.json({ error: "Geçerli bir IBAN girin (TR ile başlayan 26 karakter). Kontrol edip tekrar deneyin." }, { status: 400 });
      }
      if (holder.length < 3 || holder.length > 80) {
        return NextResponse.json({ error: "Hesap sahibinin adını soyadını yazın." }, { status: 400 });
      }
      parentData.iban = normalizeIban(rawIban);
      parentData.ibanHolderName = holder;
    }
  }

  if (Object.keys(parentData).length > 0) {
    await db.parent.update({ where: { userId: session.user.id }, data: parentData });
  }

  return NextResponse.json({ ok: true });
}
