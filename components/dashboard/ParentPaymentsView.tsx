"use client";

import { useState, useMemo } from "react";
import { formatCurrency, formatDateTime, SUBJECT_LABELS } from "@/lib/utils";
import { FilterBar, type Range, type SortKey } from "@/components/dashboard/ParentBookingsView";

export interface ParentPaymentItem {
  id: string;
  studentName: string;
  educatorName: string;
  subject: string;
  amount: number;
  installment: number;
  status: string;
  createdAt: string; // ödeme tarihi
}

const statusLabel: Record<string, string> = {
  PAID: "Ödendi",
  PENDING: "Beklemede",
  FAILED: "Başarısız",
  REFUNDED: "İade Edildi",
};
const statusBadge: Record<string, string> = {
  PAID: "bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full text-caption font-semibold",
  PENDING: "bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full text-caption font-semibold",
  FAILED: "bg-error-container text-on-error-container px-3 py-1 rounded-full text-caption font-semibold",
  REFUNDED: "bg-surface-container text-on-surface-variant px-3 py-1 rounded-full text-caption font-semibold",
};

export default function ParentPaymentsView({ payments }: { payments: ParentPaymentItem[] }) {
  const [range, setRange] = useState<Range>("all");
  const [student, setStudent] = useState("all");
  const [sort, setSort] = useState<SortKey>("dateDesc");

  const students = useMemo(
    () => Array.from(new Set(payments.map((p) => p.studentName))).sort((a, b) => a.localeCompare(b, "tr")),
    [payments]
  );

  const visible = useMemo(() => {
    const now = Date.now();
    const cutoff = range === "week" ? now - 7 * 864e5 : range === "month" ? now - 30 * 864e5 : null;
    let list = payments.filter((p) => {
      if (cutoff !== null && +new Date(p.createdAt) < cutoff) return false;
      if (student !== "all" && p.studentName !== student) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === "student") return a.studentName.localeCompare(b.studentName, "tr");
      const cmp = +new Date(a.createdAt) - +new Date(b.createdAt);
      return sort === "dateAsc" ? cmp : -cmp;
    });
    return list;
  }, [payments, range, student, sort]);

  const totalPaid = useMemo(
    () => visible.filter((p) => p.status === "PAID").reduce((s, p) => s + p.amount, 0),
    [visible]
  );

  return (
    <div className="space-y-4">
      <FilterBar
        range={range} setRange={setRange}
        student={student} setStudent={setStudent} students={students}
        sort={sort} setSort={setSort}
      />

      <div className="flex items-center justify-between">
        <p className="text-caption text-on-surface-variant">{visible.length} ödeme gösteriliyor</p>
        <div className="bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full text-label-md font-semibold">
          Görünen toplam (ödenen): {formatCurrency(totalPaid)}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="bg-surface-container rounded-md p-10 text-center soft-card-static">
          <p className="text-body-md text-on-surface-variant">Seçilen filtrelere uygun ödeme yok.</p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-md soft-card-static border border-outline-variant/20 overflow-x-auto">
          <table className="w-full text-body-md min-w-[760px]">
            <thead className="bg-surface-container text-on-surface-variant">
              <tr>
                <th className="text-left px-4 py-3 text-label-md font-semibold">Öğrenci</th>
                <th className="text-left px-4 py-3 text-label-md font-semibold">Öğretmen</th>
                <th className="text-left px-4 py-3 text-label-md font-semibold">Ders</th>
                <th className="text-left px-4 py-3 text-label-md font-semibold">Tutar</th>
                <th className="text-left px-4 py-3 text-label-md font-semibold">Taksit</th>
                <th className="text-left px-4 py-3 text-label-md font-semibold">Durum</th>
                <th className="text-left px-4 py-3 text-label-md font-semibold">Tarih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {visible.map((p) => (
                <tr key={p.id} className="hover:bg-surface-container-low transition">
                  <td className="px-4 py-3 text-on-background">{p.studentName}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{p.educatorName}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{SUBJECT_LABELS[p.subject] ?? p.subject}</td>
                  <td className="px-4 py-3 font-semibold text-on-background">{formatCurrency(p.amount)}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{p.installment}x</td>
                  <td className="px-4 py-3">
                    <span className={statusBadge[p.status] ?? "bg-surface-container text-on-surface-variant px-3 py-1 rounded-full text-caption font-semibold"}>
                      {statusLabel[p.status] ?? p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-on-surface-variant text-caption">{formatDateTime(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
