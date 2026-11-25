import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getCommissionRate, getScheduledChange, scheduleCommissionChange, cancelScheduledChange, COMMISSION_NOTICE_DAYS } from "@/lib/finance";
import { notifyEducatorsOfCommissionChange } from "@/lib/commission-notice";
import { setSalesOpen } from "@/lib/site-status";
import { revalidatePath } from "next/cache";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const body = await req.json();
  let notice: { total: number; failed: string[] } | null = null;

  // Planlanan komisyon değişikliğini iptal et
  if (body.cancelCommissionChange === true) {
    const pending = await getScheduledChange();
    if (pending) {
      const current = await getCommissionRate();
      await cancelScheduledChange();
      notice = await notifyEducatorsOfCommissionChange({ oldRate: current, newRate: pending.rate, cancelled: true });
    }
  }

  // Komisyon oranını DEĞİŞTİR: sözleşme gereği yürürlükten en az 7 gün önce planlanır ve öğretmenlere bildirilir
  if (body.commissionRate !== undefined) {
    const rate = Number(body.commissionRate);
    if (!Number.isFinite(rate) || rate < 0 || rate > 100) {
      return NextResponse.json({ error: "Komisyon oranı 0–100 arası olmalı" }, { status: 400 });
    }
    const current = await getCommissionRate();
    if (rate === current) {
      return NextResponse.json({ error: "Bu oran zaten geçerli." }, { status: 400 });
    }
    if (typeof body.effectiveDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(body.effectiveDate)) {
      return NextResponse.json({ error: "Yürürlük tarihini seçin." }, { status: 400 });
    }
    const effectiveAt = new Date(`${body.effectiveDate}T00:00:00+03:00`);
    const earliest = Date.now() + COMMISSION_NOTICE_DAYS * 864e5;
    if (Number.isNaN(effectiveAt.getTime()) || effectiveAt.getTime() < earliest) {
      return NextResponse.json({ error: `Sözleşme gereği değişiklik en az ${COMMISSION_NOTICE_DAYS} gün önceden bildirilmelidir. Daha ileri bir tarih seçin.` }, { status: 400 });
    }
    await scheduleCommissionChange(rate, effectiveAt);
    notice = await notifyEducatorsOfCommissionChange({ oldRate: current, newRate: rate, effectiveAt });
  }
  if (body.salesOpen !== undefined) {
    await setSalesOpen(body.salesOpen === true);
    revalidatePath("/");
    revalidatePath("/egitmenlerimiz");
  }
  revalidatePath("/admin/settings");
  revalidatePath("/admin/payments");
  revalidatePath("/admin/raporlar");
  return NextResponse.json({ ok: true, notice });
}
