"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatCurrency, formatDate, SUBJECT_LABELS, GRADE_LABELS } from "@/lib/utils";
import BookingStatusActions from "@/components/dashboard/BookingStatusActions";
import LessonReportButton from "@/components/dashboard/LessonReportButton";
import AssessmentResultViewer from "@/components/dashboard/AssessmentResultViewer";

export interface BookingItem {
  id: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  studentName: string;
  parentName: string;
  gradeLevel: string | null;
  subject: string;
  date: string; // ISO (slot günü)
  startTime: string;
  endTime: string;
  notes: string | null;
  totalPrice: number;
  meetingUrl: string | null;
  hasReport: boolean;
  assessment: { id: string; status: string; responseCount: number } | null;
  createdAt: string;
}

type TabKey = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
type SortKey = "lessonDate" | "studentName" | "requestDate";

const TABS: { key: TabKey; label: string }[] = [
  { key: "PENDING", label: "Onay Bekleyen" },
  { key: "CONFIRMED", label: "Ödeme Bekleniyor" },
  { key: "COMPLETED", label: "Kesinleşti" },
  { key: "CANCELLED", label: "İptal" },
];

// Pazartesi=1 ... Pazar=0 (JS). Filtre için Pzt-başlangıçlı index.
const DAYS = [
  { v: 1, label: "Pzt" },
  { v: 2, label: "Sal" },
  { v: 3, label: "Çar" },
  { v: 4, label: "Per" },
  { v: 5, label: "Cum" },
  { v: 6, label: "Cmt" },
  { v: 0, label: "Paz" },
];

export default function EducatorBookingsView({ bookings }: { bookings: BookingItem[] }) {
  const counts = useMemo(() => {
    const c: Record<TabKey, number> = { PENDING: 0, CONFIRMED: 0, COMPLETED: 0, CANCELLED: 0 };
    bookings.forEach((b) => { c[b.status]++; });
    return c;
  }, [bookings]);

  const firstNonEmpty = (TABS.find((t) => counts[t.key] > 0)?.key ?? "PENDING") as TabKey;
  const [tab, setTab] = useState<TabKey>(firstNonEmpty);
  const [sort, setSort] = useState<SortKey>("lessonDate");
  const [day, setDay] = useState<number | "all">("all");

  const visible = useMemo(() => {
    let list = bookings.filter((b) => b.status === tab);
    if (day !== "all") list = list.filter((b) => new Date(b.date).getDay() === day);
    list = [...list].sort((a, b) => {
      if (sort === "studentName") return a.studentName.localeCompare(b.studentName, "tr");
      if (sort === "requestDate") return +new Date(b.createdAt) < +new Date(a.createdAt) ? -1 : 1;
      // lessonDate (kronolojik: tarih + saat)
      const da = a.date + "T" + a.startTime;
      const db = b.date + "T" + b.startTime;
      return da < db ? -1 : da > db ? 1 : 0;
    });
    return list;
  }, [bookings, tab, sort, day]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-headline-xl text-on-background">Rezervasyonlar</h1>
        <p className="text-body-md text-on-surface-variant mt-0.5">Size yapılan tüm ders talepleri</p>
      </div>

      {/* Sekmeler */}
      <div className="flex flex-wrap gap-2 border-b border-outline-variant/40 pb-px">
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative px-4 py-2.5 rounded-t-lg text-label-md font-semibold transition-colors flex items-center gap-2 ${
                active
                  ? "bg-surface-container-lowest text-primary border-b-2 border-primary"
                  : "text-on-surface-variant hover:text-on-background hover:bg-surface-container/50"
              }`}
            >
              {t.label}
              <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${
                active ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant"
              }`}>
                {counts[t.key]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sıralama + gün filtresi */}
      {counts[tab] > 0 && (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <label className="flex items-center gap-2 text-label-md text-on-surface-variant">
            Sırala:
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="bg-surface-container rounded-lg px-3 py-1.5 text-on-background text-label-md focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="lessonDate">Ders tarihi</option>
              <option value="studentName">Öğrenci (A-Z)</option>
              <option value="requestDate">Talep tarihi</option>
            </select>
          </label>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-label-md text-on-surface-variant mr-1">Gün:</span>
            <button
              onClick={() => setDay("all")}
              className={`px-2.5 py-1 rounded-full text-caption font-semibold transition ${
                day === "all" ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              Tümü
            </button>
            {DAYS.map((d) => (
              <button
                key={d.v}
                onClick={() => setDay(d.v)}
                className={`px-2.5 py-1 rounded-full text-caption font-semibold transition ${
                  day === d.v ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Liste */}
      {visible.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-10 text-center soft-card-static">
          <p className="text-body-md text-on-surface-variant">
            {counts[tab] === 0 ? "Bu durumda rezervasyon yok." : "Seçilen güne uygun rezervasyon yok."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((b) => (
            <BookingCard key={b.id} b={b} />
          ))}
        </div>
      )}
    </div>
  );
}

function BookingCard({ b }: { b: BookingItem }) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-5 soft-card-static hover:border-primary/20 transition">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-on-background text-body-lg">{b.studentName}</span>
            {b.gradeLevel && (
              <span className="text-caption bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded-full">
                {GRADE_LABELS[b.gradeLevel] ?? b.gradeLevel}
              </span>
            )}
            <span className="text-caption text-on-surface-variant">· {b.parentName}</span>
          </div>
          <p className="text-body-md font-medium text-on-background">{SUBJECT_LABELS[b.subject] ?? b.subject}</p>
          <p className="text-caption text-on-surface-variant">
            {formatDate(b.date)} · {b.startTime}–{b.endTime}
          </p>
          {b.notes && b.status === "PENDING" && (
            <p className="text-caption text-on-surface-variant italic bg-surface-container rounded-lg px-3 py-1.5">&quot;{b.notes}&quot;</p>
          )}
        </div>

        <div className="flex flex-col sm:items-end gap-2 shrink-0">
          {b.status === "PENDING" && <BookingStatusActions bookingId={b.id} />}

          {b.status === "CONFIRMED" && (
            <span className="text-caption bg-primary-fixed text-on-primary-fixed border border-outline-variant/20 px-3 py-1.5 rounded-full font-medium">
              Veli ödemesi bekleniyor…
            </span>
          )}

          {b.status === "COMPLETED" && (
            <span className="inline-flex items-center gap-1.5 text-caption bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-semibold">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Kesinleşti
            </span>
          )}

          {b.status === "CANCELLED" && (
            <span className="text-caption bg-error-container text-on-error-container px-3 py-1 rounded-full font-semibold">İptal</span>
          )}

          {/* Eylemler (iptal hariç) */}
          {b.status !== "CANCELLED" && b.status !== "PENDING" && (
            <div className="flex items-center gap-2 flex-wrap sm:justify-end">
              {b.assessment?.status === "COMPLETED" && b.assessment.responseCount > 0 && (
                <AssessmentResultViewer assessmentId={b.assessment.id} />
              )}
              {b.meetingUrl && (
                <Link
                  href={b.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-caption text-primary hover:underline font-medium"
                >
                  Meet
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              )}
              {b.status === "COMPLETED" && <LessonReportButton bookingId={b.id} hasReport={b.hasReport} />}
            </div>
          )}

          {(b.status === "CONFIRMED" || b.status === "COMPLETED") && (
            <span className="font-display text-body-lg font-bold text-on-background">{formatCurrency(b.totalPrice)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
