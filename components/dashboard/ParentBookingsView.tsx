"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatCurrency, formatDate, SUBJECT_LABELS } from "@/lib/utils";
import LessonReportViewer from "@/components/dashboard/LessonReportViewer";

export interface ParentBookingItem {
  id: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  studentName: string;
  educatorName: string;
  subject: string;
  date: string; // ISO (slot günü)
  startTime: string;
  totalPrice: number;
  paymentStatus: string | null;
  meetingUrl: string | null;
  report: { topicsCovered: string; nextSteps: string; homework: string | null; notes: string | null; createdAt: string } | null;
}

const statusLabel: Record<string, string> = {
  PENDING: "Onay Bekleniyor",
  CONFIRMED: "Onaylandı — Ödeme Bekleniyor",
  CANCELLED: "İptal Edildi",
  COMPLETED: "Kesinleştirildi",
};
const statusBadge: Record<string, string> = {
  PENDING: "bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full text-caption font-semibold",
  CONFIRMED: "bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-caption font-semibold",
  CANCELLED: "bg-error-container text-on-error-container px-3 py-1 rounded-full text-caption font-semibold",
  COMPLETED: "bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full text-caption font-semibold",
};

type Range = "all" | "week" | "month";
type SortKey = "dateDesc" | "dateAsc" | "student";
type PayFilter = "all" | "paid" | "unpaid";

