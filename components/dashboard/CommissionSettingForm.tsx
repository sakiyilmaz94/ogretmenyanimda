"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CommissionSettingForm({ initialRate }: { initialRate: number }) {
  const router = useRouter();
  const [rate, setRate] = useState(String(initialRate));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    setSaving(true); setSaved(false); setError("");
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commissionRate: Number(rate) }),
    });
    setSaving(false);
    if (res.ok) { setSaved(true); router.refresh(); setTimeout(() => setSaved(false), 2500); }
    else { const d = await res.json().catch(() => ({})); setError(d.error ?? "Kaydedilemedi"); }
  }

  const r = Number(rate) || 0;

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3">
        <div>
          <label className="block text-label-md font-semibold text-on-background mb-1.5">Platform Komisyon Oranı (%)</label>
          <input type="number" min={0} max={100} step="1" value={rate} onChange={(e) => setRate(e.target.value)}
            className="w-32 bg-surface-container rounded-lg px-4 py-2.5 text-on-background text-headline-md font-bold focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
        <button onClick={save} disabled={saving}
          className="rounded-full squishy-btn bg-primary text-on-primary px-6 py-2.5 text-label-md font-semibold disabled:opacity-50 mb-0.5">
          {saving ? "Kaydediliyor…" : "Kaydet"}
        </button>
        {saved && <span className="text-caption text-on-secondary-container font-semibold mb-3">✓ Kaydedildi</span>}
      </div>
      {error && <p className="text-caption text-on-error-container bg-error-container rounded-lg px-3 py-2 inline-block">{error}</p>}
      <div className="bg-primary-fixed/40 rounded-lg p-4 text-body-md text-on-background">
        <p className="text-caption text-on-surface-variant mb-1">Örnek hesap (1.000 ₺&apos;lik ders):</p>
        <p>Bizim gelirimiz (%{r}): <strong className="text-primary">{(1000 * r / 100).toLocaleString("tr-TR")} ₺</strong> · Öğretmene ödenecek: <strong>{(1000 - 1000 * r / 100).toLocaleString("tr-TR")} ₺</strong></p>
      </div>
    </div>
  );
}
