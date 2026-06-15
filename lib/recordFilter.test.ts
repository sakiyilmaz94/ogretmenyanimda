import { describe, it, expect } from "vitest";
import { applyRecordFilters, type FilterableRecord, type RecordFilterState } from "./recordFilter";

const base: FilterableRecord[] = [
  { date: "2026-06-01T10:00:00.000Z", subject: "MATEMATIK", paymentStatus: "PAID" },
  { date: "2026-06-10T10:00:00.000Z", subject: "TURKCE", paymentStatus: "PENDING" },
  { date: "2026-06-05T10:00:00.000Z", subject: "MATEMATIK", paymentStatus: null },
];

const defaults: RecordFilterState = { sort: "dateDesc", payment: "all", subject: "all" };

describe("applyRecordFilters", () => {
  it("tarihe göre azalan sıralar (varsayılan)", () => {
    const out = applyRecordFilters(base, defaults);
    expect(out.map((r) => r.date)).toEqual([
      "2026-06-10T10:00:00.000Z",
      "2026-06-05T10:00:00.000Z",
      "2026-06-01T10:00:00.000Z",
    ]);
  });

  it("tarihe göre artan sıralar", () => {
    const out = applyRecordFilters(base, { ...defaults, sort: "dateAsc" });
    expect(out[0].date).toBe("2026-06-01T10:00:00.000Z");
  });

  it("ödeme durumuna göre filtreler", () => {
    const out = applyRecordFilters(base, { ...defaults, payment: "PAID" });
    expect(out).toHaveLength(1);
    expect(out[0].subject).toBe("MATEMATIK");
  });

  it("branşa göre filtreler", () => {
    const out = applyRecordFilters(base, { ...defaults, subject: "MATEMATIK" });
    expect(out).toHaveLength(2);
  });

  it("filtre + sıralamayı birlikte uygular", () => {
    const out = applyRecordFilters(base, { sort: "dateAsc", payment: "all", subject: "MATEMATIK" });
    expect(out.map((r) => r.date)).toEqual([
      "2026-06-01T10:00:00.000Z",
      "2026-06-05T10:00:00.000Z",
    ]);
  });

  it("girdi dizisini mutasyona uğratmaz", () => {
    const copy = [...base];
    applyRecordFilters(base, { ...defaults, sort: "dateAsc" });
    expect(base).toEqual(copy);
  });

  it("boş dizi için boş döner", () => {
    expect(applyRecordFilters([], defaults)).toEqual([]);
  });
});
