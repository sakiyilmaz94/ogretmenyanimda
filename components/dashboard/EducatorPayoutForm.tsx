"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EducatorPayoutForm({ ibanMasked, holderName }: { ibanMasked: string | null; holderName: string }) {
  const router = useRouter();
  const [editing, setEditing] = useState(!ibanMasked);
  const [iban, setIban] = useState("");
  const [holder, setHolder] = useState(holderName);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setError("");
    setSaving(true);
    const res = await fetch("/api/educator/payout", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ iban, ibanHolderName: holder }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true); setIban(""); setEditing(false); router.refresh();
      setTimeout(() => setSaved(false), 2500);
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Kaydedilemedi.");
    }
  }

  const inputCls = "w-full bg-surface-container rounded-full px-5 py-3 text-on-background placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest transition";

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6 soft-card-static">
      <h2 className="font-display font-semibold text-on-background text-headline-md mb-1">Ödeme Bilgileri</h2>
      <p className="text-body-md text-on-surface-variant mb-4">
        Ders ücretleriniz haftalık olarak bu hesaba yatırılır. IBAN&apos;ınız değişirse buradan güncelleyin.
      </p>

      {!editing && ibanMasked ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border border-outline-variant/20 rounded-xl p-4">
          <div>
            <p className="font-display font-semibold text-on-background tracking-wide">{ibanMasked}</p>
            <p className="text-caption text-on-surface-variant">Hesap sahibi: {holderName}</p>
          </div>
          <div className="flex items-center gap-3">
            {saved && <span className="text-caption text-on-secondary-container font-semibold">✓ Kaydedildi</span>}
            <button type="button" onClick={() => setEditing(true)}
              className="rounded-full bg-surface-container text-on-background px-4 py-2 text-label-md font-semibold hover:bg-surface-container-high transition">Değiştir</button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 max-w-xl">
          <div>
            <label className="block text-label-md font-semibold text-on-background mb-1.5">Hesap sahibinin adı soyadı</label>
            <input value={holder} onChange={(e) => setHolder(e.target.value)} placeholder="Bankadaki hesap adıyla aynı" className={inputCls} />
          </div>
          <div>
            <label className="block text-label-md font-semibold text-on-background mb-1.5">IBAN</label>
            <input value={iban} onChange={(e) => setIban(e.target.value)} autoComplete="off" placeholder="TR00 0000 0000 0000 0000 0000 00" className={`${inputCls} tracking-wide`} />
            <p className="text-caption text-on-surface-variant mt-2">IBAN&apos;ınız yalnızca ödeme için kullanılır, üçüncü kişilerle paylaşılmaz.</p>
          </div>
          {error && <div className="bg-error text-on-error rounded-xl px-4 py-2.5 text-label-md font-semibold">{error}</div>}
          <div className="flex items-center gap-3">
            <button type="button" onClick={save} disabled={saving || !iban.trim() || !holder.trim()}
              className="rounded-full squishy-btn bg-primary text-on-primary px-6 py-2.5 text-label-md font-semibold disabled:opacity-50 transition">
              {saving ? "Kaydediliyor…" : "IBAN'ı Kaydet"}
            </button>
            {ibanMasked && (
              <button type="button" onClick={() => { setEditing(false); setIban(""); setError(""); }}
                className="text-label-md text-on-surface-variant hover:underline">Vazgeç</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
