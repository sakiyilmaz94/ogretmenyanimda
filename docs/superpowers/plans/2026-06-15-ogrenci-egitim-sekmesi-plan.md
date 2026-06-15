# Öğrenci-Merkezli "Eğitim" Sekmesi — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Veli ve öğretmen panellerine, her öğrencinin seviye testleri / ders geçmişi+raporları / Google Meet bağlantıları / onaylı randevularını tek yerde toplayan öğrenci-merkezli bir "Eğitim" sekmesi eklemek; ayrıca eksik liste sayfalarına sıralama/filtreleme getirmek.

**Architecture:** Server component'ler (page.tsx) Prisma ile veriyi çeker ve serileştirilebilir DTO'lara çevirip rol-agnostik istemci bileşenlerine (`StudentEducationHub`, `StudentEducationDetail`) geçer. Sıralama/filtreleme mantığı saf bir modülde (`lib/recordFilter.ts`) toplanır ve birim testlerle korunur; `RecordFilterBar` bu mantığın sunum katmanıdır. Mevcut çalışan filtreli view'lar (ParentBookingsView, EducatorBookingsView) değiştirilmez.

**Tech Stack:** Next.js 15 (App Router, server components), Prisma, TypeScript, Tailwind, Vitest (yeni — sadece saf mantık için).

**Spec:** `docs/superpowers/specs/2026-06-15-ogrenci-egitim-sekmesi-design.md`

**Yeniden kullanılan mevcut bileşenler:**
- `components/dashboard/AssessmentResultViewer.tsx` — `assessmentId` alır, sonuç modalını kendi açar.
- `components/dashboard/LessonReportViewer.tsx` — `LessonReportData` tipini export eder, rapor modalını gösterir.
- `lib/utils.ts` — `GRADE_LABELS`, `SUBJECT_LABELS`, `formatDate`, `formatCurrency`, `cn`.
- `components/layout/NavIcon.tsx` — `NavIconName` union + `PATHS` haritası.

---

## File Structure

**Yeni dosyalar:**
- `lib/recordFilter.ts` — saf sıralama/filtre fonksiyonu (`applyRecordFilters`) + tipler.
- `lib/recordFilter.test.ts` — birim testleri.
- `vitest.config.ts` — Vitest yapılandırması.
- `components/dashboard/RecordFilterBar.tsx` — sunum: sırala/ödeme/branş/durum kontrolleri.
- `components/dashboard/StudentEducationHub.tsx` — öğrenci kartı ızgarası (rol-agnostik).
- `components/dashboard/StudentEducationDetail.tsx` — tek öğrenci sekmeli detayı (rol-agnostik).
- `app/(dashboard)/parent/egitim/page.tsx` — veli Eğitim ana ekranı.
- `app/(dashboard)/parent/egitim/[studentId]/page.tsx` — veli öğrenci detayı.
- `app/(dashboard)/educator/egitim/page.tsx` — öğretmen Eğitim ana ekranı.
- `app/(dashboard)/educator/egitim/[studentId]/page.tsx` — öğretmen öğrenci detayı.

**Değişen dosyalar:**
- `components/layout/NavIcon.tsx` — `egitim` ikonu ekle.
- `app/(dashboard)/parent/layout.tsx` — nav'a Eğitim linki.
- `app/(dashboard)/educator/layout.tsx` — nav'a Eğitim linki.
- `components/dashboard/ParentPaymentsView.tsx` — sıralama/filtre ekle (eksik olan tek liste).
- `package.json` — vitest dev dependency + `test` script.

---

## Task 1: Vitest test altyapısı

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`

- [ ] **Step 1: Vitest kur**

Run: `npm install -D vitest`
Expected: `vitest` devDependencies'e eklenir.

- [ ] **Step 2: `package.json`'a test script ekle**

`scripts` objesine ekle (mevcut satırları koru):

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: `vitest.config.ts` oluştur**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
  },
});
```

- [ ] **Step 4: Boş çalıştırma doğrula**

