"use client";

import { useState, useMemo } from "react";
import { formatCurrency, formatDate, SUBJECT_LABELS } from "@/lib/utils";
import AdminToolbar, { AdminSelect, rangeCutoff, type DateRange } from "@/components/dashboard/AdminToolbar";

export interface AdminBookingItem {
  id: string;
  studentName: string;
  educatorName: string;
  subject: string;
  date: string;
  startTime: string;
  totalPrice: number;
  paymentStatus: string | null;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
}

const statusLabel: Record<string, string> = { PENDING: "Beklemede", CONFIRMED: "Onaylandı", CANCELLED: "İptal", COMPLETED: "Tamamlandı" };
const statusColor: Record<string, string> = {
  PENDING: "bg-tertiary-fixed text-on-tertiary-fixed",
  CONFIRMED: "bg-secondary-container text-on-secondary-container",
  CANCELLED: "bg-error-container text-on-error-container",
  COMPLETED: "bg-surface-container text-on-surface-variant",
};

export default function AdminBookingsView({ bookings, showTeacher = true }: { bookings: AdminBookingItem[]; showTeacher?: boolean }) {
  const [q, setQ] = useState("");
  const [range, setRange] = useState<DateRange>("all");
  const [status, setStatus] = useState("all");
  const [teacher, setTeacher] = useState("all");
  const [student, setStudent] = useState("all");

  const teachers = useMemo(() => Array.from(new Set(bookings.map((b) => b.educatorName))).sort((a, b) => a.localeCompare(b, "tr")), [bookings]);
  const students = useMemo(() => Array.from(new Set(bookings.map((b) => b.studentName))).sort((a, b) => a.localeCompare(b, "tr")), [bookings]);

  const visible = useMemo(() => {
    const cutoff = rangeCutoff(range);
    const term = q.trim().toLocaleLowerCase("tr");
    return bookings.filter((b) => {
      if (cutoff !== null && +new Date(b.date) < cutoff) return false;
      if (status !== "all" && b.status !== status) return false;
      if (teacher !== "all" && b.educatorName !== teacher) return false;
      if (student !== "all" && b.studentName !== student) return false;
      if (term && !`${b.studentName} ${b.educatorName}`.toLocaleLowerCase("tr").includes(term)) return false;
      return true;
    }).sort((a, b) => (a.date + a.startTime > b.date + b.startTime ? -1 : 1));
  }, [bookings, range, status, teacher, student, q]);

  return (
    <div className="space-y-4">
      <AdminToolbar search={q} onSearch={setQ} searchPlaceholder="Öğrenci veya öğretmen ara…" range={range} onRange={setRange} resultCount={visible.length}>
        <AdminSelect label="Durum" value={status} onChange={setStatus} options={[
          { value: "all", label: "Tümü" }, { value: "PENDING", label: "Beklemede" }, { value: "CONFIRMED", label: "Onaylandı" },
          { value: "COMPLETED", label: "Tamamlandı" }, { value: "CANCELLED", label: "İptal" },
        ]} />
        <AdminSelect label="Öğrenci" value={student} onChange={setStudent} options={[{ value: "all", label: "Tümü" }, ...students.map((s) => ({ value: s, label: s }))]} />
        {showTeacher && <AdminSelect label="Öğretmen" value={teacher} onChange={setTeacher} options={[{ value: "all", label: "Tümü" }, ...teachers.map((t) => ({ value: t, label: t }))]} />}
      </AdminToolbar>

      <div className="bg-surface-container-lowest rounded-md soft-card-static overflow-x-auto border border-outline-variant/20">
        <table className="w-full text-body-md min-w-[760px]">
          <thead className="bg-surface-container text-on-surface-variant">
            <tr>
              <th className="text-left px-5 py-3 text-label-md font-semibold">Öğrenci</th>
              <th className="text-left px-5 py-3 text-label-md font-semibold">Öğretmen / Ders</th>
              <th className="text-left px-5 py-3 text-label-md font-semibold">Tarih</th>
              <th className="text-left px-5 py-3 text-label-md font-semibold">Ücret</th>
              <th className="text-left px-5 py-3 text-label-md font-semibold">Ödeme</th>
              <th className="text-left px-5 py-3 text-label-md font-semibold">Durum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {visible.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-on-surface-variant text-label-md">Eşleşen rezervasyon yok.</td></tr>
            ) : visible.map((b) => (
              <tr key={b.id} className="hover:bg-surface-container-low transition">
                <td className="px-5 py-3 font-medium text-on-background">{b.studentName}</td>
                <td className="px-5 py-3">
                  <p className="text-on-background">{b.educatorName}</p>
                  <p className="text-caption text-on-surface-variant">{SUBJECT_LABELS[b.subject] ?? b.subject}</p>
                </td>
                <td className="px-5 py-3 text-on-surface-variant text-caption">{formatDate(b.date)} · {b.startTime}</td>
                <td className="px-5 py-3 font-semibold text-on-background">{formatCurrency(b.totalPrice)}</td>
                <td className="px-5 py-3">
                  {b.paymentStatus ? (
                    <span className={`text-caption px-3 py-1 rounded-full font-semibold ${b.paymentStatus === "PAID" ? "bg-secondary-container text-on-secondary-container" : "bg-tertiary-fixed text-on-tertiary-fixed"}`}>
                      {b.paymentStatus === "PAID" ? "Ödendi" : "Beklemede"}
                    </span>
                  ) : <span className="text-caption text-on-surface-variant">—</span>}
                </td>
                <td className="px-5 py-3">
                  <span className={`text-caption px-3 py-1 rounded-full font-semibold ${statusColor[b.status] ?? "bg-surface-container text-on-surface-variant"}`}>{statusLabel[b.status] ?? b.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
