export type RecordSort = "dateDesc" | "dateAsc";

export interface RecordFilterState {
  sort: RecordSort;
  payment: "all" | "PAID" | "PENDING" | "CANCELLED";
  subject: "all" | string;
}

export interface FilterableRecord {
  date: string; // ISO tarih
  subject?: string;
  paymentStatus?: string | null;
}

export function applyRecordFilters<T extends FilterableRecord>(
  items: T[],
  f: RecordFilterState
): T[] {
  let out = items;
  if (f.payment !== "all") {
    out = out.filter((r) => r.paymentStatus === f.payment);
  }
  if (f.subject !== "all") {
    out = out.filter((r) => r.subject === f.subject);
  }
  out = [...out].sort((a, b) => {
    const da = new Date(a.date).getTime();
    const db = new Date(b.date).getTime();
    return f.sort === "dateAsc" ? da - db : db - da;
  });
  return out;
}
