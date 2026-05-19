"use client";

import { useState, useEffect } from "react";
import { Subject, GradeLevel, LessonProgramStatus } from "@prisma/client";
import { SUBJECT_LABELS, GRADE_LABELS, formatCurrency } from "@/lib/utils";

interface LessonProgram {
  id: string;
  name: string;
  subject: Subject;
  gradeLevel: GradeLevel;
  durationMin: number;
  maxStudents: number;
  status: LessonProgramStatus;
}

interface EducatorLesson {
  id: string;
  price: { toNumber?: () => number } | number;
  status: string;
  rejectionNote: string | null;
  lessonProgram: LessonProgram;
}

export default function EducatorDerslerimPage() {
  const [myLessons, setMyLessons] = useState<EducatorLesson[]>([]);
  const [allPrograms, setAllPrograms] = useState<LessonProgram[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadLessons() {
    const res = await fetch("/api/educator/lessons");
    if (res.ok) setMyLessons(await res.json());
  }

  async function loadPrograms() {
    const res = await fetch("/api/admin/lesson-programs");
    if (res.ok) setAllPrograms(await res.json());
  }

  useEffect(() => { loadLessons(); loadPrograms(); }, []);

  const myProgramIds = new Set(myLessons.map((l) => l.lessonProgram.id));
  const available = allPrograms.filter((p) => p.status === "ACTIVE" && !myProgramIds.has(p.id));

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/educator/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonProgramId: selectedProgram, price: parseFloat(price) }),
    });
    setLoading(false);
    if (!res.ok) { setError((await res.json()).error || "Hata"); return; }
    setShowAdd(false);
    setSelectedProgram("");
    setPrice("");
    loadLessons();
  }

  async function handleRemove(id: string) {
    if (!confirm("Bu dersi kaldırmak istediğinize emin misiniz?")) return;
    await fetch("/api/educator/lessons", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadLessons();
  }

  const getPrice = (p: EducatorLesson["price"]) => typeof p === "number" ? p : p.toNumber?.() ?? 0;

  const statusInfo: Record<string, { label: string; color: string }> = {
    PENDING_APPROVAL: { label: "Onay Bekliyor", color: "bg-amber-100 text-amber-700" },
    APPROVED: { label: "Yayında", color: "bg-green-100 text-green-700" },
    REJECTED: { label: "Reddedildi", color: "bg-red-100 text-red-700" },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Derslerim</h1>
          <p className="text-slate-500 text-sm mt-0.5">Admin tarafından oluşturulmuş programlardan seçin, fiyat belirleyin</p>
        </div>
        {available.length > 0 && (
          <button
            onClick={() => setShowAdd(true)}
            className="bg-gold-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gold-600 transition"
          >
            + Ders Ekle
          </button>
        )}
      </div>

      {showAdd && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-semibold text-navy-900 mb-4">Ders Programı Seç</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Program</label>
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
              >
                <option value="">Seçin...</option>
                {available.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {SUBJECT_LABELS[p.subject]} · {GRADE_LABELS[p.gradeLevel]} · {p.durationMin} dk
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Fiyat (₺ / ders)</label>
              <input
                type="number"
                min="0"
                step="10"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                placeholder="ör. 250"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700">
              Belirlediğiniz fiyat admin onayına gönderilecektir. Onaylandıktan sonra yayına çıkar.
            </div>
            {error && <p className="text-red-600 text-sm bg-red-50 rounded-xl px-4 py-2">{error}</p>}
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setShowAdd(false)}
                className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition">
                İptal
              </button>
              <button type="submit" disabled={loading}
                className="px-5 py-2.5 bg-gold-500 text-white rounded-xl text-sm font-semibold hover:bg-gold-600 disabled:opacity-50 transition">
                {loading ? "Gönderiliyor..." : "Onaya Gönder"}
              </button>
            </div>
          </form>
        </div>
      )}

      {myLessons.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <p className="text-4xl mb-4">📚</p>
          <h3 className="font-semibold text-navy-900 mb-2">Henüz ders eklemediniz</h3>
          <p className="text-slate-500 text-sm mb-4">Ders programlarından seçim yaparak fiyat belirleyin.</p>
          {available.length > 0 && (
            <button onClick={() => setShowAdd(true)}
              className="bg-gold-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gold-600 transition">
              Ders Ekle
            </button>
          )}
          {allPrograms.length === 0 && (
            <p className="text-slate-400 text-xs mt-2">Admin henüz ders programı oluşturmadı.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {myLessons.map((lesson) => {
            const si = statusInfo[lesson.status] ?? { label: lesson.status, color: "bg-slate-100 text-slate-600" };
            return (
              <div key={lesson.id} className="bg-white rounded-2xl border border-slate-100 p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-navy-900 text-sm leading-snug">{lesson.lessonProgram.name}</h3>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${si.color}`}>{si.label}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs bg-navy-50 text-navy-700 px-2 py-0.5 rounded-full">{SUBJECT_LABELS[lesson.lessonProgram.subject]}</span>
                  <span className="text-xs bg-gold-50 text-gold-700 px-2 py-0.5 rounded-full">{GRADE_LABELS[lesson.lessonProgram.gradeLevel]}</span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{lesson.lessonProgram.durationMin} dk</span>
                </div>
                <p className="text-xl font-bold text-navy-900">{formatCurrency(getPrice(lesson.price))}</p>
                {lesson.rejectionNote && (
                  <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">Red: {lesson.rejectionNote}</p>
                )}
                <button onClick={() => handleRemove(lesson.id)}
                  className="w-full text-xs py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium">
                  Kaldır
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
