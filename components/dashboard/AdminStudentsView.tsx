"use client";

import { useState, useMemo } from "react";
import { formatDate, GRADE_LABELS } from "@/lib/utils";
import AdminToolbar, { AdminSelect, rangeCutoff, type DateRange } from "@/components/dashboard/AdminToolbar";

export interface AdminStudentItem {
  id: string;
  name: string;
  gradeLevel: string;
  parentName: string;
  lessonCount: number;
  teachers: string[];
  createdAt: string;
}

export default function AdminStudentsView({ students }: { students: AdminStudentItem[] }) {
  const [q, setQ] = useState("");
  const [range, setRange] = useState<DateRange>("all");
  const [grade, setGrade] = useState("all");
  const [teacher, setTeacher] = useState("all");

  const teachers = useMemo(
    () => Array.from(new Set(students.flatMap((s) => s.teachers))).sort((a, b) => a.localeCompare(b, "tr")),
    [students]
  );

  const visible = useMemo(() => {
    const cutoff = rangeCutoff(range);
    const term = q.trim().toLocaleLowerCase("tr");
    return students.filter((s) => {
      if (cutoff !== null && +new Date(s.createdAt) < cutoff) return false;
      if (grade !== "all" && s.gradeLevel !== grade) return false;
      if (teacher !== "all" && !s.teachers.includes(teacher)) return false;
      if (term && !`${s.name} ${s.parentName}`.toLocaleLowerCase("tr").includes(term)) return false;
      return true;
    });
  }, [students, range, grade, teacher, q]);

  return (
    <div className="space-y-4">
      <AdminToolbar search={q} onSearch={setQ} searchPlaceholder="Öğrenci veya veli ara…" range={range} onRange={setRange} resultCount={visible.length}>
        <AdminSelect label="Sınıf" value={grade} onChange={setGrade} options={[{ value: "all", label: "Tümü" }, ...Object.entries(GRADE_LABELS).map(([v, l]) => ({ value: v, label: l }))]} />
        <AdminSelect label="Öğretmen" value={teacher} onChange={setTeacher} options={[{ value: "all", label: "Tümü" }, ...teachers.map((t) => ({ value: t, label: t }))]} />
      </AdminToolbar>

      <div className="bg-surface-container-lowest rounded-md soft-card-static overflow-x-auto border border-outline-variant/20">
        <table className="w-full text-body-md min-w-[720px]">
          <thead className="bg-surface-container text-on-surface-variant">
            <tr>
              <th className="text-left px-5 py-3 text-label-md font-semibold">Öğrenci</th>
              <th className="text-left px-5 py-3 text-label-md font-semibold">Sınıf</th>
              <th className="text-left px-5 py-3 text-label-md font-semibold">Veli</th>
              <th className="text-left px-5 py-3 text-label-md font-semibold">Öğretmenler</th>
              <th className="text-left px-5 py-3 text-label-md font-semibold">Ders</th>
              <th className="text-left px-5 py-3 text-label-md font-semibold">Kayıt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {visible.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-on-surface-variant text-label-md">Eşleşen öğrenci yok.</td></tr>
            ) : visible.map((s) => (
              <tr key={s.id} className="hover:bg-surface-container-low transition">
                <td className="px-5 py-3 font-medium text-on-background">{s.name}</td>
                <td className="px-5 py-3 text-on-surface-variant">{GRADE_LABELS[s.gradeLevel] ?? s.gradeLevel}</td>
                <td className="px-5 py-3 text-on-surface-variant">{s.parentName}</td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap gap-1">
                    {s.teachers.slice(0, 2).map((t) => <span key={t} className="text-[11px] bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full">{t}</span>)}
                    {s.teachers.length > 2 && <span className="text-[11px] text-on-surface-variant">+{s.teachers.length - 2}</span>}
                    {s.teachers.length === 0 && <span className="text-caption text-on-surface-variant">—</span>}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className="bg-primary-fixed text-on-primary-fixed text-caption px-2 py-0.5 rounded-full font-semibold">{s.lessonCount} ders</span>
                </td>
                <td className="px-5 py-3 text-on-surface-variant text-caption">{formatDate(s.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
