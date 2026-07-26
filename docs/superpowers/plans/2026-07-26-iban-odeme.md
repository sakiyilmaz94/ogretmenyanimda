# IBAN / Havale ile Ödeme — Implementasyon Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** iyzico'yu inaktif tutup yerine IBAN/havale tabanlı, referans kodu eşleştirmeli, admin onaylı ödeme akışı kurmak.

**Architecture:** Veli sadece IBAN talimat ekranını görür, havale yapıp "Ödemeyi Bildirdim" der (`Payment.declaredAt` set edilir, 24s sayaç durur). Admin banka ekstresinden referans kodunu eşleştirip onaylar (PAID). Sağlayıcı `AppSetting.payment_provider` ile seçilir; varsayılan `"iban"`, iyzico kodu silinmez.

**Tech Stack:** Next.js 15 (App Router), Prisma + Supabase Postgres, NextAuth v5, vitest.

**Spec:** [docs/superpowers/specs/2026-07-26-iban-odeme-design.md](../specs/2026-07-26-iban-odeme-design.md)

---

## Dosya Yapısı

- **Modify** `prisma/schema.prisma` — `Payment`'e `referenceCode`, `declaredAt`
- **Create** `lib/payment-config.ts` — sağlayıcı + banka bilgisi erişimi + saf `resolveProvider`, `generateReferenceCode`
- **Create** `lib/payment-config.test.ts` — saf fonksiyon birim testleri
- **Modify** `app/api/bookings/[bookingId]/status/route.ts` — onayda referans kodu üret; `payment_complete` → `declare_payment`
- **Modify** `app/api/cron/payment-window/route.ts` — filtrelere `declaredAt: null` ekle
- **Create** `app/api/admin/payments/[id]/route.ts` — admin onayla/reddet
- **Modify** `components/dashboard/PaymentPage.tsx` — IBAN talimat ekranı + "Ödemeyi Bildirdim"
- **Modify** `components/dashboard/AdminPaymentsView.tsx` + `app/(dashboard)/admin/payments/page.tsx` — onay bekleyenler + butonlar
- **Modify** `app/api/admin/settings/route.ts` + admin ayarlar sayfası — IBAN alanları
- **Modify** `app/api/payments/checkout/route.ts`, `app/api/payments/callback/route.ts` — provider `iban` iken 409

---

## Task 1: Payment şemasına alanlar

**Files:**
- Modify: `prisma/schema.prisma` (model Payment)

- [ ] **Step 1: Alanları ekle**

`model Payment` içine ekle:
```prisma
  referenceCode   String?       @unique
  declaredAt      DateTime?
```

- [ ] **Step 2: Şemayı DB'ye uygula**

Run: `npm run db:push`
Expected: "Your database is now in sync with your Prisma schema." + `prisma generate` başarılı.

- [ ] **Step 3: Commit**

```bash
git add prisma/schema.prisma
git commit -m "Payment'e referenceCode ve declaredAt alanları"
```

---

## Task 2: Ödeme sağlayıcı + referans kodu yardımcıları (TDD)

**Files:**
- Create: `lib/payment-config.ts`
- Test: `lib/payment-config.test.ts`

- [ ] **Step 1: Failing test yaz**

`lib/payment-config.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { resolveProvider, generateReferenceCode } from "./payment-config";

describe("resolveProvider", () => {
  it("değer yoksa iban döner (varsayılan)", () => {
    expect(resolveProvider(null)).toBe("iban");
    expect(resolveProvider(undefined)).toBe("iban");
    expect(resolveProvider("")).toBe("iban");
  });
  it("iyzico değerini tanır", () => {
    expect(resolveProvider("iyzico")).toBe("iyzico");
  });
  it("bilinmeyen değeri iban'a düşürür", () => {
    expect(resolveProvider("paypal")).toBe("iban");
  });
});

describe("generateReferenceCode", () => {
  it("ÖY- ile başlar ve 4 karakterlik kod içerir", () => {
    expect(generateReferenceCode()).toMatch(/^ÖY-[A-Z0-9]{4}$/);
  });
  it("karışık karakter (0/O/I/1) kullanmaz", () => {
    for (let i = 0; i < 50; i++) {
      expect(generateReferenceCode()).not.toMatch(/[O0I1]/);
    }
  });
});
```