export default function ParentBookingsView({ bookings }: { bookings: ParentBookingItem[] }) {
  const [range, setRange] = useState<Range>("all");
  const [student, setStudent] = useState("all");
  const [pay, setPay] = useState<PayFilter>("all");
  const [sort, setSort] = useState<SortKey>("dateDesc");

  const students = useMemo(
    () => Array.from(new Set(bookings.map((b) => b.studentName))).sort((a, b) => a.localeCompare(b, "tr")),
    [bookings]
  );

  const visible = useMemo(() => {
    const now = Date.now();
    const cutoff = range === "week" ? now - 7 * 864e5 : range === "month" ? now - 30 * 864e5 : null;
    let list = bookings.filter((b) => {
      if (cutoff !== null && +new Date(b.date) < cutoff) return false;
      if (student !== "all" && b.studentName !== student) return false;
      if (pay === "paid" && b.paymentStatus !== "PAID") return false;
      if (pay === "unpaid" && b.paymentStatus === "PAID") return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === "student") return a.studentName.localeCompare(b.studentName, "tr");
      const da = a.date + "T" + a.startTime;
      const db = b.date + "T" + b.startTime;
      return sort === "dateAsc" ? (da < db ? -1 : da > db ? 1 : 0) : (da > db ? -1 : da < db ? 1 : 0);
    });
    return list;
  }, [bookings, range, student, pay, sort]);

  return (
    <div className="space-y-4">
      <FilterBar
        range={range} setRange={setRange}
        student={student} setStudent={setStudent} students={students}
        sort={sort} setSort={setSort}
        extra={
          <label className="flex items-center gap-2 text-label-md text-on-surface-variant">
            Ödeme:
            <select value={pay} onChange={(e) => setPay(e.target.value as PayFilter)}
              className="bg-surface-container rounded-lg px-3 py-1.5 text-on-background text-label-md focus:outline-none focus:ring-2 focus:ring-primary/40">
              <option value="all">Tümü</option>
              <option value="paid">Ödendi</option>
              <option value="unpaid">Ödenmedi</option>
            </select>
          </label>
        }
      />

      <p className="text-caption text-on-surface-variant">{visible.length} rezervasyon gösteriliyor</p>

      {visible.length === 0 ? (
        <div className="bg-surface-container rounded-md p-10 text-center soft-card-static">
          <p className="text-body-md text-on-surface-variant">Seçilen filtrelere uygun rezervasyon yok.</p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-md soft-card-static border border-outline-variant/20 overflow-x-auto">
          <table className="w-full text-body-md min-w-[760px]">
            <thead className="bg-surface-container text-on-surface-variant">
              <tr>
                <th className="text-left px-4 py-3 text-label-md font-semibold">Öğrenci</th>
                <th className="text-left px-4 py-3 text-label-md font-semibold">Öğretmen</th>
                <th className="text-left px-4 py-3 text-label-md font-semibold">Ders</th>
                <th className="text-left px-4 py-3 text-label-md font-semibold">Tarih / Saat</th>
                <th className="text-left px-4 py-3 text-label-md font-semibold">Tutar</th>
                <th className="text-left px-4 py-3 text-label-md font-semibold">Durum</th>
                <th className="text-left px-4 py-3 text-label-md font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {visible.map((b) => (
                <tr key={b.id} className={`hover:bg-surface-container-low transition ${b.status === "CANCELLED" ? "opacity-60" : ""}`}>
                  <td className="px-4 py-3 font-semibold text-on-background">{b.studentName}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{b.educatorName}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{SUBJECT_LABELS[b.subject] ?? b.subject}</td>
                  <td className="px-4 py-3 text-on-surface-variant text-caption">{formatDate(b.date)} · {b.startTime}</td>
                  <td className="px-4 py-3 font-semibold">
                    {b.status === "COMPLETED"
                      ? <span className="text-on-secondary-container">{formatCurrency(b.totalPrice)}</span>
                      : b.status === "CONFIRMED"
                        ? <span className="text-on-tertiary-fixed">{formatCurrency(b.totalPrice)}</span>
                        : <span className="text-on-surface-variant text-caption">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    {b.status === "COMPLETED" ? (
                      <span className="inline-flex items-center gap-1.5 bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full text-caption font-semibold">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Kesinleştirildi
                      </span>
                    ) : (
                      <span className={statusBadge[b.status] ?? "bg-surface-container text-on-surface-variant px-3 py-1 rounded-full text-caption font-semibold"}>
                        {statusLabel[b.status] ?? b.status}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1.5">
                      {b.status === "CONFIRMED" && b.paymentStatus !== "PAID" && (
                        <Link href={`/parent/payments/${b.id}`}
                          className="text-caption bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1.5 rounded-full hover:opacity-90 font-semibold transition text-center">
                          Ödeme Yap →
                        </Link>
                      )}
                      {b.status === "COMPLETED" && b.report && <LessonReportViewer report={b.report} />}
                      {(b.status === "CONFIRMED" || b.status === "COMPLETED") && b.meetingUrl && (
                        <Link href={b.meetingUrl} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 text-caption bg-[#1a73e8] text-white px-3 py-1.5 rounded-full hover:bg-[#1558b0] font-semibold transition">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                          </svg>
                          Google Meet
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Ortak filtre çubuğu (rezervasyon + ödeme sayfaları)
export function FilterBar({
  range, setRange, student, setStudent, students, sort, setSort, extra,
}: {
  range: Range; setRange: (r: Range) => void;
  student: string; setStudent: (s: string) => void; students: string[];
  sort: SortKey; setSort: (s: SortKey) => void;
  extra?: React.ReactNode;
}) {
  const RANGES: { v: Range; label: string }[] = [
    { v: "all", label: "Tümü" },
    { v: "week", label: "Son 1 hafta" },
    { v: "month", label: "Son 1 ay" },
  ];
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-4 soft-card-static">
      <div className="flex items-center gap-1.5">
        <span className="text-label-md text-on-surface-variant mr-1">Dönem:</span>
        {RANGES.map((r) => (
          <button key={r.v} onClick={() => setRange(r.v)}
            className={`px-3 py-1.5 rounded-full text-caption font-semibold transition ${
              range === r.v ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}>
            {r.label}
          </button>
        ))}
      </div>

      <label className="flex items-center gap-2 text-label-md text-on-surface-variant">
        Öğrenci:
        <select value={student} onChange={(e) => setStudent(e.target.value)}
          className="bg-surface-container rounded-lg px-3 py-1.5 text-on-background text-label-md focus:outline-none focus:ring-2 focus:ring-primary/40">
          <option value="all">Tümü</option>
          {students.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>

      {extra}

      <label className="flex items-center gap-2 text-label-md text-on-surface-variant">
        Sırala:
        <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}
          className="bg-surface-container rounded-lg px-3 py-1.5 text-on-background text-label-md focus:outline-none focus:ring-2 focus:ring-primary/40">
          <option value="dateDesc">Tarih (yeni → eski)</option>
          <option value="dateAsc">Tarih (eski → yeni)</option>
          <option value="student">Öğrenci (A-Z)</option>
        </select>
      </label>
    </div>
  );
}

export type { Range, SortKey };
