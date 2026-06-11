import { db } from "@/lib/db";

export const DEFAULT_COMMISSION_RATE = 20; // %

// Platform komisyon oranını (%) okur. Ayar yoksa varsayılan döner.
export async function getCommissionRate(): Promise<number> {
  const s = await db.appSetting.findUnique({ where: { key: "commissionRate" } });
  const n = s ? Number(s.value) : NaN;
  return Number.isFinite(n) && n >= 0 && n <= 100 ? n : DEFAULT_COMMISSION_RATE;
}

export async function setCommissionRate(rate: number): Promise<void> {
  await db.appSetting.upsert({
    where: { key: "commissionRate" },
    update: { value: String(rate) },
    create: { key: "commissionRate", value: String(rate) },
  });
}

export interface Breakdown {
  gross: number;      // brüt (velinin ödediği)
  commission: number; // platform geliri (bizim payımız)
  payout: number;     // öğretmene ödenecek
}

// Bir tutar için komisyon dökümü. rate yüzde (ör. 20).
export function breakdown(amount: number, rate: number): Breakdown {
  const commission = Math.round(amount * (rate / 100) * 100) / 100;
  return { gross: amount, commission, payout: Math.round((amount - commission) * 100) / 100 };
}