- [ ] **Step 2: Test'in fail ettiğini doğrula**

Run: `npm test -- payment-config`
Expected: FAIL — "Cannot find module './payment-config'".

- [ ] **Step 3: Minimal implementasyon**

`lib/payment-config.ts`:
```ts
import { db } from "@/lib/db";

export type PaymentProvider = "iban" | "iyzico";

// Saf: string değerini geçerli bir sağlayıcıya çevirir. Varsayılan "iban".
export function resolveProvider(value: string | null | undefined): PaymentProvider {
  return value === "iyzico" ? "iyzico" : "iban";
}

// Saf: benzersiz referans kodu üretir (karışan karakterler hariç). Örn. "ÖY-A3F9".
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 0,O,1,I yok
export function generateReferenceCode(): string {
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return `ÖY-${code}`;
}

// DB: aktif sağlayıcıyı okur (AppSetting.payment_provider). Varsayılan "iban".
export async function getPaymentProvider(): Promise<PaymentProvider> {
  const s = await db.appSetting.findUnique({ where: { key: "payment_provider" } });
  return resolveProvider(s?.value);
}

export interface BankInfo {
  iban: string;
  accountName: string;
  bankName: string;
}

// DB: IBAN bilgisini okur. Tanımlı değilse boş string'ler döner.
export async function getBankInfo(): Promise<BankInfo> {
  const rows = await db.appSetting.findMany({
    where: { key: { in: ["bank_iban", "bank_account_name", "bank_name"] } },
  });
  const m = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return {
    iban: m.bank_iban ?? "",
    accountName: m.bank_account_name ?? "",
    bankName: m.bank_name ?? "",
  };
}

// DB: IBAN bilgisini yazar (upsert).
export async function setBankInfo(info: BankInfo): Promise<void> {
  const entries: [string, string][] = [
    ["bank_iban", info.iban],
    ["bank_account_name", info.accountName],
    ["bank_name", info.bankName],
  ];
  await Promise.all(
    entries.map(([key, value]) =>
      db.appSetting.upsert({ where: { key }, update: { value }, create: { key, value } })
    )
  );
}

// DB: benzersiz referans kodu üretir (çakışma kontrollü).
export async function generateUniqueReferenceCode(): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const code = generateReferenceCode();
    const exists = await db.payment.findUnique({ where: { referenceCode: code } });
    if (!exists) return code;
  }
  return `ÖY-${Date.now().toString(36).toUpperCase().slice(-6)}`; // güvenlik ağı
}
```

- [ ] **Step 4: Test'in geçtiğini doğrula**

Run: `npm test -- payment-config`
Expected: PASS (5 test).

- [ ] **Step 5: Commit**

```bash
git add lib/payment-config.ts lib/payment-config.test.ts
git commit -m "Ödeme sağlayıcı + referans kodu yardımcıları (TDD)"
```

---

## Task 3: Booking onayında referans kodu + payment_complete → declare_payment

**Files:**
- Modify: `app/api/bookings/[bookingId]/status/route.ts`

- [ ] **Step 1: Referans kodu importu ekle**

Dosyanın başındaki importlara ekle:
```ts
import { generateUniqueReferenceCode } from "@/lib/payment-config";
```

- [ ] **Step 2: Onayda (approve) Payment'i referans koduyla oluştur**

`approve` dalındaki mevcut `db.payment.upsert` çağrısını şununla değiştir:
```ts
      const referenceCode = await generateUniqueReferenceCode();
      await db.payment.upsert({
        where: { bookingId },
        update: {},
        create: {
          bookingId,
          amount: booking.totalPrice,
          currency: "TRY",
          status: "PENDING",
          referenceCode,
        },
      });
```

- [ ] **Step 3: Güvenlik açığı olan `payment_complete` bloğunu `declare_payment` ile değiştir**

