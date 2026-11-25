"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Scheduled { rate: number; effectiveAt: string }

export default function CommissionSettingForm({
  currentRate, scheduled, minDate, noticeDays,
}: { currentRate: number; scheduled: Scheduled | null; minDate: string; noticeDays: number }) {
  const router = useRouter();
  const [rate, setRate] = useState(String(currentRate));
  const [date, setDate] = useState(minDate);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const r = Number(rate) || 0;
  const fmt = (iso: string) => new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Istanbul" });

  async function call(body: object, confirmText: string) {
    if (!confirm(confirmText)) return;
    setSaving(true); setError(""); setMessage("");
    const res = await fetch("/api/admin/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setSaving(false);
    const d = await res.json().catch(() => ({}));
    if (res.ok) {
      const n = d.notice as { total: number; failed: string[] } | null;
      setMessage(n ? `✓ Kaydedildi. ${n.total} öğretmene bildirim gönderildi${n.failed.length ? ` (${n.failed.length} e-posta gönderilemedi: ${n.failed.join(", ")})` : ""}.` : "✓ Kaydedildi.");
      router.refresh();
    } else setError(d.error ?? "Kaydedilemedi");
  }

  return (
    <div className="space-y-4">
      <div className="bg-surface-container rounded-lg p-4">
        <p className="text-caption text-on-surface-variant">Şu an geçerli komisyon oranı</p>
        <p className="font-display text-headline-lg font-bold text-on-background">%{currentRate}</p>
      </div>

      {scheduled && (
        <div className="bg-tertiary-fixed border border-outline-variant/20 rounded-lg p-4 space-y-2">
          <p className="font-semibold text-on-tertiary-fixed">
            Planlı değişiklik: <strong>%{scheduled.rate}</strong> oranı <strong>{fmt(scheduled.effectiveAt)}</strong> tarihinde başlayacak.
          </p>
          <p className="text-caption text-on-tertiary-fixed/80">Öğretmenlere e-posta ile bildirildi. O tarihe kadar %{currentRate} geçerli.</p>
          <button onClick={() => call({ cancelCommissionChange: true }, "Planlanan değişiklik iptal edilsin mi? Öğretmenlere iptal bildirimi gönderilecek.")} disabled={saving}
            className="rounded-full bg-error-container text-on-error-container px-4 py-2 text-label-md font-semibold disabled:opacity-50">
            Değişikliği iptal et
          </button>
        </div>
      )}

      <div className="border border-outline-variant/20 rounded-lg p-4 space-y-3">
        <p className="font-display font-semibold text-on-background">Oranı değiştir</p>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-label-md font-semibold text-on-background mb-1.5">Yeni oran (%)</label>
            <input type="number" min={0} max={100} step="1" value={rate} onChange={(e) => setRate(e.target.value)}
              className="w-28 bg-surface-container rounded-lg px-4 py-2.5 text-on-background text-headline-md font-bold focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <div>
            <label className="block text-label-md font-semibold text-on-background mb-1.5">Yürürlük tarihi</label>
            <input type="date" min={minDate} value={date} onChange={(e) => setDate(e.target.value)}
              className="bg-surface-container rounded-lg px-4 py-2.5 text-on-background focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <button
            onClick={() => call({ commissionRate: Number(rate), effectiveDate: date },
              `Komisyon %${currentRate} → %${r} olarak ${fmt(date + "T00:00:00+03:00")} tarihinde başlayacak. Tüm öğretmenlere şimdi e-posta ile bildirilecek. Onaylıyor musun?`)}
            disabled={saving || r === currentRate}
            className="rounded-full squishy-btn bg-primary text-on-primary px-6 py-2.5 text-label-md font-semibold disabled:opacity-50">
            {saving ? "Gönderiliyor…" : "Planla ve öğretmenlere bildir"}
          </button>
        </div>
        <p className="text-caption text-on-surface-variant leading-relaxed">
          Sözleşme gereği değişiklik en az {noticeDays} gün önceden bildirilir; bu yüzden tarih en erken {noticeDays} gün sonrası olabilir.
          Yeni oran, yürürlük tarihinden sonra ödemesi onaylanan derslere uygulanır; önceki ödemeler kayıtlı oranıyla kalır (raporlar değişmez).
        </p>
      </div>

      {message && <p className="text-caption text-on-secondary-container bg-secondary-container rounded-lg px-3 py-2">{message}</p>}
      {error && <p className="text-caption text-on-error-container bg-error-container rounded-lg px-3 py-2 inline-block">{error}</p>}

      <div className="bg-primary-fixed/40 rounded-lg p-4 text-body-md text-on-background">
        <p className="text-caption text-on-surface-variant mb-1">Örnek hesap (1.000 ₺&apos;lik ders, yeni oranla):</p>
        <p>Bizim gelirimiz (%{r}): <strong className="text-primary">{(1000 * r / 100).toLocaleString("tr-TR")} ₺</strong> · Öğretmene ödenecek: <strong>{(1000 - 1000 * r / 100).toLocaleString("tr-TR")} ₺</strong></p>
      </div>
    </div>
  );
}
