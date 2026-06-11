import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

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
  };

  // Ad → User; telefon + bildirim tercihleri → Parent
  if (typeof body.name === "string" && body.name.trim()) {
    await db.user.update({ where: { id: session.user.id }, data: { name: body.name.trim() } });
  }

  const parentData: Record<string, unknown> = {};
  if (body.phone !== undefined) parentData.phone = body.phone?.trim() || null;
  if (typeof body.lessonReminder === "boolean") parentData.lessonReminder = body.lessonReminder;
  if (typeof body.paymentNotification === "boolean") parentData.paymentNotification = body.paymentNotification;

  if (Object.keys(parentData).length > 0) {
    await db.parent.update({ where: { userId: session.user.id }, data: parentData });
  }

  return NextResponse.json({ ok: true });
}