PARENT dalındaki `if (action !== "payment_complete")` ... `db.booking.update(... COMPLETED)` bloğunu (ödeme e-postaları dahil) şununla değiştir:
```ts
    if (action !== "declare_payment") {
      return NextResponse.json({ error: "Geçersiz işlem" }, { status: 400 });
    }
    if (booking.status !== "CONFIRMED") {
      return NextResponse.json({ error: "Ödeme bildirimi için önce öğretmen onayı gerekli." }, { status: 400 });
    }
    // PAID YAPMAZ — sadece velinin havale yaptığını işaretler; onayı admin verir.
    await db.payment.update({
      where: { bookingId },
      data: { declaredAt: new Date() },
    });
    await notify({
      userId: booking.educator.userId,
      title: "Ödeme Bildirildi — Onay Bekliyor",
      message: `${booking.student.name} için veli havale bildirimi yaptı. Yönetici onayı bekleniyor.`,
      link: "/educator/bookings",
    });
    return NextResponse.json({ success: true });
```

> Not: Admin'e ayrıca bildirim; admin'ler tek kullanıcı olduğundan bu sürümde öğretmen bildirimi + admin panelindeki liste yeterli. (İleride admin userId'lerine notify eklenebilir.)

- [ ] **Step 4: Lint + build kontrolü**

Run: `npm run lint`
Expected: Bu dosyada hata yok.

- [ ] **Step 5: Manuel doğrulama (verify skill)**

Dev sunucuda: öğretmenle bir randevuyu onayla → DB'de ilgili Payment'te `referenceCode` dolu, `status=PENDING`. Veli olarak `declare_payment` POST et → `declaredAt` dolar, `status` hâlâ PENDING (PAID OLMAZ). Farklı veli ile 403 alındığını doğrula.

- [ ] **Step 6: Commit**

```bash
git add app/api/bookings/[bookingId]/status/route.ts
git commit -m "Onayda referans kodu üret; payment_complete açığını declare_payment ile değiştir"
```

---

## Task 4: Cron — bildirilmiş ödemeleri iptal etme

**Files:**
- Modify: `app/api/cron/payment-window/route.ts`

- [ ] **Step 1: unpaidConfirmed filtresine declaredAt koşulu ekle**

`unpaidConfirmed` sabitini şununla değiştir:
```ts
const unpaidConfirmed = {
  status: "CONFIRMED" as const,
  confirmedAt: { not: null },
  // Onayda her randevuya Payment oluşturulduğundan payment daima vardır.
  // Ödenmemiş (PAID değil) VE veli henüz bildirmemiş (declaredAt null) olanlar hedeflenir.
  payment: { is: { status: { not: "PAID" as const }, declaredAt: null } },
};
```

> Not: Eski OR yapısı kaldırıldı — Task 3 gereği onaylanan her booking'in bir Payment kaydı olur, dolayısıyla `payment is null` durumu CONFIRMED booking'lerde oluşmaz. `declaredAt: null` koşulu "veli bildirmediyse" anlamına gelir; bildirenler iptal/hatırlatma dışında kalır.

- [ ] **Step 2: Süreyi 24 saatte doğrula**

`PAYMENT_WINDOW_H = 24` ve `REMINDER_AFTER_H = 12` zaten böyle — değişiklik yok, teyit et.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: Hata yok.

- [ ] **Step 4: Manuel doğrulama**

`declaredAt` dolu bir booking için cron'u `?key=CRON_SECRET` ile çağır → o booking iptal EDİLMEZ. `declaredAt` null + 24s geçmiş booking → iptal EDİLİR, slot açılır.

- [ ] **Step 5: Commit**

```bash
git add app/api/cron/payment-window/route.ts
git commit -m "Cron: ödemesi bildirilmiş randevuları otomatik iptal etme"
```

---

## Task 5: Veli — IBAN talimat ekranı (PaymentPage)

**Files:**
- Modify: `components/dashboard/PaymentPage.tsx`
- Modify: `app/(dashboard)/parent/payments/[bookingId]/page.tsx` (IBAN + referans kodu prop'ları geç)

- [ ] **Step 1: Sayfada IBAN bilgisi + referans kodunu çek ve geç**

`app/(dashboard)/parent/payments/[bookingId]/page.tsx` içinde, `data` nesnesine ekle (importla birlikte):
```ts
import { getBankInfo } from "@/lib/payment-config";
```
`data` oluşturmadan önce:
```ts
  const bank = await getBankInfo();
```
`data` nesnesine ekle:
```ts
    referenceCode: booking.payment?.referenceCode ?? "",
    declared: !!booking.payment?.declaredAt,
    bank,
```

- [ ] **Step 2: PaymentPage'i IBAN ekranına çevir**

`components/dashboard/PaymentPage.tsx` — iyzico checkout çağrısını kaldır; IBAN + referans kodu (kopyala butonlu) göster; altta "Ödemeyi Bildirdim" butonu. Buton `PATCH /api/bookings/{bookingId}/status` `{ action: "declare_payment" }` çağırır, başarıda `/parent/bookings?payment=declared`'a yönlendirir. `declared === true` ise buton yerine "Ödemeniz bildirildi, onay bekleniyor" gösterir. `bank.iban` boşsa "IBAN bilgisi henüz tanımlanmadı, lütfen yöneticiyle iletişime geçin" uyarısı göster.

Prop tipi:
```ts
type Props = { booking: {
  bookingId: string; studentName: string; educatorName: string; subject: string;
  slotDate: string; slotStartTime: string; slotEndTime: string; totalPrice: number;
  referenceCode: string; declared: boolean;
  bank: { iban: string; accountName: string; bankName: string };
}};
```
"Ödemeyi Bildirdim" handler:
```ts
async function handleDeclare() {
  setLoading(true);
  const res = await fetch(`/api/bookings/${booking.bookingId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "declare_payment" }),
  });
  if (res.ok) window.location.href = "/parent/bookings?payment=declared";
  else { setLoading(false); alert("Bir hata oluştu, tekrar deneyin."); }
}
```

- [ ] **Step 3: parent/bookings'te "declared" bilgi banner'ı**

`app/(dashboard)/parent/bookings/page.tsx` searchParams tipine `payment?: string` zaten var; `payment === "declared"` için banner ekle:
```tsx
      {payment === "declared" && (
        <div className="bg-tertiary-fixed border border-primary/20 text-on-tertiary-fixed rounded-md px-5 py-4 flex items-center gap-3">
          <span className="text-xl">⏳</span>
          <div>
            <p className="font-display font-semibold">Ödeme bildiriminiz alındı.</p>
            <p className="text-body-md">Havaleniz kontrol edildikten sonra randevunuz kesinleşecek.</p>
          </div>
        </div>
      )}
