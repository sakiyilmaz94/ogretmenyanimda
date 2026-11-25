import { db } from "@/lib/db";
import { notify } from "@/lib/notify";
import { sendEmail, emailCommissionChange } from "@/lib/email";

/**
 * Komisyon oranı değişikliğini (veya iptalini) tüm eğitmenlere panel bildirimi + e-posta ile iletir.
 * Sözleşme Madde 5: değişiklik yürürlükten en az 7 gün önce kayıtlı e-postaya bildirilir.
 * Hata verirse tek bir eğitmen için denenip diğerlerine devam edilir; başarısız olanların listesi döner.
 */
export async function notifyEducatorsOfCommissionChange(opts: {
  oldRate: number; newRate: number; effectiveAt?: Date; cancelled?: boolean;
}): Promise<{ total: number; failed: string[] }> {
  const educators = await db.educator.findMany({
    where: { status: { in: ["APPROVED", "PENDING"] } },
    include: { user: true },
  });
  const dateStr = opts.effectiveAt
    ? opts.effectiveAt.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Istanbul" })
    : undefined;
  const failed: string[] = [];

  for (const e of educators) {
    const title = opts.cancelled ? "Komisyon oranı değişikliğinden vazgeçildi" : "Komisyon oranı değişikliği";
    const message = opts.cancelled
      ? `Planlanan komisyon oranı değişikliği iptal edildi. Geçerli oran %${opts.oldRate} olarak devam ediyor.`
      : `Platform komisyon oranı ${dateStr} tarihinden itibaren %${opts.oldRate} yerine %${opts.newRate} olacak. Ayrıntılar e-postanızda.`;
    try {
      await notify({ userId: e.userId, title, message, link: "/educator" });
    } catch (err) {
      console.error("Komisyon bildirimi (panel) gönderilemedi:", err);
    }
    try {
      await sendEmail({
        to: e.user.email,
        subject: opts.cancelled ? "Komisyon oranı değişikliğinden vazgeçildi" : "Komisyon oranı değişikliği bildirimi",
        html: emailCommissionChange({ name: e.user.name ?? "Öğretmenim", oldRate: opts.oldRate, newRate: opts.newRate, effectiveDate: dateStr, cancelled: opts.cancelled }),
      });
    } catch (err) {
      console.error("Komisyon bildirimi (e-posta) gönderilemedi:", e.user.email, err);
      failed.push(e.user.email);
    }
    await new Promise((r) => setTimeout(r, 600)); // e-posta sağlayıcısının hız sınırı
  }
  return { total: educators.length, failed };
}
