# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proje: Öğretmen Yanımda

Next.js 15 tabanlı özel ders platformu. 4 kullanıcı rolü: Admin, Educator (Eğitimci), Parent (Veli), Student (Öğrenci).

## Komutlar

```bash
npm run dev          # Geliştirme sunucusu (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint kontrolü
npm run db:push      # Prisma şemasını DB'ye uygula
npm run db:studio    # Prisma Studio (DB görsel arayüz)
npm run db:seed      # Admin kullanıcısını oluştur
```

## Mimari

```
app/
├── (auth)/          # Login, Register — public sayfalar
├── (dashboard)/
│   ├── admin/       # Admin paneli (educators, payments, students, bookings, settings)
│   ├── educator/    # Eğitimci paneli (availability, bookings, profile)
│   └── parent/      # Veli paneli (students, book, bookings, payments)
├── api/             # API route'ları
│   ├── auth/        # NextAuth + kayıt
│   ├── admin/       # Eğitimci onay/red
│   ├── educator/    # Uygunluk slotları + profil
│   ├── parent/      # Öğrenci CRUD
│   └── bookings/    # Rezervasyon oluşturma
├── page.tsx         # Landing page (rolüne göre dashboard'a yönlendirir)
└── layout.tsx       # Root layout (SessionProvider)

components/
├── dashboard/       # AvailabilityManager, BookingWizard, EducatorApprovalCard, EducatorProfileForm, StudentManager
└── layout/          # DashboardLayout (sol sidebar)

lib/
├── db.ts            # Prisma client singleton
├── utils.ts         # cn(), formatCurrency(), formatDate(), GRADE_LABELS, SUBJECT_LABELS
auth.ts              # NextAuth v5 config (JWT strateji, rol callback'leri)
middleware.ts        # Rol bazlı route koruması
prisma/schema.prisma # DB şeması — User, Educator, Parent, Student, AvailabilitySlot, Booking, Payment, Notification
```

## Kritik Detaylar

- **Auth**: NextAuth v5 (beta), JWT strateji, `session.user.role` alanı types/next-auth.d.ts ile genişletilmiş
- **DB**: Supabase PostgreSQL, Session Pooler URL (IPv4), `aws-1-eu-central-2.pooler.supabase.com:5432`
- **params**: Next.js 15'te route params `Promise<{}>` tipinde — `await params` gerekli
- **Roller**: ADMIN → /admin, EDUCATOR → /educator, PARENT → /parent
- **Admin girişi**: admin@ogretmenyanimda.com.tr / Admin.2026!
- **iyzico**: Henüz entegre edilmedi, .env.local'a eklenecek (Etap 3)

## Antigravity Kit — Slash Komutları

Kullanıcı bir `/komut` yazdığında `.agent/workflows/<komut>.md` dosyasını oku ve içindeki talimatları uygula.

| Komut | Dosya | Açıklama |
|-------|-------|----------|
| `/maestro` | `.agent/workflows/maestro.md` | Akıllı orkestrasyon — karmaşık görevler |
| `/plan` | `.agent/workflows/plan.md` | Görev planlaması |
| `/deploy` | `.agent/workflows/deploy.md` | Canlıya alma |
| `/debug` | `.agent/workflows/debug.md` | Hata ayıklama |
| `/create` | `.agent/workflows/create.md` | Yeni özellik oluşturma |
| `/test` | `.agent/workflows/test.md` | Test çalıştırma |
| `/enhance` | `.agent/workflows/enhance.md` | Kod iyileştirme |
| `/ui-ux-pro-max` | `.agent/workflows/ui-ux-pro-max.md` | Gelişmiş UI/UX tasarımı |

## Agent & Skill Sistemi

Uzman ajanlar `.agent/agents/` dizinindedir. Skill'ler `.agent/skills/<skill-adı>/SKILL.md` konumundadır. Yalnızca görev için gerekli olan skill dosyasını oku.

## Dil

Kullanıcıyla **Türkçe** iletişim kur.

## Slash Komutları

Kullanıcı bir `/komut` yazdığında `.agent/workflows/<komut>.md` dosyasını oku ve içindeki talimatları uygula.

| Komut | Dosya | Açıklama |
|-------|-------|----------|
| `/maestro` | `.agent/workflows/maestro.md` | Akıllı orkestrasyon — karmaşık görevler |
| `/plan` | `.agent/workflows/plan.md` | Görev planlaması |
| `/deploy` | `.agent/workflows/deploy.md` | Canlıya alma |
| `/debug` | `.agent/workflows/debug.md` | Hata ayıklama |
| `/create` | `.agent/workflows/create.md` | Yeni özellik oluşturma |
| `/test` | `.agent/workflows/test.md` | Test çalıştırma |
| `/enhance` | `.agent/workflows/enhance.md` | Kod iyileştirme |
| `/orchestrate` | `.agent/workflows/orchestrate.md` | Çoklu ajan koordinasyonu |
| `/brainstorm` | `.agent/workflows/brainstorm.md` | Fikir geliştirme |
| `/preview` | `.agent/workflows/preview.md` | Değişiklikleri önizleme |
| `/status` | `.agent/workflows/status.md` | Proje durumu |
| `/ui-ux-pro-max` | `.agent/workflows/ui-ux-pro-max.md` | Gelişmiş UI/UX tasarımı |

## Agent Sistemi

Uzman ajanlar `.agent/agents/` dizinindedir. `Agent` aracıyla çağırırken agent dosyasını oku ve sistem promptu olarak kullan.

## Skill Sistemi

Skill'ler `.agent/skills/<skill-adı>/SKILL.md` konumundadır. **Yalnızca görev için gerekli olan skill dosyasını oku** — hepsini aynı anda yükleme.

## Dil

Kullanıcıyla **Türkçe** iletişim kur.
