"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GRADE_LABELS } from "@/lib/utils";
import { GradeLevel } from "@prisma/client";

interface Student {
  id: string;
  name: string;
  gradeLevel: GradeLevel;
  birthDate: string | null;
  notes: string | null;
  lessonCount?: number;
  teachers?: string[];
}

export default function StudentManager({
  parentId,
  students,
}: {
  parentId: string;
  students: Student[];
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    gradeLevel: "ILKOKUL_1" as GradeLevel,
    birthDate: "",
    notes: "",
  });

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/parent/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parentId, ...form }),
    });

    setLoading(false);
    setShowForm(false);
    setForm({ name: "", gradeLevel: "ILKOKUL_1", birthDate: "", notes: "" });
    router.refresh();
  }

  async function handleDelete(studentId: string) {
    if (!confirm("Bu öğrenciyi silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/parent/students/${studentId}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student) => (
          <div key={student.id} className="bg-surface-container-lowest rounded-md p-5 soft-card border border-outline-variant/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary rounded-full w-10 h-10 flex items-center justify-center text-on-primary font-display font-bold">
                {student.name[0]}
              </div>
              <div>
                <p className="font-display text-on-background font-semibold">{student.name}</p>
                <p className="text-caption text-on-surface-variant">
                  {GRADE_LABELS[student.gradeLevel] ?? student.gradeLevel}
                </p>
              </div>
            </div>
            {/* Ders sayısı + çalıştığı öğretmenler */}
            <div className="border-t border-outline-variant/20 pt-3 mt-1 space-y-2">
              <div className="flex items-center gap-2 text-caption">
                <span className="bg-primary-fixed text-on-primary-fixed px-2.5 py-1 rounded-full font-semibold">
                  {student.lessonCount ?? 0} ders
                </span>
              </div>
              <div>
                <p className="text-[11px] text-on-surface-variant font-semibold uppercase tracking-wide mb-1">Çalıştığı Öğretmenler</p>
                {student.teachers && student.teachers.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {student.teachers.map((t) => (
                      <span key={t} className="text-[11px] bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-caption text-on-surface-variant">Henüz yok</p>
                )}
              </div>
            </div>

            {student.notes && (
              <p className="text-caption text-on-surface-variant my-3 border-t border-outline-variant/20 pt-2">{student.notes}</p>
            )}
            <div className="flex items-center justify-between gap-2 mt-3">
              <Link
                href={`/parent/book?studentId=${student.id}`}
                className="rounded-full squishy-btn bg-primary text-on-primary px-4 py-1.5 text-caption font-semibold text-center"
              >
                Ders Al
              </Link>
              <button
                onClick={() => handleDelete(student.id)}
                className="rounded-full bg-error-container text-on-error-container px-4 py-1.5 text-caption font-semibold hover:opacity-90 transition"
              >
                Sil
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={() => setShowForm(true)}
          className="border-2 border-dashed border-outline-variant rounded-md p-5 text-on-surface-variant hover:border-primary hover:text-primary transition text-label-md font-medium flex items-center justify-center gap-2 min-h-[130px]"
        >
          + Öğrenci Ekle
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-on-background/40 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest rounded-md p-6 w-full max-w-md soft-card-static border border-outline-variant/20">
            <h2 className="font-display text-headline-md text-on-background mb-4">Yeni Öğrenci Ekle</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-label-md font-semibold text-on-background mb-1.5">Ad Soyad</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full bg-surface-container rounded-full px-5 py-3 text-on-background placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest transition"
                />
              </div>

              <div>
                <label className="block text-label-md font-semibold text-on-background mb-1.5">Sınıf Seviyesi</label>
                <select
                  value={form.gradeLevel}
                  onChange={(e) => setForm({ ...form, gradeLevel: e.target.value as GradeLevel })}
                  className="w-full bg-surface-container rounded-md px-5 py-3 text-on-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                >
                  {Object.entries(GRADE_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-label-md font-semibold text-on-background mb-1.5">Doğum Tarihi (isteğe bağlı)</label>
                <input
                  type="date"
                  value={form.birthDate}
                  onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                  className="w-full bg-surface-container rounded-full px-5 py-3 text-on-background focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest transition"
                />
              </div>

              <div>
                <label className="block text-label-md font-semibold text-on-background mb-1.5">Notlar (isteğe bağlı)</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                  className="w-full bg-surface-container rounded-md px-5 py-3 text-on-background placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest transition resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 rounded-full border-2 border-primary text-primary px-6 py-3 text-label-md font-semibold hover:bg-primary/5 transition"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-full squishy-btn bg-primary text-on-primary px-6 py-3 text-label-md font-semibold disabled:opacity-50"
                >
                  {loading ? "Ekleniyor..." : "Ekle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
