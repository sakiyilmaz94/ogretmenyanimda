"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatCurrency, SUBJECT_LABELS } from "@/lib/utils";

export interface AdminEducatorRow {
  id: string;
  name: string;
  email: string;
  subjects: string[];
  hourlyRate: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

const STATUS = {
  APPROVED: { label: "Onaylı", cls: "bg-secondary-container text-on-secondary-container" },
  PENDING: { label: "Beklemede", cls: "bg-tertiary-fixed text-on-tertiary-fixed" },
  REJECTED: { label: "Reddedildi", cls: "bg-error-container text-on-error-container" },
};

type Filter = "all" | "APPROVED" | "PENDING" | "REJECTED";

export default function AdminEducatorsList({ educators }: { educators: AdminEducatorRow[] }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(() => ({
    all: educators.length,
    APPROVED: educators.filter((e) => e.status === "APPROVED").length,
    PENDING: educators.filter((e) => e.status === "PENDING").length,
    REJECTED: educators.filter((e) => e.status === "REJECTED").length,
  }), [educators]);

  const visible = useMemo(() => {
    const term = q.trim().toLocaleLowerCase("tr");
    return educators.filter((e) => {
      if (filter !== "all" && e.status !== filter) return false;
      if (term && !(`${e.name} ${e.email}`.toLocaleLowerCase("tr").includes(term))) return false;
      return true;
    });
  }, [educators, q, filter]);

  const chips: { key: Filter; label: string; n: number }[] = [
    { key: "all", label: "Tümü", n: counts.all },
    { key: "PENDING", label: "Onay Bekleyen", n: counts.PENDING },
    { key: "APPROVED", label: "Onaylı", n: counts.APPROVED },
    { key: "REJECTED", label: "Reddedildi", n: counts.REJECTED },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <svg className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="İsim veya e-posta ara…"
            className="w-full bg-surface-container rounded-full pl-9 pr-4 py-2.5 text-on-background text-label-md focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
        <div className="flex flex-wrap gap-2">
          {chips.map((c) => (
            <button key={c.key} onClick={() => setFilter(c.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-caption font-semibold transition ${
                filter === c.key ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}>
              {c.label}
              <span className={`min-w-[18px] px-1 rounded-full text-[11px] font-bold ${filter === c.key ? "bg-on-primary text-primary" : "bg-surface-container-high text-on-surface-variant"}`}>{c.n}</span>
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-md p-10 text-center soft-card-static border border-outline-variant/20">
          <p className="text-body-md text-on-surface-variant">Eşleşen öğretmen yok.</p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-md soft-card-static border border-outline-variant/20 overflow-x-auto">
          <table className="w-full text-body-md min-w-[680px]">
            <thead className="bg-surface-container text-on-surface-variant">
              <tr>
                <th className="text-left px-5 py-3 text-label-md font-semibold">Öğretmen</th>
                <th className="text-left px-5 py-3 text-label-md font-semibold">Branşlar</th>
                <th className="text-left px-5 py-3 text-label-md font-semibold">Saatlik Ücret</th>
                <th className="text-left px-5 py-3 text-label-md font-semibold">Durum</th>
                <th className="text-left px-5 py-3 text-label-md font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {visible.map((e) => (
                <tr key={e.id} className="hover:bg-surface-container-low transition">
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-on-background">{e.name}</p>
                    <p className="text-caption text-on-surface-variant">{e.email}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {e.subjects.slice(0, 3).map((s) => (
                        <span key={s} className="text-[11px] bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded-full">{SUBJECT_LABELS[s] ?? s}</span>
                      ))}
                      {e.subjects.length > 3 && <span className="text-[11px] text-on-surface-variant">+{e.subjects.length - 3}</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-primary">{formatCurrency(e.hourlyRate)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-caption px-3 py-1 rounded-full font-semibold ${STATUS[e.status].cls}`}>{STATUS[e.status].label}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link href={`/admin/educators/${e.id}`} className="text-caption text-primary font-semibold hover:underline whitespace-nowrap">
                      Detay / Düzenle →
                    </Link>
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
