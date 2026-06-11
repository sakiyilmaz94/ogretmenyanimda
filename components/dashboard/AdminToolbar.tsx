"use client";

import type { ReactNode } from "react";

export type DateRange = "all" | "15d" | "1m" | "3m";

const RANGES: { v: DateRange; label: string }[] = [
  { v: "all", label: "Tümü" },
  { v: "15d", label: "Son 15 gün" },
  { v: "1m", label: "Son 1 ay" },
  { v: "3m", label: "Son 3 ay" },
];

// Tarih aralığı için kesim tarihi (bundan öncesini ele). all → null.
export function rangeCutoff(range: DateRange): number | null {
  const now = Date.now();
  if (range === "15d") return now - 15 * 864e5;
  if (range === "1m") return now - 30 * 864e5;
  if (range === "3m") return now - 90 * 864e5;
  return null;
}

// Ortak select (etiket + seçenekler)
export function AdminSelect({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <label className="flex items-center gap-2 text-label-md text-on-surface-variant">
      {label}:
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="bg-surface-container rounded-lg px-3 py-1.5 text-on-background text-label-md focus:outline-none focus:ring-2 focus:ring-primary/40">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

export default function AdminToolbar({
  search, onSearch, searchPlaceholder = "Ara…",
  range, onRange, resultCount, children,
}: {
  search?: string;
  onSearch?: (v: string) => void;
  searchPlaceholder?: string;
  range?: DateRange;
  onRange?: (r: DateRange) => void;
  resultCount?: number;
  children?: ReactNode;
}) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-4 soft-card-static space-y-3">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        {onSearch && (
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <svg className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder={searchPlaceholder}
              className="w-full bg-surface-container rounded-full pl-9 pr-4 py-2.5 text-on-background text-label-md focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
        )}
        {children}
      </div>

      {onRange && range !== undefined && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-label-md text-on-surface-variant mr-1">Dönem:</span>
          {RANGES.map((r) => (
            <button key={r.v} onClick={() => onRange(r.v)}
              className={`px-3 py-1.5 rounded-full text-caption font-semibold transition ${
                range === r.v ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}>
              {r.label}
            </button>
          ))}
          {resultCount !== undefined && (
            <span className="ml-auto text-caption text-on-surface-variant">{resultCount} kayıt</span>
          )}
        </div>
      )}
    </div>
  );
}
