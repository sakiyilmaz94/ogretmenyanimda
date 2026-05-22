"use client";

import { useState, useEffect } from "react";
import { Subject, GradeLevel, LessonProgramStatus } from "@prisma/client";
import { SUBJECT_LABELS, GRADE_LABELS } from "@/lib/utils";

interface LessonProgram {
  id: string;
  name: string;
  description: string | null;
  subject: Subject;
  gradeLevel: GradeLevel;
  durationMin: number;
  maxStudents: number;
  status: LessonProgramStatus;
}

const empty = { name: "", description: "", subject: "MATEMATIK" as Subject, gradeLevel: "ORTAOKUL_5" as GradeLevel, durationMin: 45, maxStudents: 1 };

export default function DersProgramlariPage() {
  const [programs, setPrograms] = useState<LessonProgram[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/admin/lesson-programs");
    if (res.ok) setPrograms(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = editId
      ? await fetch(`/api/admin/lesson-programs/${editId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      : await fetch("/api/admin/lesson-programs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });

    setLoading(false);
    if (!res.ok) { setError((await res.json()).error || "Hata"); return; }

    setShowForm(false);
    setEditId(null);
    setForm(empty);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu ders programını silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/admin/lesson-programs/${id}`, { method: "DELETE" });
    load();
  }

  async function toggleStatus(p: LessonProgram) {
    await fetch(`/api/admin/lesson-programs/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: p.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" }),
    });
    load();
  }

  function startEdit(p: LessonProgram) {
    setEditId(p.id);
    setForm({ name: p.name, description: p.description ?? "", subject: p.subject, gradeLevel: p.gradeLevel, durationMin: p.durationMin, maxStudents: p.maxStudents });
    setShowForm(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-headline-md text-on-background">Ders Programları</h1>
          <p className="text-label-md text-on-surface-variant mt-0.5">Öğretmenler bu programlardan seçim yaparak fiyat belirler</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm(empty); }}
          className="rounded-full bg-primary text-on-primary px-4 py-2 text-label-md hover:opacity-90 transition"
        >
          + Yeni Program
        </button>
      </div>

      {showForm && (
        <div className="bg-surface-container-lowest rounded-md border border-outline-variant/20 soft-card-static p-6">
          <h2 className="font-display text-headline-md text-on-background mb-5">{editId ? "Programı Düzenle" : "Yeni Ders Programı"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-label-md text-on-surface-variant mb-1">Program Adı</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="ör. 5. Sınıf Matematik Bireysel"
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant text-body-md text-on-background bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-label-md text-on-surface-variant mb-1">Ders Konusu</label>
                <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value as Subject })}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant text-body-md text-on-background bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {(Object.keys(SUBJECT_LABELS) as Subject[]).map((s) => (
                    <option key={s} value={s}>{SUBJECT_LABELS[s]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-label-md text-on-surface-variant mb-1">Sınıf Seviyesi</label>
                <select value={form.gradeLevel} onChange={(e) => setForm({ ...form, gradeLevel: e.target.value as GradeLevel })}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant text-body-md text-on-background bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {(Object.keys(GRADE_LABELS) as GradeLevel[]).map((g) => (
                    <option key={g} value={g}>{GRADE_LABELS[g]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-label-md text-on-surface-variant mb-1">Süre (dakika)</label>
                <input type="number" min={30} max={120} step={15} value={form.durationMin}
                  onChange={(e) => setForm({ ...form, durationMin: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant text-body-md text-on-background bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-label-md text-on-surface-variant mb-1">Max Öğrenci</label>
                <input type="number" min={1} max={10} value={form.maxStudents}
                  onChange={(e) => setForm({ ...form, maxStudents: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant text-body-md text-on-background bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-label-md text-on-surface-variant mb-1">Açıklama (opsiyonel)</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2} placeholder="Ders içeriği hakkında kısa bilgi..."
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant text-body-md text-on-background bg-surface-container-lowest resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
            {error && <p className="text-body-md text-on-error-container bg-error-container rounded-xl px-4 py-2">{error}</p>}
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)}
                className="rounded-full border border-outline-variant text-on-surface-variant px-4 py-2 text-label-md hover:bg-surface-container transition">
                İptal
              </button>
              <button type="submit" disabled={loading}
                className="rounded-full bg-primary text-on-primary px-4 py-2 text-label-md hover:opacity-90 disabled:opacity-50 transition">
                {loading ? "Kaydediliyor..." : editId ? "Güncelle" : "Oluştur"}
              </button>
            </div>
          </form>
        </div>
      )}

      {programs.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-md p-12 text-center soft-card-static border border-outline-variant/20">
          <div className="bg-primary-fixed rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-on-primary-fixed-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="font-display text-headline-md text-on-background mb-2">Henüz ders programı yok</h3>
          <p className="text-label-md text-on-surface-variant">İlk programı oluşturmak için &quot;Yeni Program&quot; butonuna tıklayın.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {programs.map((p) => (
            <div key={p.id} className="bg-surface-container-lowest rounded-md border border-outline-variant/20 p-5 space-y-3 soft-card">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-on-background text-body-md leading-snug">{p.name}</h3>
                <span className={`shrink-0 text-caption px-2 py-0.5 rounded-full font-semibold ${
                  p.status === "ACTIVE"
                    ? "bg-secondary-container text-on-secondary-container"
                    : "bg-surface-container text-on-surface-variant"
                }`}>
                  {p.status === "ACTIVE" ? "Aktif" : "Pasif"}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-caption bg-primary-fixed text-on-primary-fixed-variant px-2 py-0.5 rounded-full font-medium">{SUBJECT_LABELS[p.subject]}</span>
                <span className="text-caption bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full font-medium">{GRADE_LABELS[p.gradeLevel]}</span>
                <span className="text-caption bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full font-medium">{p.durationMin} dk</span>
                {p.maxStudents > 1 && <span className="text-caption bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full font-medium">Max {p.maxStudents} öğrenci</span>}
              </div>
              {p.description && <p className="text-caption text-on-surface-variant leading-relaxed">{p.description}</p>}
              <div className="flex gap-2 pt-1">
                <button onClick={() => startEdit(p)} className="flex-1 text-caption py-2 rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container transition font-medium">
                  Düzenle
                </button>
                <button onClick={() => toggleStatus(p)} className="flex-1 text-caption py-2 rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container transition font-medium">
                  {p.status === "ACTIVE" ? "Pasifleştir" : "Aktifleştir"}
                </button>
                <button onClick={() => handleDelete(p.id)} className="px-3 py-2 rounded-full bg-error-container text-on-error-container hover:opacity-90 transition text-caption font-medium">
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
