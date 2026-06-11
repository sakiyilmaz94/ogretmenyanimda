"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AccountData {
  name: string;
  email: string;
  phone: string;
  lessonReminder: boolean;
  paymentNotification: boolean;
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${on ? "bg-primary" : "bg-surface-container-high"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-surface-container-lowest shadow transition-transform ${on ? "translate-x-5" : ""}`} />
    </button>
  );
}

export default function AccountForm({ initial }: { initial: AccountData }) {
  const router = useRouter();
  const [name, setName] = useState(initial.name);
  const [phone, setPhone] = useState(initial.phone);
  const [lessonReminder, setLessonReminder] = useState(initial.lessonReminder);
  const [paymentNotification, setPaymentNotification] = useState(initial.paymentNotification);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save(patch: Partial<AccountData>) {
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/parent/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2500);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* a) Kişisel bilgiler */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6 soft-card-static">
        <h2 className="font-display font-semibold text-on-background text-headline-md mb-4">Kişisel Bilgiler</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-label-md font-semibold text-on-background mb-1.5">Ad Soyad</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-container rounded-full px-5 py-3 text-on-background focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest transition" />
          </div>
          <div>
            <label className="block text-label-md font-semibold text-on-background mb-1.5">E-posta</label>
            <input type="email" value={initial.email} readOnly
              className="w-full bg-surface-container/60 rounded-full px-5 py-3 text-on-surface-variant cursor-not-allowed" />
            <p className="text-[11px] text-on-surface-variant mt-1">E-posta adresi değiştirilemez.</p>
          </div>
          <div>
            <label className="block text-label-md font-semibold text-on-background mb-1.5">Telefon</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="örn: 05XX XXX XX XX"
              className="w-full bg-surface-container rounded-full px-5 py-3 text-on-background placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest transition" />
          </div>
          <div className="flex items-center gap-3 pt-1">
            <button onClick={() => save({ name, phone })} disabled={saving}
              className="rounded-full squishy-btn bg-primary text-on-primary px-6 py-2.5 text-label-md font-semibold disabled:opacity-50 transition">
              {saving ? "Kaydediliyor…" : "Kaydet"}
            </button>
            {saved && <span className="text-caption text-on-secondary-container font-semibold">✓ Kaydedildi</span>}
          </div>
        </div>
      </div>

      {/* b) Bildirim tercihleri */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6 soft-card-static">
        <h2 className="font-display font-semibold text-on-background text-headline-md mb-4">Bildirim Tercihleri</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 border border-outline-variant/20 rounded-xl p-4">
            <div>
              <p className="font-display font-semibold text-on-background">Ders hatırlatıcısı</p>
              <p className="text-caption text-on-surface-variant">Yaklaşan dersler için hatırlatma al.</p>
            </div>
            <Toggle on={lessonReminder} onClick={() => { const v = !lessonReminder; setLessonReminder(v); save({ lessonReminder: v }); }} />
          </div>
          <div className="flex items-center justify-between gap-4 border border-outline-variant/20 rounded-xl p-4">
            <div>
              <p className="font-display font-semibold text-on-background">Ödeme bildirimi</p>
              <p className="text-caption text-on-surface-variant">Ödeme bekleyen dersler için bildirim al.</p>
            </div>
            <Toggle on={paymentNotification} onClick={() => { const v = !paymentNotification; setPaymentNotification(v); save({ paymentNotification: v }); }} />
          </div>
        </div>
      </div>
    </div>
  );
}