Run: `npm test`
Expected: "No test files found" benzeri çıktı, hata kodu yok ya da test bulunamadı uyarısı (henüz test yok).

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "test: vitest altyapısı (saf mantık testleri için)"
```

---

## Task 2: Saf sıralama/filtre mantığı (`lib/recordFilter.ts`) — TDD

**Files:**
- Create: `lib/recordFilter.ts`
- Test: `lib/recordFilter.test.ts`

- [ ] **Step 1: Failing testleri yaz**

`lib/recordFilter.test.ts`:

```ts
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
```

- [ ] **Step 2: Testi çalıştır, başarısız olduğunu doğrula**

Run: `npm test`
Expected: FAIL — "Cannot find module './recordFilter'" / `applyRecordFilters is not defined`.

- [ ] **Step 3: Minimal implementasyonu yaz**

`lib/recordFilter.ts`:

```ts
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
```

- [ ] **Step 4: Testi çalıştır, geçtiğini doğrula**

Run: `npm test`
Expected: PASS — 7 test geçer.

- [ ] **Step 5: Commit**

```bash
git add lib/recordFilter.ts lib/recordFilter.test.ts
git commit -m "feat: saf kayıt sıralama/filtre mantığı + testleri"
```

---

## Task 3: `egitim` NavIcon + nav linkleri

**Files:**
- Modify: `components/layout/NavIcon.tsx`
- Modify: `app/(dashboard)/parent/layout.tsx:21-28`
- Modify: `app/(dashboard)/educator/layout.tsx:5-12`

- [ ] **Step 1: NavIcon union'a `egitim` ekle**

`components/layout/NavIcon.tsx` içindeki `NavIconName` union'ının sonuna ekle:

```ts
  | "account"
  | "egitim";
```

- [ ] **Step 2: `PATHS` haritasına `egitim` ikonu ekle (academic cap — Heroicons)**

`account` girdisinden sonra ekle:

```tsx
  egitim: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
  ),
```

- [ ] **Step 3: Veli nav'ına Eğitim linki ekle**

`app/(dashboard)/parent/layout.tsx` — `parentNav` dizisinde `bookings` linkinden sonra ekle:

```tsx
    { href: "/parent/egitim", label: "Eğitim", icon: "egitim" as const },
```

- [ ] **Step 4: Öğretmen nav'ına Eğitim linki ekle**

`app/(dashboard)/educator/layout.tsx` — `educatorNav` dizisinde `bookings` linkinden sonra ekle:

```tsx
  { href: "/educator/egitim", label: "Eğitim", icon: "egitim" as const },
```

- [ ] **Step 5: Build & lint doğrula**

Run: `npm run lint`
Expected: NavIcon ve layout hatasız.

- [ ] **Step 6: Commit**

```bash
git add components/layout/NavIcon.tsx "app/(dashboard)/parent/layout.tsx" "app/(dashboard)/educator/layout.tsx"
git commit -m "feat: Eğitim sekmesi navigasyon linkleri + ikon"
```

---

## Task 4: `RecordFilterBar` sunum bileşeni

**Files:**
- Create: `components/dashboard/RecordFilterBar.tsx`

- [ ] **Step 1: Bileşeni yaz**

`components/dashboard/RecordFilterBar.tsx`:

```tsx
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
```

- [ ] **Step 2: Lint doğrula**

Run: `npm run lint`
Expected: hatasız.

- [ ] **Step 3: Commit**

```bash
git add components/dashboard/RecordFilterBar.tsx
git commit -m "feat: yeniden kullanılabilir RecordFilterBar (sırala/branş/ödeme)"
```

---

## Task 5: `StudentEducationDetail` — tek öğrenci sekmeli detay (rol-agnostik)

**Files:**
- Create: `components/dashboard/StudentEducationDetail.tsx`

Bu bileşen üç sekme gösterir: Randevular, Seviye Testleri, Eğitim Geçmişi. DTO'lar server component'ten gelir.

- [ ] **Step 1: Bileşeni yaz**

`components/dashboard/StudentEducationDetail.tsx`:

```tsx
"use client";

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
  counterpartName: string; // veli görünümü: öğretmen adı; öğretmen görünümü: veli adı
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
}

