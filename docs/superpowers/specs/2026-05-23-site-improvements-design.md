# Site İyileştirmeleri — Tasarım Dokümanı
**Tarih:** 2026-05-23

---

## Kapsam

14 maddelik düzenleme paketi. Dört gruba ayrıldı.

---

## Grup A — UI/İçerik Düzeltmeleri

### 1–2. Şifre Göster Butonu
- Register ve login sayfalarında şifre alanına göz ikonu eklenir
- `showPassword: boolean` state, `<button>` ile toggle, input `type` dinamik değişir
- Dosyalar: `app/(auth)/register/page.tsx`, `app/(auth)/login/page.tsx`

### 3. Bildirim Zili Panel Pozisyonu
- Şu an `bottom: window.innerHeight - rect.top` ile yukarı açılıyor
- Düzeltme: `top: rect.bottom + 12, right: window.innerWidth - rect.right` ile aşağı açılacak
- Dosya: `components/dashboard/NotificationBell.tsx`

### 9. "Nasıl Ücretlendirilir?" Adım 2 Rengi
- Adım 2 kartı `bg-on-primary-fixed` (açık renk kart) üzerinde `text-on-surface-variant` ile metin okunmuyor
- Düzeltme: `bg-on-primary-fixed` → `bg-primary-container`, metin rengi `text-on-primary` ile tutarlı
- Dosya: `app/page.tsx`

### 10. SSS "Ders Süresi" Yanıtı
- Mevcut: "Bireysel dersler 45 dakika, grup dersleri (maks. 6 öğrenci) 60 dakika"
- Yeni: "Derslerimiz 1 saattir. Grup dersimiz bulunmamaktadır."
- Dosya: `app/page.tsx`

### 11. Dersler → Egitmenlerimiz Filtre Sorunu
- Dersler sayfası `?seviye=ortaokul&ders=matematik` parametresi gönderiyor
- Egitmenlerimiz sayfası sadece `?subject=` parametresini biliyor
- Düzeltme: `searchParams`'a `seviye` ve `ders` eklenir; slug→Subject enum eşlemesi yapılır; `seviye` → gradeLevel filtresi (`ilkokul`: ILKOKUL_1..4, `ortaokul`: ORTAOKUL_5..8)
- Dosya: `app/egitmenlerimiz/page.tsx`

### 12. %98 Memnuniyet İstatistiği
- Mevcut: `{ count: "%98", label: "Öğrenci Memnuniyeti" }`
- Yeni: `{ count: "1:1", label: "Birebir Dersler" }`
- Dosya: `app/egitmenlerimiz/page.tsx`

### 13. Hero Başlığı "Uzmanlarla"
- Mevcut: "Uzmanlarla\nKaliteli ve Etkili Öğrenim"
- Yeni: "Öğretmenlerimizle\nSıcak ve Etkili Öğrenim"
- Dosya: `app/page.tsx`

### 14. Navbar "Fiyatlandırma" Linki
- `navLinks` dizisinden `{ href: "/fiyatlandirma", label: "Fiyatlandırma" }` kaldırılır
- Dosya: `components/layout/PublicNavbar.tsx`

---

## Grup B — Email Entegrasyonu

### 4. Hoş Geldiniz Maili
- `app/api/auth/register/route.ts` → kayıt başarıyla tamamlandıktan sonra `sendEmail(emailWelcome(...))` çağrısı
- `lib/email.ts`'e `emailWelcome({ name, email, role })` şablonu eklenir
- Rol bazında içerik: Veli için "aramıza hoş geldiniz, çocuğunuza öğretmen arayabilirsiniz"; Öğretmen için "başvurunuz alındı, 1-3 iş günü inceleme" mesajı

---

## Grup C — Yeni Özellikler

### 5. Öğretmen Kaynakları (PDF Yükleme)
**DB:**
```
model EducatorResource {
  id          String   @id @default(cuid())
  educatorId  String
  title       String
  description String?
  fileUrl     String
  subject     Subject?
  isFree      Boolean  @default(true)
  createdAt   DateTime @default(now())
  educator    Educator @relation(...)
}
```
**API:**
- `POST /api/educator/resources` — yeni kaynak yükle
- `GET /api/educator/resources` — öğretmenin kaynakları
- `DELETE /api/educator/resources/[id]` — sil

