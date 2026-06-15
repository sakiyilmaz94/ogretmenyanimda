"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatDate, GRADE_LABELS, SUBJECT_LABELS } from "@/lib/utils";
import { applyRecordFilters, type RecordFilterState } from "@/lib/recordFilter";
import RecordFilterBar from "@/components/dashboard/RecordFilterBar";
import AssessmentResultViewer from "@/components/dashboard/AssessmentResultViewer";
import LessonReportViewer, { type LessonReportData } from "@/components/dashboard/LessonReportViewer";

export interface AppointmentRecord {
  id: string;
  date: string; // ISO slot günü
  startTime: string;
  endTime: string;
  subject: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  paymentStatus: string | null;
  meetingUrl: string | null;
  counterpartName: string;
  // Bu derse bağlı tamamlanmamış seviye testi varsa onun id'si; yoksa null
  pendingTestId: string | null;
}

export interface TestRecord {
  id: string; // assessmentId
  date: string; // ISO
  subject: string;
  status: "PENDING" | "COMPLETED";
}

export interface HistoryRecord {
  bookingId: string;
  date: string; // ISO
  subject: string;
  counterpartName: string;
  report: LessonReportData | null;
}

export interface StudentEducationDetailProps {
  studentName: string;
  gradeLevel: string;
  appointments: AppointmentRecord[];
  tests: TestRecord[];
  history: HistoryRecord[];
  canViewTestResults: boolean;
  canTakeTest: boolean;
}

type Tab = "appointments" | "tests" | "history";

const NEAR_PAST_MS = 2 * 3600 * 1000;
function lessonStartMs(date: string, startTime: string) {
  return new Date(`${date.slice(0, 10)}T${startTime}:00+03:00`).getTime();
}

const paymentLabel: Record<string, string> = {
  PAID: "Ödendi",
  PENDING: "Ödeme bekliyor",
  FAILED: "Başarısız",
  REFUNDED: "İade edildi",
};

export default function StudentEducationDetail({
  studentName,
  gradeLevel,
  appointments,
  tests,
  history,
  canViewTestResults,
  canTakeTest,
}: StudentEducationDetailProps) {
  const [tab, setTab] = useState<Tab>("appointments");
  const [filter, setFilter] = useState<RecordFilterState>({ sort: "dateDesc", payment: "all", subject: "all" });

  const subjects = useMemo(() => {
    const src = tab === "appointments" ? appointments : tab === "tests" ? tests : history;
    return Array.from(new Set(src.map((r) => r.subject)));
  }, [tab, appointments, tests, history]);

  const visibleAppointments = useMemo(() => applyRecordFilters(appointments, filter), [appointments, filter]);
  const visibleTests = useMemo(
    () => applyRecordFilters(tests.map((t) => ({ ...t, paymentStatus: null })), filter),
    [tests, filter]
  );
  const visibleHistory = useMemo(
    () => applyRecordFilters(history.map((h) => ({ ...h, paymentStatus: null })), filter),
    [history, filter]
  );

  const now = Date.now();

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "appointments", label: "Randevular", count: appointments.length },
    { key: "tests", label: "Seviye Testleri", count: tests.length },
    { key: "history", label: "Eğitim Geçmişi", count: history.length },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-headline-lg text-on-background">{studentName}</h1>
        <p className="text-body-md text-on-surface-variant">{GRADE_LABELS[gradeLevel] ?? gradeLevel}</p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-outline-variant/30 pb-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setTab(t.key);
              setFilter({ sort: "dateDesc", payment: "all", subject: "all" });
            }}
            className={
              "px-4 py-2 rounded-full text-label-md font-medium transition " +
              (tab === t.key
                ? "bg-primary text-on-primary"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high")
            }
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      <RecordFilterBar value={filter} onChange={setFilter} subjects={subjects} showPayment={tab === "appointments"} />

      {tab === "appointments" && (
        <div className="space-y-3">
          {visibleAppointments.length === 0 && <Empty label="Bu filtreyle randevu yok." />}
          {visibleAppointments.map((a) => {
            // Ödenmiş (status ödeme sonrası COMPLETED olur), iptal edilmemiş ve henüz bitmemiş ders → Meet'e katılınabilir
            const upcoming =
              a.paymentStatus === "PAID" &&
              a.status !== "CANCELLED" &&
              lessonStartMs(a.date, a.startTime) + NEAR_PAST_MS > now;
            return (
              <div key={a.id} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-4 soft-card-static">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-display text-title-md text-on-background">{SUBJECT_LABELS[a.subject] ?? a.subject}</p>
                    <p className="text-body-sm text-on-surface-variant">
                      {formatDate(a.date)} · {a.startTime}–{a.endTime} · {a.counterpartName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {a.paymentStatus && (
                      <span className="text-caption bg-surface-container px-3 py-1 rounded-full text-on-surface-variant">
                        {paymentLabel[a.paymentStatus] ?? a.paymentStatus}
                      </span>
                    )}
                    {upcoming && canTakeTest && a.pendingTestId ? (
                      <Link
                        href={`/test/${a.pendingTestId}`}
                        className="text-caption bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1.5 rounded-full font-semibold hover:opacity-90 transition"
                      >
                        Önce Seviye Testini Çöz →
                      </Link>
                    ) : upcoming && a.meetingUrl ? (
                      <a href={a.meetingUrl} target="_blank" rel="noopener noreferrer" className="text-caption bg-primary text-on-primary px-3 py-1.5 rounded-full font-semibold hover:opacity-90 transition">
                        Derse Katıl
                      </a>
                    ) : upcoming && !a.meetingUrl ? (
                      <span className="text-caption text-on-surface-variant">Bağlantı ders saatine yakın aktifleşecek</span>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "tests" && (
        <div className="space-y-3">
          {visibleTests.length === 0 && <Empty label="Bu filtreyle seviye testi yok." />}
          {visibleTests.map((t) => (
            <div key={t.id} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-4 soft-card-static flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="font-display text-title-md text-on-background">{SUBJECT_LABELS[t.subject] ?? t.subject}</p>
                <p className="text-body-sm text-on-surface-variant">{formatDate(t.date)}</p>
              </div>
              {t.status === "COMPLETED" && canViewTestResults ? (
                <AssessmentResultViewer assessmentId={t.id} />
              ) : t.status === "COMPLETED" ? (
                <span className="text-caption bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-medium">Tamamlandı</span>
              ) : canTakeTest ? (
                <Link
                  href={`/test/${t.id}`}
                  className="text-caption bg-primary text-on-primary px-3 py-1.5 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Sınava Başla →
                </Link>
              ) : (
                <span className="text-caption bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full font-medium">Bekliyor</span>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "history" && (
        <div className="space-y-3">
          {visibleHistory.length === 0 && <Empty label="Tamamlanmış ders kaydı yok." />}
          {visibleHistory.map((h) => (
            <div key={h.bookingId} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-4 soft-card-static flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="font-display text-title-md text-on-background">{SUBJECT_LABELS[h.subject] ?? h.subject}</p>
                <p className="text-body-sm text-on-surface-variant">{formatDate(h.date)} · {h.counterpartName}</p>
              </div>
              {h.report ? (
                <LessonReportViewer report={h.report} />
              ) : (
                <span className="text-caption text-on-surface-variant">Rapor henüz hazır değil</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="bg-surface-container rounded-2xl p-8 text-center text-body-md text-on-surface-variant">
      {label}
    </div>
  );
}
