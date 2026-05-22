"use client";

import { useState, useEffect } from "react";
import { SUBJECT_LABELS, GRADE_LABELS } from "@/lib/utils";

const ALL_SUBJECTS = Object.entries(SUBJECT_LABELS);
const ALL_GRADES = Object.entries(GRADE_LABELS);


export default function EducatorDerslerimPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ subjects: [] as string[], gradeLevels: [] as string[], hourlyRate: "", bio: "" });

  useEffect(() => {
    fetch("/api/educator/profile")
      .then((r) => r.json())
      .then((d) => {
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

  if (loading) return <div className="text-center py-12 text-on-surface-variant text-body-lg">Yükleniyor...</div>;

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="font-display text-headline-xl text-on-background">Derslerim</h1>
        <p className="text-body-md text-on-surface-variant mt-1">Hangi dersleri verdiğinizi ve ücretinizi buradan belirleyin.</p>
      </div>

      {/* Subjects */}
      <div className="bg-surface-container-lowest rounded-md p-6 soft-card-static border border-outline-variant/20">
        <h2 className="font-display text-headline-md text-on-background mb-4">Verdiğim Dersler</h2>
        <div className="flex flex-wrap gap-2">
          {ALL_SUBJECTS.map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => toggleSubject(key)}
              className={`px-4 py-2 rounded-full text-label-md font-medium transition-colors ${
                form.subjects.includes(key)
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {form.subjects.length === 0 && (
          <p className="text-caption text-on-tertiary-fixed mt-3">En az bir ders seçin.</p>
        )}
      </div>

      {/* Grade levels */}
      <div className="bg-surface-container-lowest rounded-md p-6 soft-card-static border border-outline-variant/20">
        <h2 className="font-display text-headline-md text-on-background mb-4">Sınıf Seviyeleri</h2>
        <div className="flex flex-wrap gap-2">
          {ALL_GRADES.map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => toggleGrade(key)}
              className={`px-4 py-2 rounded-full text-label-md font-medium transition-colors ${
                form.gradeLevels.includes(key)
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {form.gradeLevels.length === 0 && (
          <p className="text-caption text-on-tertiary-fixed mt-3">En az bir sınıf seviyesi seçin.</p>
        )}
      </div>

      {/* Hourly rate */}
      <div className="bg-surface-container-lowest rounded-md p-6 soft-card-static border border-outline-variant/20">
        <h2 className="font-display text-headline-md text-on-background mb-1">Saatlik Ücret</h2>
        <p className="text-body-md text-on-surface-variant mb-4">Velilerin profilinizde göreceği ders ücreti. Platformun %20 komisyon kesintisi sonrasında kalan tutar size ödenir.</p>
        <div className="flex items-center gap-2 max-w-xs">
          <span className="text-on-surface-variant font-medium">₺</span>
          <input
            type="number"
            value={form.hourlyRate}
            onChange={(e) => setForm((f) => ({ ...f, hourlyRate: e.target.value }))}
            placeholder="örn: 400"
            min={0}
            className="flex-1 bg-surface-container rounded-full px-5 py-3 text-on-background placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest transition"
          />
          <span className="text-on-surface-variant text-body-md">/ ders</span>
        </div>
        {form.hourlyRate && parseFloat(form.hourlyRate) > 0 && (
          <p className="text-caption text-on-secondary-container mt-2">
            Net kazancınız: ₺{(parseFloat(form.hourlyRate) * 0.8).toFixed(0)} / ders (%80)
          </p>
        )}
      </div>

      {/* Bio */}
      <div className="bg-surface-container-lowest rounded-md p-6 soft-card-static border border-outline-variant/20">
        <h2 className="font-display text-headline-md text-on-background mb-1">Kısa Biyografi</h2>
        <p className="text-body-md text-on-surface-variant mb-4">Velilerin profilinizde okuyacağı tanıtım metni.</p>
        <textarea
          value={form.bio}
          onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
          rows={4}
          placeholder="Kendinizi kısaca tanıtın..."
          className="w-full bg-surface-container rounded-md px-5 py-3 text-on-background placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest transition resize-none"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-full squishy-btn bg-primary text-on-primary px-6 py-3 text-label-md font-semibold disabled:opacity-50"
        >
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
        {saved && <span className="text-on-secondary-container text-body-md font-medium">✓ Kaydedildi</span>}
      </div>
    </div>
  );
}