```

- [ ] **Step 4: Lint + manuel doğrulama**

Run: `npm run lint` → hata yok.
Dev'de veli ödeme sayfasını aç → IBAN + referans kodu görünür, kopyalama çalışır, "Ödemeyi Bildirdim" → bookings'e "bildirim alındı" banner'ı ile döner.

- [ ] **Step 5: Commit**

```bash
git add components/dashboard/PaymentPage.tsx "app/(dashboard)/parent/payments/[bookingId]/page.tsx" "app/(dashboard)/parent/bookings/page.tsx"
git commit -m "Veli IBAN talimat ekranı + Ödemeyi Bildirdim akışı"
```

---

## Task 6: Admin — ödeme onayla/reddet endpoint'i

**Files:**
- Create: `app/api/admin/payments/[id]/route.ts`

- [ ] **Step 1: Endpoint'i yaz**

`app/api/admin/payments/[id]/route.ts`:
```ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { notify } from "@/lib/notify";
import { revalidatePath } from "next/cache";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const { id } = await params;
  const { action } = await req.json();

  const payment = await db.payment.findUnique({
    where: { id },
    include: { booking: { include: { student: { include: { parent: { include: { user: true } } } }, educator: { include: { user: true } } } } },
  });
  if (!payment) return NextResponse.json({ error: "Ödeme bulunamadı" }, { status: 404 });

  const parentUserId = payment.booking.student.parent.user.id;

  if (action === "approve") {
    await db.payment.update({ where: { id }, data: { status: "PAID" } });
    await db.booking.update({ where: { id: payment.bookingId }, data: { status: "COMPLETED" } });
    await notify({ userId: parentUserId, title: "Ödemeniz Onaylandı ✓", message: "Havaleniz onaylandı, randevunuz kesinleşti.", link: "/parent/bookings" });
    await notify({ userId: payment.booking.educator.userId, title: "Ödeme Onaylandı — Randevu Kesinleşti", message: `${payment.booking.student.name} için ödeme onaylandı.`, link: "/educator/bookings" });
  } else if (action === "reject") {
    await db.payment.update({ where: { id }, data: { declaredAt: null } });
    await notify({ userId: parentUserId, title: "Ödeme Bulunamadı", message: "Bildirdiğiniz havale hesabımızda görünmüyor. Lütfen kontrol edip tekrar bildirin.", link: "/parent/bookings" });
  } else {
    return NextResponse.json({ error: "Geçersiz işlem" }, { status: 400 });
  }

  revalidatePath("/admin/payments");
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: Hata yok.

