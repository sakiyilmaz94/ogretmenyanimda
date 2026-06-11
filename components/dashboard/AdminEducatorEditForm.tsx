"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SUBJECT_LABELS, GRADE_LABELS } from "@/lib/utils";

interface Props {
  educatorId: string;
  initial: {
    hourlyRate: number;
    bio: string;
    titleName: string;
    experience: string;
    phone: string;
    subjects: string[];
    gradeLevels: string[];
    status: string;
    isProfilePublic: boolean;
  };
}

const STATUS_OPTIONS = [
  { v: "APPROVED", label: "Onaylı" },
  { v: "PENDING", label: "Beklemede" },
  { v: "REJECTED", label: "Reddedildi" },
];

export default function AdminEducatorEditForm({ educatorId, initial }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function toggle(field: "subjects" | "gradeLevels", val: string) {
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(val) ? f[field].filter((x) => x !== val) : [...f[field], val],
    }));
  }

  async function save() {
    setSaving(true); setSaved(false); setError("");
    const res = await fetch(`/api/admin/educators/${educatorId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hourlyRate: form.hourlyRate,
        bio: form.bio,
        titleName: form.titleName,
        experience: form.experience,
        phone: form.phone,
        subjects: form.subjects,
        gradeLevels: form.gradeLevels,
        status: form.status,
        isProfilePublic: form.isProfilePublic,
      }),
    });
    setSaving(false);
    if (res.ok) { setSaved(true); router.refresh(); setTimeout(() => setSaved(false), 2500); }
    else { const d = await res.json().catch(() => ({})); setError(d.error ?? "Kaydedilemedi"); }
  }

  return (
    <div className="bg-surface-container-lowest rounded-md border border-primary/20 soft-card-static overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-surface-container-low transition"
      >
        <span className="font-display text-headline-md text-on-background flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Öğretmeni Düzenle
        </span>
        <svg className={`w-5 h-5 text-on-surface-variant transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-6 pb-6 pt-2 space-y-5 border-t border-outline-variant/20">
          {/* Ücret + Durum */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-label-md font-semibold text-on-background mb-1.5">Saatlik Ücret (₺)</label>
              <input type="number" min={0} step="50" value={form.hourlyRate}
                onChange={(e) => setForm({ ...form, hourlyRate: e.target.value as unknown as number })}
                className="w-full bg-surface-container rounded-lg px-4 py-2.5 text-on-background focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <div>
              <label className="block text-label-md font-semibold text-on-background mb-1.5">Durum</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full bg-surface-container rounded-lg px-4 py-2.5 text-on-background focus:outline-none focus:ring-2 focus:ring-primary/40">
                {STATUS_OPTIONS.map((s) => <option key={s.v} value={s.v}>{s.label}</option>)}
              </select>
            </div>
          </div>

          {/* Unvan + Deneyim + Telefon */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-label-md font-semibold text-on-background mb-1.5">Unvan</label>
              <input type="text" value={form.titleName} onChange={(e) => setForm({ ...form, titleName: e.target.value })}
                className="w-full bg-surface-container rounded-lg px-4 py-2.5 text-on-background focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <div>
              <label className="block text-label-md font-semibold text-on-background mb-1.5">Deneyim (yıl)</label>
              <input type="number" min={0} value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })}
                className="w-full bg-surface-container rounded-lg px-4 py-2.5 text-on-background focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <div>
              <label className="block text-label-md font-semibold text-on-background mb-1.5">Telefon</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-surface-container rounded-lg px-4 py-2.5 text-on-background focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
          </div>

          {/* Branşlar */}
          <div>
            <label className="block text-label-md font-semibold text-on-background mb-2">Ders Konuları</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(SUBJECT_LABELS).map(([v, label]) => (
                <button key={v} type="button" onClick={() => toggle("subjects", v)}
                  className={`px-3 py-1.5 rounded-full text-caption font-semibold border transition ${
                    form.subjects.includes(v) ? "bg-primary text-on-primary border-primary" : "bg-surface-container text-on-surface-variant border-outline-variant hover:bg-surface-container-high"
                  }`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Sınıf seviyeleri */}
          <div>
            <label className="block text-label-md font-semibold text-on-background mb-2">Sınıf Seviyeleri</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(GRADE_LABELS).map(([v, label]) => (
                <button key={v} type="button" onClick={() => toggle("gradeLevels", v)}
                  className={`px-3 py-1.5 rounded-full text-caption font-semibold border transition ${
                    form.gradeLevels.includes(v) ? "bg-primary text-on-primary border-primary" : "bg-surface-container text-on-surface-variant border-outline-variant hover:bg-surface-container-high"
                  }`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Hakkında */}
          <div>
            <label className="block text-label-md font-semibold text-on-background mb-1.5">Hakkında</label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3}
              className="w-full bg-surface-container rounded-lg px-4 py-2.5 text-on-background focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
          </div>

          {/* Profil görünürlüğü */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.isProfilePublic} onChange={(e) => setForm({ ...form, isProfilePublic: e.target.checked })}
              className="w-4 h-4 accent-[#4648D4]" />
            <span className="text-label-md text-on-background">Profil herkese açık (velilere görünür)</span>
          </label>

          {error && <p className="text-caption text-on-error-container bg-error-container rounded-lg px-3 py-2">{error}</p>}

          <div className="flex items-center gap-3">
            <button onClick={save} disabled={saving}
              className="rounded-full squishy-btn bg-primary text-on-primary px-6 py-2.5 text-label-md font-semibold disabled:opacity-50">
              {saving ? "Kaydediliyor…" : "Değişiklikleri Kaydet"}
            </button>
            {saved && <span className="text-caption text-on-secondary-container font-semibold">✓ Kaydedildi</span>}
          </div>
        </div>
      )}
    </div>
  );
}