type Tab = "appointments" | "tests" | "history";

const NEAR_PAST_MS = 2 * 3600 * 1000; // ders bitiminden sonra 2 saat Meet aktif kabul
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
}: StudentEducationDetailProps) {
  const [tab, setTab] = useState<Tab>("appointments");
  const [filter, setFilter] = useState<RecordFilterState>({ sort: "dateDesc", payment: "all", subject: "all" });

  const subjects = useMemo(() => {
    const src = tab === "appointments" ? appointments : tab === "tests" ? tests : history;
    return Array.from(new Set(src.map((r) => r.subject)));
  }, [tab, appointments, tests, history]);

  const visibleAppointments = useMemo(
    () => applyRecordFilters(appointments, filter),
    [appointments, filter]
  );
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

      {/* Sekmeler */}
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

      <RecordFilterBar
        value={filter}
        onChange={setFilter}
        subjects={subjects}
        showPayment={tab === "appointments"}
      />

      {/* Randevular */}
      {tab === "appointments" && (
        <div className="space-y-3">
          {visibleAppointments.length === 0 && <Empty label="Bu filtreyle randevu yok." />}
          {visibleAppointments.map((a) => {
            const upcoming = a.status === "CONFIRMED" && lessonStartMs(a.date, a.startTime) + NEAR_PAST_MS > now;
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
                    {upcoming && a.meetingUrl && (
                      <a
                        href={a.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-caption bg-primary text-on-primary px-3 py-1.5 rounded-full font-semibold hover:opacity-90 transition"
                      >
                        Derse Katıl
                      </a>
                    )}
                    {upcoming && !a.meetingUrl && (
                      <span className="text-caption text-on-surface-variant">Bağlantı ders saatine yakın aktifleşecek</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Seviye Testleri */}
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
              ) : (
                <span className="text-caption bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full font-medium">Bekliyor</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Eğitim Geçmişi */}
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
```

- [ ] **Step 2: `LessonReportViewer` prop imzasını doğrula**

Run: `grep -n "export default function LessonReportViewer" components/dashboard/LessonReportViewer.tsx`
Expected: Bileşenin `report` prop'u (tipi `LessonReportData`) aldığını doğrula. Eğer prop adı farklıysa (`data` vb.), Step 1'deki `<LessonReportViewer report={h.report} />` çağrısını ona göre düzelt.

- [ ] **Step 3: Lint doğrula**

Run: `npm run lint`
Expected: hatasız.

- [ ] **Step 4: Commit**

```bash
git add components/dashboard/StudentEducationDetail.tsx
git commit -m "feat: StudentEducationDetail (randevular/testler/geçmiş sekmeleri)"
```

---

## Task 6: `StudentEducationHub` — öğrenci kartı ızgarası (rol-agnostik)

**Files:**
- Create: `components/dashboard/StudentEducationHub.tsx`

- [ ] **Step 1: Bileşeni yaz**

`components/dashboard/StudentEducationHub.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatDate, GRADE_LABELS } from "@/lib/utils";

export interface StudentCard {
  id: string;
  name: string;
  gradeLevel: string;
  testCount: number;
  completedTestCount: number;
  lessonCount: number;
  nextLessonDate: string | null; // ISO
  pendingPayment: boolean;
}

interface StudentEducationHubProps {
  students: StudentCard[];
  basePath: string; // "/parent/egitim" | "/educator/egitim"
  emptyHint: string;
}

export default function StudentEducationHub({ students, basePath, emptyHint }: StudentEducationHubProps) {
  const [sort, setSort] = useState<"name" | "next">("name");

  const sorted = useMemo(() => {
    const copy = [...students];
    if (sort === "name") copy.sort((a, b) => a.name.localeCompare(b.name, "tr"));
    else
      copy.sort((a, b) => {
        const ax = a.nextLessonDate ? new Date(a.nextLessonDate).getTime() : Infinity;
        const bx = b.nextLessonDate ? new Date(b.nextLessonDate).getTime() : Infinity;
        return ax - bx;
      });
    return copy;
  }, [students, sort]);

  if (students.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-12 text-center soft-card-static">
        <p className="text-4xl mb-4">🎓</p>
        <h3 className="font-display text-headline-md text-on-background mb-2">Henüz öğrenci yok</h3>
        <p className="text-body-md text-on-surface-variant">{emptyHint}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-end">
        <select
          aria-label="Sıralama"
          className="text-label-md bg-surface-container-lowest border border-outline-variant/40 rounded-full px-3 py-1.5"
          value={sort}
          onChange={(e) => setSort(e.target.value as "name" | "next")}
        >
          <option value="name">İsme göre</option>
          <option value="next">Yaklaşan derse göre</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((s) => (
          <Link
            key={s.id}
            href={`${basePath}/${s.id}`}
            className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-5 soft-card hover:border-primary/40 transition block"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display text-title-lg text-on-background">{s.name}</p>
                <p className="text-body-sm text-on-surface-variant">{GRADE_LABELS[s.gradeLevel] ?? s.gradeLevel}</p>
              </div>
              {s.pendingPayment && (
                <span className="text-caption bg-error-container text-on-error-container px-2.5 py-1 rounded-full font-semibold">Ödeme bekliyor</span>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-caption">
              <span className="bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full">
                {s.completedTestCount}/{s.testCount} test
              </span>
              <span className="bg-surface-container px-2.5 py-1 rounded-full text-on-surface-variant">{s.lessonCount} ders</span>
              {s.nextLessonDate && (
                <span className="bg-tertiary-fixed text-on-tertiary-fixed px-2.5 py-1 rounded-full">
                  Sonraki: {formatDate(s.nextLessonDate)}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Lint doğrula**

Run: `npm run lint`
Expected: hatasız.

- [ ] **Step 3: Commit**

```bash
git add components/dashboard/StudentEducationHub.tsx
git commit -m "feat: StudentEducationHub öğrenci kartı ızgarası"
```

---

## Task 7: Veli Eğitim ana ekranı (`parent/egitim/page.tsx`)

**Files:**
- Create: `app/(dashboard)/parent/egitim/page.tsx`

- [ ] **Step 1: Sayfayı yaz**

```tsx
import { auth } from "@/auth";
import { db } from "@/lib/db";
import StudentEducationHub, { type StudentCard } from "@/components/dashboard/StudentEducationHub";

export const dynamic = "force-dynamic";

export default async function ParentEgitimPage() {
  const session = await auth();

  const parent = await db.parent.findUnique({
    where: { userId: session!.user.id },
    include: {
      students: {
        include: {
          bookings: {
            include: { slot: true, payment: true, assessment: true },
          },
        },
      },
    },
  });

  if (!parent) return null;

  const now = Date.now();

  const students: StudentCard[] = parent.students.map((s) => {
    const lessons = s.bookings.filter((b) => b.status === "CONFIRMED" || b.status === "COMPLETED");
    const tests = s.bookings.map((b) => b.assessment).filter((a): a is NonNullable<typeof a> => !!a);
    const upcoming = lessons
      .filter((b) => b.status === "CONFIRMED" && new Date(b.slot.date).getTime() >= now - 864e5)
      .map((b) => b.slot.date.getTime())
      .filter((t) => t >= now)
      .sort((a, b) => a - b);
    const pendingPayment = s.bookings.some(
      (b) => b.status === "CONFIRMED" && (b.payment?.status ?? "PENDING") !== "PAID"
    );
    return {
      id: s.id,
      name: s.name,
      gradeLevel: s.gradeLevel,
      testCount: tests.length,
      completedTestCount: tests.filter((a) => a.status === "COMPLETED").length,
      lessonCount: lessons.length,
      nextLessonDate: upcoming.length > 0 ? new Date(upcoming[0]).toISOString() : null,
      pendingPayment,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-headline-xl text-on-background">Eğitim</h1>
        <p className="text-body-md text-on-surface-variant mt-0.5">Çocuklarınızın seviye testleri, ders geçmişi ve randevuları</p>
      </div>
      <StudentEducationHub
        students={students}
        basePath="/parent/egitim"
        emptyHint="Çocuk eklediğinizde ve ders aldıkça eğitim verileri burada toplanır."
      />
    </div>
  );
}
```

- [ ] **Step 2: Build doğrula**

Run: `npm run build`
Expected: `/parent/egitim` route'u derlenir, hata yok.

- [ ] **Step 3: Commit**

```bash
git add "app/(dashboard)/parent/egitim/page.tsx"
git commit -m "feat: veli Eğitim ana ekranı"
```

---

## Task 8: Veli öğrenci detay sayfası (`parent/egitim/[studentId]/page.tsx`)

**Files:**
- Create: `app/(dashboard)/parent/egitim/[studentId]/page.tsx`

- [ ] **Step 1: Sayfayı yaz**

```tsx
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import StudentEducationDetail, {
  type AppointmentRecord,
  type TestRecord,
  type HistoryRecord,
} from "@/components/dashboard/StudentEducationDetail";
import type { LessonReportData } from "@/components/dashboard/LessonReportViewer";

export const dynamic = "force-dynamic";

export default async function ParentStudentEgitimPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const session = await auth();
  if (!session || session.user.role !== "PARENT") redirect("/login");
  const { studentId } = await params;

  const student = await db.student.findUnique({
    where: { id: studentId },
    include: {
      parent: true,
      bookings: {
        include: {
          slot: true,
          payment: true,
          assessment: true,
          lessonReport: true,
          educator: { include: { user: true } },
        },
      },
    },
  });

  if (!student || student.parent.userId !== session.user.id) notFound();

  const appointments: AppointmentRecord[] = student.bookings
    .filter((b) => b.status !== "PENDING")
    .map((b) => ({
      id: b.id,
      date: b.slot.date.toISOString(),
      startTime: b.slot.startTime,
      endTime: b.slot.endTime,
      subject: b.subject,
      status: b.status,
      paymentStatus: b.payment?.status ?? null,
      meetingUrl: b.meetingUrl,
      counterpartName: b.educator.user.name ?? "Öğretmen",
    }));

  const tests: TestRecord[] = student.bookings
    .map((b) => b.assessment)
    .filter((a): a is NonNullable<typeof a> => !!a)
    .map((a) => ({
      id: a.id,
      date: (a.completedAt ?? a.sentAt).toISOString(),
      subject: a.subject,
      status: a.status,
    }));

  const history: HistoryRecord[] = student.bookings
    .filter((b) => b.status === "COMPLETED")
    .map((b) => ({
      bookingId: b.id,
      date: b.slot.date.toISOString(),
      subject: b.subject,
      counterpartName: b.educator.user.name ?? "Öğretmen",
      report: b.lessonReport
        ? ({
            topics: b.lessonReport.topics,
            participation: b.lessonReport.participation,
            comprehension: b.lessonReport.comprehension,
            confidence: b.lessonReport.confidence,
            mastery: b.lessonReport.mastery,
            highlight: b.lessonReport.highlight,
            homework: (b.lessonReport.homework as { title: string; source?: string }[] | null) ?? null,
            parentTip: b.lessonReport.parentTip,
            createdAt: b.lessonReport.createdAt.toISOString(),
            educatorName: b.educator.user.name ?? undefined,
          } as LessonReportData)
        : null,
    }));

  return (
    <StudentEducationDetail
      studentName={student.name}
      gradeLevel={student.gradeLevel}
      appointments={appointments}
      tests={tests}
      history={history}
      canViewTestResults={true}
    />
  );
}
```

- [ ] **Step 2: `LessonReportData` alan adlarını doğrula**

Run: `grep -n "export interface LessonReportData\|export type LessonReportData" components/dashboard/LessonReportViewer.tsx`
Then: ilgili tip tanımını oku ve Step 1'deki `report` objesinin alanlarını birebir eşleştir. Fazla/eksik alan varsa düzelt. (Mevcut `ParentBookingsView.tsx:48-58` bu objeyi nasıl kurduğunu gösterir — referans al.)

- [ ] **Step 3: Build doğrula**

Run: `npm run build`
Expected: `/parent/egitim/[studentId]` derlenir.

- [ ] **Step 4: Commit**

```bash
git add "app/(dashboard)/parent/egitim/[studentId]/page.tsx"
git commit -m "feat: veli öğrenci eğitim detay sayfası"
```

---

## Task 9: Öğretmen Eğitim ana ekranı (`educator/egitim/page.tsx`)

**Files:**
- Create: `app/(dashboard)/educator/egitim/page.tsx`

Erişim kuralı: öğretmenin yalnızca `CONFIRMED`/`COMPLETED` rezervasyonu olan farklı öğrencileri.

- [ ] **Step 1: Sayfayı yaz**

```tsx
import { auth } from "@/auth";
import { db } from "@/lib/db";
import StudentEducationHub, { type StudentCard } from "@/components/dashboard/StudentEducationHub";

export const dynamic = "force-dynamic";

export default async function EducatorEgitimPage() {
  const session = await auth();
  const educator = await db.educator.findUnique({ where: { userId: session!.user.id } });
  if (!educator) return null;

  // Onaylı/tamamlanmış randevusu olan öğrenciler
  const bookings = await db.booking.findMany({
    where: { educatorId: educator.id, status: { in: ["CONFIRMED", "COMPLETED"] } },
    include: { slot: true, payment: true, assessment: true, student: true },
  });

  const now = Date.now();
  const byStudent = new Map<string, typeof bookings>();
  for (const b of bookings) {
    const list = byStudent.get(b.studentId) ?? [];
    list.push(b);
    byStudent.set(b.studentId, list);
  }

  const students: StudentCard[] = Array.from(byStudent.values()).map((list) => {
    const s = list[0].student;
    const tests = list.map((b) => b.assessment).filter((a): a is NonNullable<typeof a> => !!a);
    const upcoming = list
      .filter((b) => b.status === "CONFIRMED")
      .map((b) => b.slot.date.getTime())
      .filter((t) => t >= now)
      .sort((a, b) => a - b);
    return {
      id: s.id,
      name: s.name,
      gradeLevel: s.gradeLevel,
      testCount: tests.length,
      completedTestCount: tests.filter((a) => a.status === "COMPLETED").length,
      lessonCount: list.length,
      nextLessonDate: upcoming.length > 0 ? new Date(upcoming[0]).toISOString() : null,
      pendingPayment: false,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-headline-xl text-on-background">Eğitim</h1>
        <p className="text-body-md text-on-surface-variant mt-0.5">Öğrencilerinizin seviye testleri, ders geçmişi ve randevuları</p>
      </div>
      <StudentEducationHub
        students={students}
        basePath="/educator/egitim"
        emptyHint="Onaylanmış randevusu olan öğrenciler burada görünür."
      />
    </div>
  );
}
```

- [ ] **Step 2: Build doğrula**

Run: `npm run build`
Expected: `/educator/egitim` derlenir.

- [ ] **Step 3: Commit**

```bash
git add "app/(dashboard)/educator/egitim/page.tsx"
git commit -m "feat: öğretmen Eğitim ana ekranı (onaylı öğrenciler)"
```

---

## Task 10: Öğretmen öğrenci detay sayfası (`educator/egitim/[studentId]/page.tsx`)

**Files:**
- Create: `app/(dashboard)/educator/egitim/[studentId]/page.tsx`

Yetki: öğretmen, yalnızca kendisiyle CONFIRMED/COMPLETED randevusu olan öğrencinin verisini görür; o öğrenciye ait yalnızca **kendi** rezervasyonları listelenir.

- [ ] **Step 1: Sayfayı yaz**

```tsx
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import StudentEducationDetail, {
  type AppointmentRecord,
  type TestRecord,
  type HistoryRecord,
} from "@/components/dashboard/StudentEducationDetail";
import type { LessonReportData } from "@/components/dashboard/LessonReportViewer";

export const dynamic = "force-dynamic";

export default async function EducatorStudentEgitimPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const session = await auth();
  if (!session || session.user.role !== "EDUCATOR") redirect("/login");
  const { studentId } = await params;

  const educator = await db.educator.findUnique({ where: { userId: session.user.id } });
  if (!educator) redirect("/login");

  const student = await db.student.findUnique({
    where: { id: studentId },
    include: {
      parent: { include: { user: true } },
      bookings: {
        where: { educatorId: educator.id },
        include: { slot: true, payment: true, assessment: true, lessonReport: true },
      },
    },
  });

  // Erişim: bu öğretmenle en az bir CONFIRMED/COMPLETED randevu olmalı
  const hasApproved = student?.bookings.some((b) => b.status === "CONFIRMED" || b.status === "COMPLETED");
  if (!student || !hasApproved) notFound();

  const parentName = student.parent.user.name ?? "Veli";

  const appointments: AppointmentRecord[] = student.bookings
    .filter((b) => b.status !== "PENDING")
    .map((b) => ({
      id: b.id,
      date: b.slot.date.toISOString(),
      startTime: b.slot.startTime,
      endTime: b.slot.endTime,
      subject: b.subject,
      status: b.status,
      paymentStatus: b.payment?.status ?? null,
      meetingUrl: b.meetingUrl,
      counterpartName: parentName,
    }));

  const tests: TestRecord[] = student.bookings
    .map((b) => b.assessment)
    .filter((a): a is NonNullable<typeof a> => !!a)
    .map((a) => ({
      id: a.id,
      date: (a.completedAt ?? a.sentAt).toISOString(),
      subject: a.subject,
      status: a.status,
    }));

  const history: HistoryRecord[] = student.bookings
    .filter((b) => b.status === "COMPLETED")
    .map((b) => ({
      bookingId: b.id,
      date: b.slot.date.toISOString(),
      subject: b.subject,
      counterpartName: parentName,
      report: b.lessonReport
        ? ({
            topics: b.lessonReport.topics,
            participation: b.lessonReport.participation,
            comprehension: b.lessonReport.comprehension,
            confidence: b.lessonReport.confidence,
            mastery: b.lessonReport.mastery,
            highlight: b.lessonReport.highlight,
            homework: (b.lessonReport.homework as { title: string; source?: string }[] | null) ?? null,
            parentTip: b.lessonReport.parentTip,
            createdAt: b.lessonReport.createdAt.toISOString(),
            studentName: student.name,
          } as LessonReportData)
        : null,
    }));

  return (
    <StudentEducationDetail
      studentName={student.name}
      gradeLevel={student.gradeLevel}
      appointments={appointments}
      tests={tests}
      history={history}
      canViewTestResults={true}
    />
  );
}
```

- [ ] **Step 2: Build doğrula**

Run: `npm run build`
Expected: `/educator/egitim/[studentId]` derlenir.

- [ ] **Step 3: Commit**

```bash
git add "app/(dashboard)/educator/egitim/[studentId]/page.tsx"
git commit -m "feat: öğretmen öğrenci eğitim detay sayfası"
```

---

## Task 11: Eksik filtre — Veli Ödemelerim listesine sıralama/filtre

**Files:**
- Modify: `components/dashboard/ParentPaymentsView.tsx`

- [ ] **Step 1: Mevcut yapıyı oku**

Run: `cat components/dashboard/ParentPaymentsView.tsx`
Mevcut `ParentPaymentItem` tipini ve render yapısını anla. (`status`, `subject`, `createdAt` alanları var.)

- [ ] **Step 2: Sıralama/filtre durumu ekle**

`ParentPaymentsView` bileşeninin başına (mevcut "use client" altında) `useState`/`useMemo` importlarının olduğundan emin ol, sonra liste render'ından önce `RecordFilterBar` + `applyRecordFilters` ekle. `ParentPaymentItem`'ı filtre için uyarlayıcı bir map ile besle:

```tsx
import { useMemo, useState } from "react";
import RecordFilterBar from "@/components/dashboard/RecordFilterBar";
import { applyRecordFilters, type RecordFilterState } from "@/lib/recordFilter";
// ...
const [filter, setFilter] = useState<RecordFilterState>({ sort: "dateDesc", payment: "all", subject: "all" });
const subjects = useMemo(() => Array.from(new Set(payments.map((p) => p.subject))), [payments]);
const visible = useMemo(
  () =>
    applyRecordFilters(
      payments.map((p) => ({ ...p, date: p.createdAt, paymentStatus: p.status })),
      filter
    ),
  [payments, filter]
);
```

Render başına `<RecordFilterBar value={filter} onChange={setFilter} subjects={subjects} />` ekle ve liste `.map` çağrısını `payments` yerine `visible` üzerinden yap.

- [ ] **Step 3: Lint + build doğrula**

Run: `npm run lint && npm run build`
Expected: hatasız.

- [ ] **Step 4: Commit**

```bash
git add components/dashboard/ParentPaymentsView.tsx
git commit -m "feat: Ödemelerim listesine sıralama/filtre (RecordFilterBar)"
```

---

## Task 12: Bütünsel doğrulama

**Files:** (yok — doğrulama)

- [ ] **Step 1: Tüm testler**

Run: `npm test`
Expected: recordFilter testleri PASS.

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: hata yok.

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: 4 yeni route (`/parent/egitim`, `/parent/egitim/[studentId]`, `/educator/egitim`, `/educator/egitim/[studentId]`) listelenir, hata yok.

- [ ] **Step 4: Manuel duman testi (`npm run dev`)**

Doğrula:
1. Veli ile giriş → sol menüde "Eğitim" görünür → tıkla → öğrenci kartları gelir.
2. Bir öğrenci kartına tıkla → 3 sekme (Randevular/Testler/Geçmiş) çalışır; filtre çubuğu sıralama/branş/ödeme uygular.
3. Yaklaşan onaylı + Meet linki olan derste "Derse Katıl" butonu görünür.
4. Tamamlanmış seviye testi olan öğrencide "📊 Seviye testi tamamlandı" açılır.
5. Öğretmen ile giriş → "Eğitim" → yalnızca onaylı/tamamlanmış randevusu olan öğrenciler görünür; detayda test sonuçları görünür.
6. Veli, başka bir velinin `studentId`'sine URL ile gitmeye çalışınca 404.

- [ ] **Step 5: Son commit (gerekiyorsa) ve özet**

Eğer doğrulama sırasında düzeltme yapıldıysa commit'le. Aksi halde dal hazır.

---

## Self-Review Notları

- **Spec kapsamı:** Navigasyon (Task 3), erişim kuralı (Task 9/10), öğrenci kartları (Task 6/7/9), detay 3 bölüm (Task 5/8/10), test erişimi öğretmende açık (`canViewTestResults={true}`, Task 10), sıralama/filtre (Task 2/4 + mevcut view'lar + Task 11 ödemeler) — hepsi kapsanıyor.
- **Şema değişikliği yok** — doğrulandı.
- **Tip tutarlılığı:** `RecordFilterState`, `FilterableRecord` (Task 2) → `RecordFilterBar` (Task 4) → detay/ödeme view'ları aynı tipi kullanır. `AppointmentRecord`/`TestRecord`/`HistoryRecord` Task 5'te tanımlanır, Task 8/10'da birebir kullanılır.
- **Doğrulanacak dış bağımlılık:** `LessonReportViewer`'ın prop adı ve `LessonReportData` alanları (Task 5 Step 2, Task 8 Step 2) — mevcut `ParentBookingsView.tsx` referans alınarak eşleştirilecek.
- **Mevcut çalışan filtreler korunur** — ParentBookingsView/EducatorBookingsView'a dokunulmaz (zaten filtre/sıralamaya sahip).
