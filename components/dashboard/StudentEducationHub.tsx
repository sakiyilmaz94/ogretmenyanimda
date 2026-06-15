"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatDate, GRADE_LABELS } from "@/lib/utils";

export interface StudentCard {
  id: string;
  name: string;
  gradeLevel: string;
  testCount: number;
  completedTestCount: number;
  lessonCount: number;
  nextLessonDate: string | null; // ISO
  pendingPayment: boolean;
}

interface StudentEducationHubProps {
  students: StudentCard[];
  basePath: string; // "/parent/egitim" | "/educator/egitim"
  emptyHint: string;
}

export default function StudentEducationHub({ students, basePath, emptyHint }: StudentEducationHubProps) {
  const [sort, setSort] = useState<"name" | "next">("name");

  const sorted = useMemo(() => {
    const copy = [...students];
    if (sort === "name") copy.sort((a, b) => a.name.localeCompare(b.name, "tr"));
    else
      copy.sort((a, b) => {
        const ax = a.nextLessonDate ? new Date(a.nextLessonDate).getTime() : Infinity;
        const bx = b.nextLessonDate ? new Date(b.nextLessonDate).getTime() : Infinity;
        return ax - bx;
      });
    return copy;
  }, [students, sort]);

  if (students.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-12 text-center soft-card-static">
        <p className="text-4xl mb-4">🎓</p>
        <h3 className="font-display text-headline-md text-on-background mb-2">Henüz öğrenci yok</h3>
        <p className="text-body-md text-on-surface-variant">{emptyHint}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-end">
        <select
          aria-label="Sıralama"
          className="text-label-md bg-surface-container-lowest border border-outline-variant/40 rounded-full px-3 py-1.5"
          value={sort}
          onChange={(e) => setSort(e.target.value as "name" | "next")}
        >
          <option value="name">İsme göre</option>
          <option value="next">Yaklaşan derse göre</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((s) => (
          <Link
            key={s.id}
            href={`${basePath}/${s.id}`}
            className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-5 soft-card hover:border-primary/40 transition block"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display text-title-lg text-on-background">{s.name}</p>
                <p className="text-body-sm text-on-surface-variant">{GRADE_LABELS[s.gradeLevel] ?? s.gradeLevel}</p>
              </div>
              {s.pendingPayment && (
                <span className="text-caption bg-error-container text-on-error-container px-2.5 py-1 rounded-full font-semibold">Ödeme bekliyor</span>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-caption">
              <span className="bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full">
                {s.completedTestCount}/{s.testCount} test
              </span>
              <span className="bg-surface-container px-2.5 py-1 rounded-full text-on-surface-variant">{s.lessonCount} ders</span>
              {s.nextLessonDate && (
                <span className="bg-tertiary-fixed text-on-tertiary-fixed px-2.5 py-1 rounded-full">
                  Sonraki: {formatDate(s.nextLessonDate)}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
