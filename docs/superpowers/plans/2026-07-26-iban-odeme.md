# IBAN / Havale ile Ödeme — Implementasyon Planı (YALIN)

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax for tracking. Inline execution.

**Goal:** iyzico'yu dormant bırakıp yerine yalın IBAN akışı: veli IBAN + referans kodunu görür ve havale yapar; admin bankadan görüp panelden "Ödendi" işaretler. Veli hiçbir butona basmaz.

**Karar (kullanıcı onaylı):** Veli "Ödemeyi Bildirdim" butonu YOK. `declaredAt` YOK. Otomatik iptal kapatılır (yanlış iptali önlemek için). Referans kodu eşleştirme için kalır. IBAN bilgisi `AppSetting`'te tutulur (şema değişmez), değeri seed edilir. iyzico dosyaları silinmez.

**Spec:** [../specs/2026-07-26-iban-odeme-design.md](../specs/2026-07-26-iban-odeme-design.md)

---

## Dosya Yapısı

- **Modify** `prisma/schema.prisma` — `Payment.referenceCode`
- **Create** `lib/payment-config.ts` (+ `.test.ts`) — referans kodu üretimi + IBAN okuma
- **Modify** `app/api/bookings/[bookingId]/status/route.ts` — onayda referans kodu; `payment_complete` açığını kaldır
- **Modify** `app/api/cron/payment-window/route.ts` — otomatik iptal + ödeme hatırlatmasını kapat
- **Modify** `components/dashboard/PaymentPage.tsx` + `app/(dashboard)/parent/payments/[bookingId]/page.tsx` — IBAN talimat ekranı (butonsuz)
- **Create** `app/api/admin/payments/[id]/route.ts` — admin "Ödendi işaretle"
- **Modify** `components/dashboard/AdminPaymentsView.tsx` + `app/(dashboard)/admin/payments/page.tsx` — buton + referans kodu

---

## Task 1: Payment.referenceCode

- [ ] `prisma/schema.prisma` → `model Payment` içine: `referenceCode String? @unique`
- [ ] `npm run db:push` → sync başarılı
- [ ] Commit: "Payment.referenceCode alanı"

## Task 2: Referans kodu + IBAN yardımcıları (TDD)

`lib/payment-config.ts`: saf `generateReferenceCode()` (`ÖY-XXXX`, karışan karakter yok), `generateUniqueReferenceCode()` (DB çakışma kontrollü), `getBankInfo()`/`setBankInfo()` (AppSetting: bank_iban/bank_account_name/bank_name).

- [ ] `lib/payment-config.test.ts` yaz: format + karışık karakter (0/O/1/I) testleri → `npm test -- payment-config` FAIL
- [ ] Implementasyonu yaz → test PASS
- [ ] Commit: "Referans kodu + IBAN yardımcıları (TDD)"

## Task 3: Onayda referans kodu + payment_complete açığını kaldır

- [ ] `bookings/[bookingId]/status` `approve` dalı: `db.payment.upsert` create'e `referenceCode: await generateUniqueReferenceCode()` ekle
- [ ] PARENT dalını kaldır: veli artık ödeme durumunu değiştiremez → `session.user.role === "PARENT"` için `403` döndür (güvenlik açığı kapanır)
- [ ] `npm run lint` temiz; manuel: onayda referenceCode dolu, veli PATCH → 403
- [ ] Commit: "Onayda referans kodu; payment_complete güvenlik açığını kaldır"

## Task 4: Cron — otomatik iptal + hatırlatmayı kapat

- [ ] `cron/payment-window`: `const AUTO_CANCEL_ENABLED = false;` ekle; ödeme hatırlatma (bölüm 1) ve otomatik iptal (bölüm 2) bloklarını bu bayrakla atla. Meet linki (3) ve rapor hatırlatma (4) aynen çalışır.
- [ ] `npm run lint` temiz; manuel: ödenmemiş randevu cron'da iptal EDİLMEZ
- [ ] Commit: "Cron: IBAN modunda otomatik iptal/hatırlatma kapalı"

## Task 5: Veli — IBAN talimat ekranı (butonsuz)

- [ ] `parent/payments/[bookingId]/page.tsx`: `getBankInfo()` çağır; `data`'ya `referenceCode`, `bank` ekle
- [ ] `PaymentPage.tsx`: iyzico checkout'u kaldır; IBAN + Ad Soyad + Banka + Tutar + Referans Kodu (kopyala butonlu) göster; altta bilgi metni: "Havaleyi yukarıdaki IBAN'a, açıklamaya referans kodunuzu yazarak yapın. Ödemeniz kontrol edilip onaylandığında randevunuz kesinleşir." `bank.iban` boşsa "IBAN henüz tanımlanmadı" uyarısı.
- [ ] `npm run lint` temiz; manuel: ekran IBAN + referans kodu gösterir
- [ ] Commit: "Veli IBAN talimat ekranı (butonsuz)"

## Task 6: Admin — "Ödendi işaretle"

- [ ] `app/api/admin/payments/[id]/route.ts` (PATCH, ADMIN): `action==="approve"` → payment PAID + booking COMPLETED + veli & öğretmene notify. Sahiplik: sadece ADMIN.
- [ ] `admin/payments/page.tsx`: `items`'e `referenceCode` + `status` ekle; `AdminPaymentsView`'e "Beklemede" ödemeler için **[Ödendi işaretle]** butonu (`PATCH /api/admin/payments/{id}` `{action:"approve"}` → reload)
- [ ] `npm run lint` temiz; manuel: admin butonla PAID yapar, admin olmayan 401
- [ ] Commit: "Admin ödeme onay butonu (Ödendi işaretle)"

## Task 7: IBAN'ı seed + uçtan uca doğrulama

- [ ] Kullanıcının verdiği IBAN/Ad Soyad/Banka değerlerini `setBankInfo()` ile AppSetting'e yaz (tek seferlik script)
- [ ] `npm test` (payment-config PASS) + `npm run build` başarılı
- [ ] Uçtan uca: öğretmen onay → veli IBAN ekranı → admin "Ödendi" → randevu COMPLETED
- [ ] `finishing-a-development-branch` skill ile kapat

---

## iyzico'yu geri açmak (gelecek notu)
1. Parent "Öde" butonunu iyzico checkout'a geri bağla, 2. `AUTO_CANCEL_ENABLED = true`, 3. `.env`'e iyzico anahtarları. iyzico dosyaları (`lib/iyzico.ts`, `payments/*`) yerinde duruyor.
