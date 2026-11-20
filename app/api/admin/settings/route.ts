import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { setCommissionRate } from "@/lib/finance";
import { setSalesOpen } from "@/lib/site-status";
import { revalidatePath } from "next/cache";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const body = await req.json();
  if (body.commissionRate !== undefined) {
    const rate = Number(body.commissionRate);
    if (!Number.isFinite(rate) || rate < 0 || rate > 100) {
      return NextResponse.json({ error: "Komisyon oranı 0–100 arası olmalı" }, { status: 400 });
    }
    await setCommissionRate(rate);
  }
  if (body.salesOpen !== undefined) {
    await setSalesOpen(body.salesOpen === true);
    revalidatePath("/");
    revalidatePath("/egitmenlerimiz");
  }
  revalidatePath("/admin/settings");
  revalidatePath("/admin/payments");
  revalidatePath("/admin/raporlar");
  return NextResponse.json({ ok: true });
}
