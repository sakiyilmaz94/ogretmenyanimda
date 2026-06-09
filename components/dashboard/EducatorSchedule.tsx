"use client";

import { useState, useMemo } from "react";
import { SUBJECT_LABELS } from "@/lib/utils";
import type { BookingItem } from "@/components/dashboard/EducatorBookingsView";

const DAY_LABELS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

type StatusKey = "CONFIRMED" | "COMPLETED" | "PENDING";
const STATUS_CHIPS: { key: StatusKey; label: string; dot: string }[] = [
  { key: "CONFIRMED", label: "Onaylı (ödeme bekleyen)", dot: "bg-primary-fixed" },
  { key: "COMPLETED", label: "Kesinleşti", dot: "bg-secondary-container" },
  { key: "PENDING", label: "Onay bekliyor", dot: "border border-dashed border-outline-variant" },
];

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function startOfWeekMonday(d: Date) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dow = (x.getDay() + 6) % 7; // Pzt = 0
  x.setDate(x.getDate() - dow);
  return x;
}
function addDays(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

function chipStyle(status: BookingItem["status"]) {
  if (status === "COMPLETED") return "bg-secondary-container text-on-secondary-container border-transparent";
  if (status === "PENDING") return "bg-surface-container text-on-surface-variant border border-dashed border-outline-variant opacity-70";
  return "bg-primary-fixed text-on-primary-fixed border-transparent"; // CONFIRMED
}

function LessonChip({ b, showTime = false }: { b: BookingItem; showTime?: boolean }) {
  // Tarihi bugünden önce olan ders yapılmış sayılır → "yapıldı" belirteci.
  const isPast = b.date.slice(0, 10) < ymd(new Date());
  return (
    <div className={`rounded-lg px-2 py-1 text-[11px] leading-tight ${chipStyle(b.status)} ${isPast ? "opacity-90" : ""}`}>
      <div className="flex items-center gap-1">
        {showTime && <span className="font-bold">{b.startTime}</span>}
        <span className="font-semibold truncate">{b.studentName}</span>
        {isPast && (
          <span
            title="Ders yapıldı"
            className="ml-auto shrink-0 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#16a34a] text-white"
          >
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
            </svg>
          </span>
        )}
      </div>
      <span className="block opacity-80">{SUBJECT_LABELS[b.subject] ?? b.subject}</span>
    </div>
  );
}

export default function EducatorSchedule({ bookings }: { bookings: BookingItem[] }) {
  const [view, setView] = useState<"week" | "month">("week");
  // Varsayılan: onaylı + kesinleşmiş açık, onay bekleyen kapalı. Öğretmen istediğini seçer.
  const [statusFilter, setStatusFilter] = useState<Record<StatusKey, boolean>>({
    CONFIRMED: true,
    COMPLETED: true,
    PENDING: false,
  });
  const [student, setStudent] = useState<string>("all");
  const toggleStatus = (k: StatusKey) =>
    setStatusFilter((s) => ({ ...s, [k]: !s[k] }));
  const [anchor, setAnchor] = useState<Date>(() => startOfWeekMonday(new Date()));

  const students = useMemo(
    () => Array.from(new Set(bookings.map((b) => b.studentName))).sort((a, b) => a.localeCompare(b, "tr")),
    [bookings]
  );

  // Kapsam: seçili durumlar + öğrenci filtresi.
  const scoped = useMemo(() => {
    return bookings.filter((b) => {
      if (!statusFilter[b.status as StatusKey]) return false;
      if (student !== "all" && b.studentName !== student) return false;
      return true;
    });
  }, [bookings, statusFilter, student]);

  // Güne göre indeksle (YYYY-MM-DD)
  const byDay = useMemo(() => {
    const m = new Map<string, BookingItem[]>();
    for (const b of scoped) {
      const key = b.date.slice(0, 10);
      (m.get(key) ?? m.set(key, []).get(key)!).push(b);
    }
    for (const arr of m.values()) arr.sort((a, b) => a.startTime.localeCompare(b.startTime));
    return m;
  }, [scoped]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-headline-xl text-on-background">Ders Programı</h1>
        <p className="text-body-md text-on-surface-variant mt-0.5">Onaylanan derslerin haftalık ve aylık takvimi</p>
      </div>

      {/* Kontroller */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {/* Görünüm */}
        <div className="inline-flex rounded-full bg-surface-container p-1">
          {(["week", "month"] as const).map((v) => (
            <button
              key={v}
              onClick={() => { setView(v); setAnchor(v === "week" ? startOfWeekMonday(new Date()) : new Date(new Date().getFullYear(), new Date().getMonth(), 1)); }}
              className={`px-4 py-1.5 rounded-full text-label-md font-semibold transition ${
                view === v ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-on-background"
              }`}
            >
              {v === "week" ? "Haftalık" : "Aylık"}
            </button>
          ))}
        </div>

        {/* Öğrenci filtresi */}
        <label className="flex items-center gap-2 text-label-md text-on-surface-variant">
          Öğrenci:
          <select
            value={student}
            onChange={(e) => setStudent(e.target.value)}
            className="bg-surface-container rounded-lg px-3 py-1.5 text-on-background text-label-md focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="all">Tümü</option>
            {students.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>

      </div>

      {/* Durum filtresi (seçilebilir çipler) — istediğini göster/gizle */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-label-md text-on-surface-variant mr-1">Göster:</span>
        {STATUS_CHIPS.map((c) => {
          const on = statusFilter[c.key];
          return (
            <button
              key={c.key}
              onClick={() => toggleStatus(c.key)}
              aria-pressed={on}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label-md font-semibold border transition ${
                on
                  ? "bg-primary text-on-primary border-primary"
                  : "bg-surface-container text-on-surface-variant border-outline-variant hover:bg-surface-container-high"
              }`}
            >
              <span className={`w-3 h-3 rounded inline-block ${c.dot}`} />
              {c.label}
            </button>
          );
        })}
      </div>

      {view === "week" ? (
        <WeekView anchor={anchor} setAnchor={setAnchor} byDay={byDay} />
      ) : (
        <MonthView anchor={anchor} setAnchor={setAnchor} byDay={byDay} />
      )}
    </div>
  );
}

function NavBar({ title, onPrev, onNext, onToday }: { title: string; onPrev: () => void; onNext: () => void; onToday: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <button onClick={onPrev} className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant transition" aria-label="Önceki">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <div className="flex items-center gap-3">
        <h2 className="font-display font-semibold text-on-background text-headline-md text-center">{title}</h2>
        <button onClick={onToday} className="text-caption font-semibold text-primary hover:underline">Bugün</button>
      </div>
      <button onClick={onNext} className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant transition" aria-label="Sonraki">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
}

function WeekView({ anchor, setAnchor, byDay }: { anchor: Date; setAnchor: (d: Date) => void; byDay: Map<string, BookingItem[]> }) {
  const weekStart = startOfWeekMonday(anchor);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const dayKeys = days.map(ymd);
  const todayKey = ymd(new Date());

  // Bu haftadaki derslerin başlangıç saatleri (satırlar)
  const times = useMemo(() => {
    const set = new Set<string>();
    dayKeys.forEach((k) => (byDay.get(k) ?? []).forEach((b) => set.add(b.startTime)));
    return Array.from(set).sort();
  }, [byDay, dayKeys.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  const weekEnd = days[6];
  const title =
    weekStart.getMonth() === weekEnd.getMonth()
      ? `${weekStart.getDate()}–${weekEnd.getDate()} ${MONTHS[weekStart.getMonth()]} ${weekStart.getFullYear()}`
      : `${weekStart.getDate()} ${MONTHS[weekStart.getMonth()]} – ${weekEnd.getDate()} ${MONTHS[weekEnd.getMonth()]} ${weekEnd.getFullYear()}`;

  return (
    <div className="space-y-4">
      <NavBar
        title={title}
        onPrev={() => setAnchor(addDays(weekStart, -7))}
        onNext={() => setAnchor(addDays(weekStart, 7))}
        onToday={() => setAnchor(startOfWeekMonday(new Date()))}
      />

      {times.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-10 text-center soft-card-static">
          <p className="text-body-md text-on-surface-variant">Bu hafta planlı ders yok.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-surface-container-lowest rounded-2xl border border-outline-variant/20 soft-card-static">
          <table className="w-full border-collapse min-w-[720px]">
            <thead>
              <tr>
                <th className="w-16 p-2 text-caption font-medium text-on-surface-variant text-left">Saat</th>
                {days.map((d, i) => {
                  const isToday = ymd(d) === todayKey;
                  return (
                    <th key={i} className={`p-2 text-center border-l border-outline-variant/20 ${isToday ? "bg-primary-fixed/40" : ""}`}>
                      <div className="text-caption font-semibold text-on-background">{DAY_LABELS[i]}</div>
                      <div className={`text-caption ${isToday ? "text-primary font-bold" : "text-on-surface-variant"}`}>{d.getDate()} {MONTHS[d.getMonth()].slice(0, 3)}</div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {times.map((time) => (
                <tr key={time} className="border-t border-outline-variant/20">
                  <td className="p-2 text-caption font-semibold text-on-surface-variant align-top">{time}</td>
                  {dayKeys.map((k, i) => {
                    const cell = (byDay.get(k) ?? []).filter((b) => b.startTime === time);
                    return (
                      <td key={i} className="p-1.5 align-top border-l border-outline-variant/20 min-w-[90px]">
                        <div className="space-y-1.5">
                          {cell.map((b) => <LessonChip key={b.id} b={b} />)}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function MonthView({ anchor, setAnchor, byDay }: { anchor: Date; setAnchor: (d: Date) => void; byDay: Map<string, BookingItem[]> }) {
  const monthStart = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const month = monthStart.getMonth();
  const todayKey = ymd(new Date());
  // Sadece bu ay: gereken hafta sayısı kadar satır (sonraki/önceki ay günleri boş bırakılır).
  const daysInMonth = new Date(monthStart.getFullYear(), month + 1, 0).getDate();
  const leadOffset = (monthStart.getDay() + 6) % 7; // Pzt-başlangıçlı baştaki boşluk
  const weeksNeeded = Math.ceil((leadOffset + daysInMonth) / 7);
  const gridStart = startOfWeekMonday(monthStart);
  const cells = Array.from({ length: weeksNeeded * 7 }, (_, i) => addDays(gridStart, i));

  return (
    <div className="space-y-4">
      <NavBar
        title={`${MONTHS[month]} ${monthStart.getFullYear()}`}
        onPrev={() => setAnchor(new Date(monthStart.getFullYear(), month - 1, 1))}
        onNext={() => setAnchor(new Date(monthStart.getFullYear(), month + 1, 1))}
        onToday={() => setAnchor(new Date(new Date().getFullYear(), new Date().getMonth(), 1))}
      />
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-2 soft-card-static overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-7 mb-1">
            {DAY_LABELS.map((d) => (
              <div key={d} className="text-center text-caption font-semibold text-on-surface-variant py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              const inMonth = d.getMonth() === month;
              // Diğer ayın günleri: boş placeholder (gün numarası/ders gösterilmez).
              if (!inMonth) {
                return <div key={i} className="min-h-[88px] rounded-lg border border-outline-variant/10 bg-surface-container/20" />;
              }
              const key = ymd(d);
              const isToday = key === todayKey;
              const lessons = byDay.get(key) ?? [];
              return (
                <div
                  key={i}
                  className={`min-h-[88px] rounded-lg p-1.5 border bg-surface-container-lowest ${
                    isToday ? "border-primary bg-primary-fixed/20" : "border-outline-variant/20"
                  }`}
                >
                  <div className={`text-caption font-semibold mb-1 ${isToday ? "text-primary" : "text-on-background"}`}>
                    {d.getDate()}
                  </div>
                  <div className="space-y-1">
                    {lessons.slice(0, 3).map((b) => <LessonChip key={b.id} b={b} showTime />)}
                    {lessons.length > 3 && (
                      <div className="text-[10px] text-on-surface-variant font-medium pl-1">+{lessons.length - 3} ders</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
