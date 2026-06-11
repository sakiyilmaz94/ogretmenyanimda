"use client";

import { useState, useMemo } from "react";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import AdminToolbar, { AdminSelect, rangeCutoff, type DateRange } from "@/components/dashboard/AdminToolbar";
import PrintButton from "@/components/dashboard/PrintButton";

export interface AdminPaymentItem {
  id: string;
  studentName: string;
  educatorName: string;
  amount: number;
  status: "PAID" | "PENDING" | "FAILED" | "REFUNDED";
  createdAt: string;
}

const statusLabel: Record<string, string> = { PAID: "Ödendi", PENDING: "Beklemede", FAILED: "Başarısız", REFUNDED: "İade Edildi" };
const statusColor: Record<string, string> = {
  PAID: "bg-secondary-container text-on-secondary-container",
  PENDING: "bg-tertiary-fixed text-on-tertiary-fixed",
  FAILED: "bg-error-container text-on-error-container",
  REFUNDED: "bg-surface-container text-on-surface-variant",
};

export default function AdminPaymentsView({ payments, commissionRate }: { payments: AdminPaymentItem[]; commissionRate: number }) {
  const [q, setQ] = useState("");
  const [range, setRange] = useState<DateRange>("all");
  const [status, setStatus] = useState("all");
  const [teacher, setTeacher] = useState("all");

  const teachers = useMemo(
    () => Array.from(new Set(payments.map((p) => p.educatorName))).sort((a, b) => a.localeCompare(b, "tr")),
    [payments]
  );

  const visible = useMemo(() => {
    const cutoff = rangeCutoff(range);
    const term = q.trim().toLocaleLowerCase("tr");
    return payments.filter((p) => {
      if (cutoff !== null && +new Date(p.createdAt) < cutoff) return false;
      if (status !== "all" && p.status !== status) return false;
      if (teacher !== "all" && p.educatorName !== teacher) return false;
      if (term && !`${p.studentName} ${p.educatorName}`.toLocaleLowerCase("tr").includes(term)) return false;
      return true;
    });
  }, [payments, range, status, teacher, q]);

  // Özet: yalnızca ÖDENEN (PAID) kayıtlar kazanç sayılır
  const paid = visible.filter((p) => p.status === "PAID");
  const grossPaid = paid.reduce((s, p) => s + p.amount, 0);
  const ourIncome = Math.round(grossPaid * (commissionRate / 100) * 100) / 100;
  const teacherPayout = Math.round((grossPaid - ourIncome) * 100) / 100;
  const pendingGross = visible.filter((p) => p.status === "PENDING").reduce((s, p) => s + p.amount, 0);

  const cards = [
    { label: "Tahsil Edilen (brüt)", value: formatCurrency(grossPaid), cls: "text-on-background" },
    { label: `Bizim Gelirimiz (%${commissionRate})`, value: formatCurrency(ourIncome), cls: "text-primary", hi: true },
    { label: "Öğretmene Ödenecek", value: formatCurrency(teacherPayout), cls: "text-on-secondary-container" },
    { label: "Bekleyen Tahsilat", value: formatCurrency(pendingGross), cls: "text-on-tertiary-fixed" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-headline-md text-on-background">Ödeme & Gelir Yönetimi</h1>
          <p className="text-label-md text-on-surface-variant mt-0.5">
            Filtreleyin; her dersten bize kalan komisyon (%{commissionRate}) ve öğretmene ödenecek tutar aşağıda.
          </p>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <PrintButton type="odemeler" range={range} label="Ödeme Dökümü PDF" />
          <PrintButton type="finans" range={range} label="Finans Raporu PDF" />
        </div>
      </div>

      {/* Özet kartlar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.label} className={`bg-surface-container-lowest rounded-2xl p-5 soft-card-static border ${c.hi ? "border-primary/30" : "border-outline-variant/20"}`}>
            <p className="text-caption text-on-surface-variant mb-1">{c.label}</p>
            <p className={`font-display text-headline-md font-bold ${c.cls}`}>{c.value}</p>
          </div>
        ))}
      </div>

      <AdminToolbar
        search={q} onSearch={setQ} searchPlaceholder="Öğrenci veya öğretmen ara…"
        range={range} onRange={setRange} resultCount={visible.length}
      >
        <AdminSelect label="Durum" value={status} onChange={setStatus} options={[
          { value: "all", label: "Tümü" }, { value: "PAID", label: "Ödendi" }, { value: "PENDING", label: "Beklemede" },
          { value: "FAILED", label: "Başarısız" }, { value: "REFUNDED", label: "İade" },
        ]} />
        <AdminSelect label="Öğretmen" value={teacher} onChange={setTeacher} options={[
          { value: "all", label: "Tümü" }, ...teachers.map((t) => ({ value: t, label: t })),
        ]} />
      </AdminToolbar>

      <div className="bg-surface-container-lowest rounded-md soft-card-static overflow-x-auto border border-outline-variant/20">
        <table className="w-full text-body-md min-w-[820px]">
          <thead className="bg-surface-container text-on-surface-variant">
            <tr>
              <th className="text-left px-5 py-3 text-label-md font-semibold">Tarih</th>
              <th className="text-left px-5 py-3 text-label-md font-semibold">Öğrenci</th>
              <th className="text-left px-5 py-3 text-label-md font-semibold">Öğretmen</th>
              <th className="text-right px-5 py-3 text-label-md font-semibold">Tutar (brüt)</th>
              <th className="text-right px-5 py-3 text-label-md font-semibold">Bizim (%{commissionRate})</th>
              <th className="text-right px-5 py-3 text-label-md font-semibold">Öğretmene</th>
              <th className="text-left px-5 py-3 text-label-md font-semibold">Durum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {visible.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-on-surface-variant text-label-md">Eşleşen ödeme yok.</td></tr>
            ) : visible.map((p) => {
              const com = Math.round(p.amount * (commissionRate / 100) * 100) / 100;
              const dim = p.status !== "PAID";
              return (
                <tr key={p.id} className="hover:bg-surface-container-low transition">
                  <td className="px-5 py-3 text-on-surface-variant text-caption">{formatDateTime(p.createdAt)}</td>
                  <td className="px-5 py-3 text-on-background font-medium">{p.studentName}</td>
                  <td className="px-5 py-3 text-on-surface-variant">{p.educatorName}</td>
                  <td className="px-5 py-3 text-right font-semibold text-on-background">{formatCurrency(p.amount)}</td>
                  <td className={`px-5 py-3 text-right font-bold ${dim ? "text-on-surface-variant/50" : "text-primary"}`}>{formatCurrency(com)}</td>
                  <td className={`px-5 py-3 text-right ${dim ? "text-on-surface-variant/50" : "text-on-secondary-container font-semibold"}`}>{formatCurrency(p.amount - com)}</td>
                  <td className="px-5 py-3">
                    <span className={`text-caption px-3 py-1 rounded-full font-semibold ${statusColor[p.status]}`}>{statusLabel[p.status] ?? p.status}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-caption text-on-surface-variant">
        Not: &quot;Bizim&quot; ve &quot;Öğretmene&quot; sütunları yalnızca <strong>ödenen</strong> derslerde kazanç sayılır; bekleyen/başarısız satırlar soluk gösterilir.
      </p>
    </div>
  );
}
