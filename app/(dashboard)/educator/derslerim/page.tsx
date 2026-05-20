"use client";

import { useState, useEffect } from "react";
import { SUBJECT_LABELS, GRADE_LABELS } from "@/lib/utils";

const ALL_SUBJECTS = Object.entries(SUBJECT_LABELS);
const ALL_GRADES = Object.entries(GRADE_LABELS);

interface Profile {
  subjects: string[];
  gradeLevels: string[];
  hourlyRate: number;
  bio: string | null;
}

export default function EducatorDerslerimPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ subjects: [] as string[], gradeLevels: [] as string[], hourlyRate: "", bio: "" });

  useEffect(() => {
    fetch("/api/educator/profile")
      .then((r) => r.json())
      .then((d) => {
        setProfile(d);
        setForm({
          subjects: d.subjects || [],
          gradeLevels: d.gradeLevels || [],
          hourlyRate: d.hourlyRate?.toString() || "",
          bio: d.bio || "",
        });
        setLoading(false);
      });
  }, []);

  function toggleSubject(s: string) {
    setForm((f) => ({
      ...f,
      subjects: f.subjects.includes(s) ? f.subjects.filter((x) => x !== s) : [...f.subjects, s],
    }));
  }

  function toggleGrade(g: string) {
    setForm((f) => ({
      ...f,
      gradeLevels: f.gradeLevels.includes(g) ? f.gradeLevels.filter((x) => x !== g) : [...f.gradeLevels, g],
    }));
  }

  async function save() {
    setSaving(true);
    await fetch("/api/educator/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subjects: form.subjects,
        gradeLevels: form.gradeLevels,
        hourlyRate: parseFloat(form.hourlyRate) || 0,
        bio: form.bio,
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) return <div className="text-center py-12 text-gray-400">Yükleniyor...</div>;

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Derslerim</h1>
        <p className="text-slate-500 text-sm mt-1">Hangi dersleri verdiğinizi ve ücretinizi buradan belirleyin.</p>
      </div>

      {/* Subjects */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="font-semibold text-navy-900 mb-4">Verdiğim Dersler</h2>
        <div className="flex flex-wrap gap-2">
          {ALL_SUBJECTS.map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => toggleSubject(key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                form.subjects.includes(key)
                  ? "bg-navy-900 text-white border-navy-900"
                  : "bg-white text-slate-600 border-slate-200 hover:border-navy-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {form.subjects.length === 0 && (
          <p className="text-xs text-amber-600 mt-3">En az bir ders seçin.</p>
        )}
      </div>

      {/* Grade levels */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="font-semibold text-navy-900 mb-4">Sınıf Seviyeleri</h2>
        <div className="flex flex-wrap gap-2">
          {ALL_GRADES.map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => toggleGrade(key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                form.gradeLevels.includes(key)
                  ? "bg-gold-500 text-white border-gold-500"
                  : "bg-white text-slate-600 border-slate-200 hover:border-gold-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {form.gradeLevels.length === 0 && (
          <p className="text-xs text-amber-600 mt-3">En az bir sınıf seviyesi seçin.</p>
        )}
      </div>

      {/* Hourly rate */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="font-semibold text-navy-900 mb-1">Saatlik Ücret</h2>
        <p className="text-slate-500 text-sm mb-4">Velilerin profilinizde göreceği ders ücreti. Platformun %20 komisyon kesintisi sonrasında kalan tutar size ödenir.</p>
        <div className="flex items-center gap-2 max-w-xs">
          <span className="text-slate-500 font-medium">₺</span>
          <input
            type="number"
            value={form.hourlyRate}
            onChange={(e) => setForm((f) => ({ ...f, hourlyRate: e.target.value }))}
            placeholder="örn: 400"
            min={0}
            className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
          />
          <span className="text-slate-400 text-sm">/ ders</span>
        </div>
        {form.hourlyRate && parseFloat(form.hourlyRate) > 0 && (
          <p className="text-xs text-green-600 mt-2">
            Net kazancınız: ₺{(parseFloat(form.hourlyRate) * 0.8).toFixed(0)} / ders (%80)
          </p>
        )}
      </div>

      {/* Bio */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="font-semibold text-navy-900 mb-1">Kısa Biyografi</h2>
        <p className="text-slate-500 text-sm mb-4">Velilerin profilinizde okuyacağı tanıtım metni.</p>
        <textarea
          value={form.bio}
          onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
          rows={4}
          placeholder="Kendinizi kısaca tanıtın..."
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={save}
          disabled={saving}
          className="bg-gold-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gold-600 disabled:opacity-50 transition-colors"
        >
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
        {saved && <span className="text-green-600 text-sm font-medium">✓ Kaydedildi</span>}
      </div>
    </div>
  );
}