- [ ] **Step 3: Manuel doğrulama**

Admin olmayan biriyle 401; admin ile `approve` → status PAID + booking COMPLETED + bildirimler; `reject` → declaredAt null.

- [ ] **Step 4: Commit**

```bash
git add "app/api/admin/payments/[id]/route.ts"
git commit -m "Admin ödeme onayla/reddet endpoint'i"
```

---

## Task 7: Admin — onay bekleyenler paneli

**Files:**
- Modify: `app/(dashboard)/admin/payments/page.tsx`
- Modify: `components/dashboard/AdminPaymentsView.tsx`

- [ ] **Step 1: Sayfada referenceCode + declaredAt'i view'e geç**

`app/(dashboard)/admin/payments/page.tsx` — `items` map'ine ekle:
```ts
    referenceCode: p.referenceCode ?? null,
    declaredAt: p.declaredAt ? p.declaredAt.toISOString() : null,
```
Ve `AdminPaymentItem` tipini (AdminPaymentsView içinde) bu alanlarla genişlet.

- [ ] **Step 2: View'e "Onay Bekleyenler" bölümü + butonlar ekle**

`components/dashboard/AdminPaymentsView.tsx` — `declaredAt != null && status === "PENDING"` olan kayıtları en üstte vurgulu bir listede göster; her satırda referans kodu + **[Onayla]** / **[Reddet]** butonları. Butonlar:
```ts
async function act(id: string, action: "approve" | "reject") {
  const res = await fetch(`/api/admin/payments/${id}`, {
    method: "PATCH", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
  if (res.ok) window.location.reload();
  else alert("İşlem başarısız.");
}
```

- [ ] **Step 3: Lint + manuel doğrulama**

Run: `npm run lint` → hata yok.
Dev'de: veli bildirim yaptıktan sonra admin panelinde "Onay Bekleyenler"de referans koduyla görünür; [Onayla] → PAID.

- [ ] **Step 4: Commit**

```bash
git add "app/(dashboard)/admin/payments/page.tsx" components/dashboard/AdminPaymentsView.tsx
git commit -m "Admin ödeme onay bekleyenler paneli + onayla/reddet butonları"
```

---

## Task 8: Admin — IBAN ayarları

**Files:**
- Modify: `app/api/admin/settings/route.ts`
- Modify: admin ayarlar sayfası (`app/(dashboard)/admin/settings/page.tsx` + ilgili view bileşeni)

- [ ] **Step 1: Settings endpoint'ine IBAN yazımını ekle**

