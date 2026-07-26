# IBAN / Havale ile Ödeme Sistemi — Tasarım

**Tarih:** 2026-07-26
**Durum:** Onay bekliyor
**Amaç:** iyzico (şirket/ödeme izni gerektirdiği için şu an kullanılamıyor) yerine geçici olarak IBAN/havale tabanlı, referans kodu ile eşleştirilen ve admin onaylı bir ödeme akışı kurmak. iyzico kodu silinmeyecek; ileride (iyzico veya TR Pay) tek ayarla geri açılabilecek şekilde **inaktif** tutulacak.

## Karar Özeti (kullanıcı onaylı)

- **Onay yöntemi:** Referans kodu ile eşleştirme (her randevuya benzersiz `ÖY-XXXX`).
- **Dekont:** Yüklenmeyecek. Veli sadece referans koduyla havale yapar; admin banka ekstresinden eşleştirir.
- **Otomatik iptal:** Veli "Ödemeyi Bildirdim" derse sayaç durur; admin geç onaylasa bile iptal olmaz. Bildirmezse süre sonunda otomatik iptal.
- **Sayaç:** 24 saat.
- **iyzico:** Silinmez, sağlayıcı anahtarıyla inaktif tutulur.
- **Veli deneyimi:** Veli SADECE IBAN ödeme ekranını görür — hiçbir sağlayıcı seçimi/ikilem gösterilmez.

## Genel Akış

```
Öğretmen randevuyu ONAYLAR
   → Payment (PENDING) + benzersiz referans kodu (ÖY-A3F9) oluşur
   → 24 saatlik ödeme sayacı başlar (confirmedAt)
        ↓
Veli "Ödeme" ekranını görür: IBAN + Ad Soyad + Banka + Referans Kodu + Tutar
   → havaleyi yapar, açıklamaya ÖY-A3F9 yazar
   → "Ödemeyi Bildirdim" butonuna basar
        ↓
Payment.declaredAt set edilir → sayaç DURUR ⏸ (otomatik iptal devre dışı)
   → admin'e bildirim gider
        ↓
Admin banka ekstresinde ÖY-A3F9'u görür → [Onayla]
        ↓
Payment.status = PAID, Booking.status = COMPLETED → veli + öğretmene bildirim
```
Veli 24 saat içinde "Ödemeyi Bildirdim" demezse cron randevuyu iptal eder ve slotu yeniden açar.

## Veri Modeli Değişiklikleri

### `Payment`
- ➕ `referenceCode String? @unique` — `ÖY-XXXX` biçiminde benzersiz eşleştirme kodu.
- ➕ `declaredAt DateTime?` — velinin "Ödemeyi Bildirdim" dediği an. `null` = bildirilmedi (sayaç aktif), dolu = onay bekliyor (sayaç durdu).
- `iyzicoPaymentId`, `iyzicoToken` alanları korunur (silinmez), sadece IBAN akışında kullanılmaz.

Ödeme durumu için **yeni enum değeri eklenmez** (migration riskini azaltmak için). Durum `PaymentStatus.PENDING` + `declaredAt` kombinasyonu ile ifade edilir:
- `PENDING` + `declaredAt = null` → Ödeme bekleniyor (sayaç aktif)
- `PENDING` + `declaredAt` dolu → Onay bekliyor (admin görecek)
- `PAID` → Admin onayladı
- `FAILED` → Süre doldu / iptal

### `AppSetting` (yeni key-value kayıtları — şema değişmez)
- `payment_provider` = `"iban"` (varsayılan) | `"iyzico"`
- `bank_iban`, `bank_account_name`, `bank_name`, `payment_note` (havale açıklaması şablonu)

## Bileşenler

### 1. Sağlayıcı anahtarı (internal)
`lib/payment-config.ts` (yeni) — `AppSetting`'ten `payment_provider` okur. Varsayılan `"iban"`. Veli arayüzü bu anahtarı **görmez**; sadece kod hangi akışı çalıştıracağına karar verir.

### 2. Referans kodu üretimi
Öğretmen randevuyu onayladığında ([app/api/bookings/[bookingId]/status/route.ts](app/api/bookings/[bookingId]/status/route.ts) `approve` dalı) Payment oluşturulurken benzersiz `ÖY-XXXX` üretilir (çakışma kontrolüyle).

