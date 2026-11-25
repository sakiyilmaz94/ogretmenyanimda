import { db } from "@/lib/db";

export const DEFAULT_COMMISSION_RATE = 20; // %

/** Sözleşme (Eğitmen Hizmet Sözleşmesi Madde 5) gereği oran değişikliği en az bu kadar gün önceden bildirilir. */
export const COMMISSION_NOTICE_DAYS = 7;

const NEXT_KEY = "commissionRateNext";

export interface ScheduledChange {
  rate: number;
  effectiveAt: string; // ISO
}

async function readBase(): Promise<number> {
  const s = await db.appSetting.findUnique({ where: { key: "commissionRate" } });
  const n = s ? Number(s.value) : NaN;
  return Number.isFinite(n) && n >= 0 && n <= 100 ? n : DEFAULT_COMMISSION_RATE;
}

async function readNext(): Promise<ScheduledChange | null> {
  const s = await db.appSetting.findUnique({ where: { key: NEXT_KEY } });
  if (!s) return null;
  try {
    const v = JSON.parse(s.value) as ScheduledChange;
    if (Number.isFinite(v.rate) && v.rate >= 0 && v.rate <= 100 && !Number.isNaN(Date.parse(v.effectiveAt))) return v;
  } catch {}
  return null;
}

/** Şu an GEÇERLİ komisyon oranı (%). Planlı değişikliğin yürürlük tarihi geldiyse yeni oranı döndürür. */
export async function getCommissionRate(): Promise<number> {
  const [base, next] = await Promise.all([readBase(), readNext()]);
  if (next && new Date(next.effectiveAt).getTime() <= Date.now()) return next.rate;
  return base;
}

/** Henüz yürürlüğe girmemiş (gelecekteki) planlı değişiklik, yoksa null. */
export async function getScheduledChange(): Promise<ScheduledChange | null> {
  const next = await readNext();
  return next && new Date(next.effectiveAt).getTime() > Date.now() ? next : null;
}

/** Yeni oranı bir yürürlük tarihiyle planlar. Önce geçerli oranı kalıcı hale getirir ki eski planın etkisi kaybolmasın. */
export async function scheduleCommissionChange(rate: number, effectiveAt: Date): Promise<void> {
  const current = await getCommissionRate();
  await db.appSetting.upsert({
    where: { key: "commissionRate" },
    update: { value: String(current) },
    create: { key: "commissionRate", value: String(current) },
  });
  const value = JSON.stringify({ rate, effectiveAt: effectiveAt.toISOString() } satisfies ScheduledChange);
  await db.appSetting.upsert({ where: { key: NEXT_KEY }, update: { value }, create: { key: NEXT_KEY, value } });
}

export async function cancelScheduledChange(): Promise<void> {
  await db.appSetting.deleteMany({ where: { key: NEXT_KEY } });
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

export interface PaidLike {
  amount: { toNumber(): number } | number;
  commissionRate?: { toNumber(): number } | number | null;
}

const num = (v: { toNumber(): number } | number) => (typeof v === "number" ? v : v.toNumber());

/** Ödenmiş kayıtların toplamı. Her ödemenin KENDİ kayıtlı oranı kullanılır; kayıt yoksa fallbackRate. */
export function summarizePayments(list: PaidLike[], fallbackRate: number) {
  let gross = 0, commission = 0;
  for (const p of list) {
    const a = num(p.amount);
    const r = p.commissionRate != null ? num(p.commissionRate) : fallbackRate;
    gross += a;
    commission += Math.round(a * (r / 100) * 100) / 100;
  }
  gross = Math.round(gross * 100) / 100;
  commission = Math.round(commission * 100) / 100;
  return { count: list.length, gross, commission, payout: Math.round((gross - commission) * 100) / 100 };
}

/** Tüm ÖDENMİŞ ödemelerin özeti (her biri kendi oranıyla). */
export async function getPaidSummary() {
  const [list, rate] = await Promise.all([
    db.payment.findMany({ where: { status: "PAID" }, select: { amount: true, commissionRate: true } }),
    getCommissionRate(),
  ]);
  return summarizePayments(list, rate);
}