**UI:**
- `/educator/kaynaklar` sayfası: yükleme formu + kaynak listesi
- Supabase Storage: `educator-resources/` bucket
- Öğretmen profil sayfası (`/egitmenlerimiz/[id]`): "Ücretsiz Kaynaklar" bölümü, veliler indirebilir

### 6. Mini Seviye Testi
**DB:**
```
model LevelAssessment {
  id          String   @id @default(cuid())
  bookingId   String   @unique
  studentId   String
  subject     Subject
  gradeLevel  GradeLevel
  status      AssessmentStatus @default(PENDING)
  sentAt      DateTime @default(now())
  completedAt DateTime?
  responses   AssessmentResponse[]
}

model AssessmentResponse {
  id             String @id @default(cuid())
  assessmentId   String
  questionIndex  Int
  selectedAnswer Int    // 0-3
  assessment     LevelAssessment @relation(...)
}

enum AssessmentStatus { PENDING COMPLETED }
```
**Soru Havuzu:** Her Subject + GradeLevel çifti için 10 sabit soru `lib/assessment-questions.ts`'de tanımlanır.
**Akış:**
1. Booking CONFIRMED olduğunda `createAssessment(booking)` çağrılır
2. Veliye email: "Çocuğunuz için seviye testi gönderildi" + link (`/test/[assessmentId]`)
3. Public test sayfası: çocuk 5-10 soruyu yanıtlar
4. Sonuçlar `/educator/bookings` sayfasında görünür

### 7. Ders Sonu Rapor Formu
**DB:**
```
model LessonReport {
  id            String   @id @default(cuid())
  bookingId     String   @unique
  educatorId    String
  topicsCovered String   @db.Text
  nextSteps     String   @db.Text
  homework      String?  @db.Text
  notes         String?  @db.Text
  createdAt     DateTime @default(now())
  booking       Booking  @relation(...)
}
```
**Akış:**
1. Booking durumu COMPLETED olduğunda öğretmene email: "Lütfen ders raporunu doldurunuz"
2. Educator paneli `/educator/bookings` sayfasına "Rapor Doldur" butonu eklenir
3. Form gönderilince veliye email: "Ders raporunuz hazır, lütfen kontrol ediniz"
4. Parent paneli `/parent/bookings` sayfasında her tamamlanan derste "Raporu Gör" butonu

---

## Grup D — Google Meet Kurulum Rehberi

Sistem altyapısı (`lib/google-meet.ts`) hazır. Aktivasyon için:
1. [Google Cloud Console](https://console.cloud.google.com) → Yeni proje
2. Google Meet API aktif et
3. IAM → Service Account → JSON key indir
4. `.env.local`'a ekle:
   ```
   GOOGLE_SERVICE_ACCOUNT_EMAIL=xxx@xxx.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
   ```
5. Booking CONFIRMED + ödeme tamamlandığında `createMeetingSpace()` çağrısı zaten `lib/google-meet.ts`'de hazır; sadece booking flow'a entegre edilecek

---

## Etkilenen Dosyalar Özeti

| Dosya | Değişiklik |
|---|---|
| `app/(auth)/register/page.tsx` | Şifre toggle |
| `app/(auth)/login/page.tsx` | Şifre toggle |
| `components/dashboard/NotificationBell.tsx` | Panel pozisyonu |
| `app/page.tsx` | Adım 2 rengi, SSS, hero başlığı |
| `app/egitmenlerimiz/page.tsx` | Filtre, %98 stat |
| `components/layout/PublicNavbar.tsx` | Fiyatlandırma linki kaldır |
| `app/api/auth/register/route.ts` | Welcome email |
| `lib/email.ts` | emailWelcome şablonu, lesson report şablonu |
| `prisma/schema.prisma` | EducatorResource, LevelAssessment, AssessmentResponse, LessonReport |
| `app/(dashboard)/educator/kaynaklar/page.tsx` | Yeni sayfa |
| `app/(dashboard)/educator/bookings/page.tsx` | Rapor formu butonu |
| `app/(dashboard)/parent/bookings/page.tsx` | Rapor görüntüleme |
| `app/test/[id]/page.tsx` | Seviye testi sayfası |
| `app/api/educator/resources/route.ts` | CRUD |
| `app/api/assessments/route.ts` | Test API |
| `app/api/lesson-reports/route.ts` | Rapor API |
| `lib/assessment-questions.ts` | Soru havuzu |
