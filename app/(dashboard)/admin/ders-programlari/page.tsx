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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Ders Programları</h1>
          <p className="text-slate-500 text-sm mt-0.5">Öğretmenler bu programlardan seçim yaparak fiyat belirler</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm(empty); }}
          className="bg-gold-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gold-600 transition"
        >
          + Yeni Program
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-semibold text-navy-900 mb-5">{editId ? "Programı Düzenle" : "Yeni Ders Programı"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Program Adı</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="ör. 5. Sınıf Matematik Bireysel"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ders Konusu</label>
                <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value as Subject })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400">
                  {(Object.keys(SUBJECT_LABELS) as Subject[]).map((s) => (
                    <option key={s} value={s}>{SUBJECT_LABELS[s]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sınıf Seviyesi</label>
                <select value={form.gradeLevel} onChange={(e) => setForm({ ...form, gradeLevel: e.target.value as GradeLevel })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400">
                  {(Object.keys(GRADE_LABELS) as GradeLevel[]).map((g) => (
                    <option key={g} value={g}>{GRADE_LABELS[g]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Süre (dakika)</label>
                <input type="number" min={30} max={120} step={15} value={form.durationMin}
                  onChange={(e) => setForm({ ...form, durationMin: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Max Öğrenci</label>
                <input type="number" min={1} max={10} value={form.maxStudents}
                  onChange={(e) => setForm({ ...form, maxStudents: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama (opsiyonel)</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2} placeholder="Ders içeriği hakkında kısa bilgi..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gold-400" />
              </div>
            </div>
            {error && <p className="text-red-600 text-sm bg-red-50 rounded-xl px-4 py-2">{error}</p>}
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)}
                className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition">
                İptal
              </button>
              <button type="submit" disabled={loading}
                className="px-5 py-2.5 bg-gold-500 text-white rounded-xl text-sm font-semibold hover:bg-gold-600 disabled:opacity-50 transition">
                {loading ? "Kaydediliyor..." : editId ? "Güncelle" : "Oluştur"}
              </button>
            </div>
          </form>
        </div>
      )}

      {programs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <p className="text-4xl mb-4">📚</p>
          <h3 className="font-semibold text-navy-900 mb-2">Henüz ders programı yok</h3>
          <p className="text-slate-500 text-sm">İlk programı oluşturmak için &quot;Yeni Program&quot; butonuna tıklayın.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {programs.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-100 p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-navy-900 text-sm leading-snug">{p.name}</h3>
                <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${p.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                  {p.status === "ACTIVE" ? "Aktif" : "Pasif"}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-xs bg-navy-50 text-navy-700 px-2 py-0.5 rounded-full">{SUBJECT_LABELS[p.subject]}</span>
                <span className="text-xs bg-gold-50 text-gold-700 px-2 py-0.5 rounded-full">{GRADE_LABELS[p.gradeLevel]}</span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{p.durationMin} dk</span>
                {p.maxStudents > 1 && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">Max {p.maxStudents} öğrenci</span>}
              </div>
              {p.description && <p className="text-xs text-slate-500 leading-relaxed">{p.description}</p>}
              <div className="flex gap-2 pt-1">
                <button onClick={() => startEdit(p)} className="flex-1 text-xs py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium">
                  Düzenle
                </button>
                <button onClick={() => toggleStatus(p)} className="flex-1 text-xs py-2 bg-navy-50 text-navy-700 rounded-lg hover:bg-navy-100 transition font-medium">
                  {p.status === "ACTIVE" ? "Pasifleştir" : "Aktifleştir"}
                </button>
                <button onClick={() => handleDelete(p.id)} className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-xs font-medium">
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