`app/api/admin/settings/route.ts` — importa ekle:
```ts
import { setBankInfo } from "@/lib/payment-config";
```
`revalidatePath` çağrılarından önce ekle:
```ts
  if (body.bank !== undefined) {
    await setBankInfo({
      iban: String(body.bank.iban ?? "").trim(),
      accountName: String(body.bank.accountName ?? "").trim(),
      bankName: String(body.bank.bankName ?? "").trim(),
    });
    revalidatePath("/parent/payments");
  }
```

- [ ] **Step 2: Ayarlar sayfasına IBAN formu ekle**

Admin ayarlar sayfasında (mevcut komisyon oranı formunun yanına) IBAN / Ad Soyad / Banka adı input'ları; kaydet → `PATCH /api/admin/settings` `{ bank: { iban, accountName, bankName } }`. Mevcut değerleri `getBankInfo()` ile doldur.

- [ ] **Step 3: Lint + manuel doğrulama**

Run: `npm run lint` → hata yok.
Admin IBAN'ı kaydeder → veli ödeme ekranında görünür.

- [ ] **Step 4: Commit**

```bash
git add app/api/admin/settings/route.ts "app/(dashboard)/admin/settings"
git commit -m "Admin panelinden IBAN bilgisi düzenleme"
```

---

## Task 9: iyzico'yu inaktif tut (provider guard)

**Files:**
- Modify: `app/api/payments/checkout/route.ts`
- Modify: `app/api/payments/callback/route.ts`

- [ ] **Step 1: checkout'a provider guard ekle**

`app/api/payments/checkout/route.ts` — auth kontrolünden hemen sonra ekle:
```ts
import { getPaymentProvider } from "@/lib/payment-config";
// ...
  if ((await getPaymentProvider()) !== "iyzico") {
    return NextResponse.json({ error: "Şu an IBAN ile ödeme alınmaktadır." }, { status: 409 });
  }
```

- [ ] **Step 2: callback'e provider guard ekle**

`app/api/payments/callback/route.ts` — POST başına ekle:
```ts
import { getPaymentProvider } from "@/lib/payment-config";
// ...
  if ((await getPaymentProvider()) !== "iyzico") {
    return NextResponse.redirect(new URL("/parent/bookings", req.url));
  }
```

- [ ] **Step 3: Lint + manuel doğrulama**

Run: `npm run lint` → hata yok.
Provider `iban` (varsayılan) iken `POST /api/payments/checkout` → 409. iyzico dosyaları yerinde, silinmedi.

- [ ] **Step 4: Commit**

```bash
git add app/api/payments/checkout/route.ts app/api/payments/callback/route.ts
git commit -m "iyzico'yu provider anahtarıyla inaktif tut (IBAN modunda 409)"
```

---

## Task 10: Uçtan uca doğrulama + kapanış

- [ ] **Step 1: Tüm testler**

Run: `npm test`
Expected: payment-config testleri dahil tümü PASS.

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: Başarılı derleme.

- [ ] **Step 3: Uçtan uca senaryo (verify skill)**

Admin IBAN gir → öğretmen randevu onayla (referans kodu oluşur) → veli IBAN ekranını gör + "Ödemeyi Bildirdim" (declaredAt dolar, sayaç durur) → admin "Onayla" (PAID + COMPLETED) → veli & öğretmen bildirim alır. Ayrı olarak: bildirilmemiş + 24s geçmiş randevu cron'da iptal olur.

- [ ] **Step 4: finishing-a-development-branch skill ile kapat**

Merge/PR/cleanup kararı için `finishing-a-development-branch` skill'ini çağır.

---

## Notlar / Riskler

- **Admin reddi + süre dolmuş:** `reject` `declaredAt`'i null yapar; 24s çoktan geçmişse sonraki cron iptal edebilir — geçici sistem için kabul edilebilir (spec'te belirtildi).
- **Tek admin varsayımı:** Admin'e ayrı notify eklenmedi; onay bekleyenler admin panelinde görünür. İleride admin userId'lerine bildirim eklenebilir.
- **Migration:** `db push` kullanılıyor (proje deseni). Prod'da veri kaybı yok — sadece nullable alan eklemesi.
```