### 3. Veli — Ödeme ekranı
`/parent/bookings` içindeki "Öde" aksiyonu iyzico yerine bir **IBAN talimat görünümüne** gider: IBAN, Ad Soyad, Banka, Tutar, Referans Kodu (kopyala butonlarıyla) + **"Ödemeyi Bildirdim"** butonu.

### 4. Veli — "Ödemeyi Bildirdim" endpoint'i
Yeni davranış: mevcut güvenlik açığı olan `payment_complete` aksiyonu **kaldırılır**. Yerine `action: "declare_payment"` gelir; bu sadece `Payment.declaredAt = now()` yapar (PAID YAPMAZ). Sahiplik kontrolü korunur.

### 5. Admin — Onay paneli
`/admin/payments`: "Onay Bekleyen" (declaredAt dolu, status PENDING) liste → her satırda referans kodu + [Onayla]/[Reddet]. Onayla → PAID + COMPLETED + bildirimler. Reddet → declaredAt sıfırlanır, veliye "ödeme görünmüyor" bildirimi. Ayrıca Ayarlar'da IBAN alanlarını düzenleme.

### 6. Cron değişikliği
[app/api/cron/payment-window/route.ts](app/api/cron/payment-window/route.ts) `unpaidConfirmed` filtresine `payment: { declaredAt: null }` koşulu eklenir → bildirilmiş ödemeler ne iptal edilir ne hatırlatılır. Sayaç 24 saat kalır. Meet linki ve rapor mantığı değişmez.

### 7. iyzico'nun inaktif tutulması
- `lib/iyzico.ts`, `payments/checkout`, `payments/callback` dosyaları **silinmez**.
- `payment_provider !== "iyzico"` iken bu route'lar isteği kibarca reddeder (`409` + "Şu an IBAN ile ödeme alınmaktadır") — yan kapı kalmaz.
- `.env` iyzico anahtarları kalabilir; IBAN modunda okunmaz.

## Veri Akışı / Durum Geçişleri

```
Booking: PENDING → (öğretmen onay) CONFIRMED → (admin ödeme onay) COMPLETED
                                             → (süre doldu / iptal) CANCELLED
Payment: (yok) → PENDING(declaredAt=null) → PENDING(declaredAt=now) → PAID
                                                                    → FAILED
```

## Hata Durumları

- **Çift bildirim:** declaredAt zaten doluysa tekrar bildirimde no-op.
- **Zaten ödenmiş:** status PAID ise ödeme ekranı "ödendi" gösterir, buton pasif.
- **Admin reddi:** declaredAt null'a çekilir, sayaç kaldığı yerden... (basitlik için: confirmedAt sabit kaldığından süre dolmuşsa iptal edilebilir — admin manuel karar verir).
- **Referans kodu çakışması:** üretimde benzersizlik döngüsüyle önlenir.
- **IBAN ayarı boşsa:** ödeme ekranı "IBAN bilgisi henüz tanımlanmadı" uyarısı; admin'e log.

## Güvenlik

- Eski `payment_complete` açığı (veli kendini PAID yapabiliyordu) **tamamen kapanır** — velinin yapabildiği tek şey `declaredAt` set etmek; PAID yalnızca admin tarafından.
- iyzico route'ları inaktifken reddedilir → yan kapı yok.
- Tüm yeni endpoint'ler mevcut `auth()` + rol + sahiplik desenini izler.

## Test Kapsamı (TDD için)

- Referans kodu benzersiz üretiliyor.
- `declare_payment` sadece declaredAt set eder, PAID yapmaz; başka velinin booking'inde 403.
- Admin onayı PAID + COMPLETED yapar; admin olmayan reddedilir.
- Cron: declaredAt dolu booking iptal edilmez; null olan 24s sonra iptal edilir.
- Provider `iban` iken checkout/callback 409 döner.

## Kapsam Dışı

- Otomatik banka API eşleştirmesi (ileride).
- Dekont yükleme.
- iyzico/TR Pay'in fiili yeniden entegrasyonu (bu spec sadece inaktif bırakır).
- İade (refund) akışı.
