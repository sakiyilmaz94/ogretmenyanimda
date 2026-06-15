"use client";

import { SUBJECT_LABELS } from "@/lib/utils";
import type { RecordFilterState } from "@/lib/recordFilter";

interface RecordFilterBarProps {
  value: RecordFilterState;
  onChange: (next: RecordFilterState) => void;
  subjects: string[]; // mevcut branş kodları (örn. ["MATEMATIK","TURKCE"])
  showPayment?: boolean; // ödeme durumu filtresini göster
}

const selectCls =
  "text-label-md bg-surface-container-lowest border border-outline-variant/40 rounded-full px-3 py-1.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30";

export default function RecordFilterBar({ value, onChange, subjects, showPayment = true }: RecordFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        aria-label="Sıralama"
        className={selectCls}
        value={value.sort}
        onChange={(e) => onChange({ ...value, sort: e.target.value as RecordFilterState["sort"] })}
      >
        <option value="dateDesc">En yeni</option>
        <option value="dateAsc">En eski</option>
      </select>

      {subjects.length > 0 && (
        <select
          aria-label="Branş"
          className={selectCls}
          value={value.subject}
          onChange={(e) => onChange({ ...value, subject: e.target.value })}
        >
          <option value="all">Tüm branşlar</option>
          {subjects.map((s) => (
            <option key={s} value={s}>
              {SUBJECT_LABELS[s] ?? s}
            </option>
          ))}
        </select>
      )}

      {showPayment && (
        <select
          aria-label="Ödeme durumu"
          className={selectCls}
          value={value.payment}
          onChange={(e) => onChange({ ...value, payment: e.target.value as RecordFilterState["payment"] })}
        >
          <option value="all">Tüm ödemeler</option>
          <option value="PAID">Ödendi</option>
          <option value="PENDING">Bekliyor</option>
          <option value="CANCELLED">İptal</option>
        </select>
      )}
    </div>
  );
}
