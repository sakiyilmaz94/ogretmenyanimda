import { db } from "@/lib/db";

/** İstek yapanın IP'sini (Vercel/proxy başlıklarından) döndürür. */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "bilinmiyor";
}

/**
 * Kalıcı hız sınırı. `limit` istek / `windowSec` saniye. Aşılırsa allowed=false döner.
 * Hata olursa (veritabanı sorunu) isteği engellemez, yalnızca loglar: kayıt akışı hız sınırı yüzünden çökmesin.
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSec: number
): Promise<{ allowed: boolean; retryAfterSec: number }> {
  try {
    const now = new Date();
    const row = await db.rateLimit.findUnique({ where: { key } });

    // Pencere yok ya da dolmuş → sıfırdan başla
    if (!row || now.getTime() - row.windowStart.getTime() >= windowSec * 1000) {
      await db.rateLimit.upsert({
        where: { key },
        create: { key, count: 1, windowStart: now },
        update: { count: 1, windowStart: now },
      });
      return { allowed: true, retryAfterSec: 0 };
    }

    if (row.count >= limit) {
      const retryAfterSec = Math.max(1, Math.ceil((row.windowStart.getTime() + windowSec * 1000 - now.getTime()) / 1000));
      return { allowed: false, retryAfterSec };
    }

    await db.rateLimit.update({ where: { key }, data: { count: { increment: 1 } } });
    return { allowed: true, retryAfterSec: 0 };
  } catch (e) {
    console.error("rateLimit hatası (engellenmedi):", e);
    return { allowed: true, retryAfterSec: 0 };
  }
}
