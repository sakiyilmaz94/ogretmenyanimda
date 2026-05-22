# CLAUDE.md

Superpowers-enabled development methodology for this project.

## Proje: Öğretmen Yanımda

Next.js 15 tabanlı özel ders platformu. 4 kullanıcı rolü: Admin (Yönetici), Educator (Eğitimci), Parent (Veli), Student (Öğrenci).

### Superpowers Metodolojisi

Bu proje **Superpowers** yazılım geliştirme metodolojisini kullanıyor. Temel akış:

**HARD-GATE: Kod yazmadan önce HERzaman brainstorming skill'i kullan!**

```
1. brainstorming → Tasarım & spec oluştur (docs/superpowers/specs/)
2. writing-plans → Detaylı implementasyon planı yaz (docs/superpowers/plans/)
3. test-driven-development → Her feature için TDD: RED → GREEN → REFACTOR
4. subagent-driven-development → Planı fresh subagent'lerle uygula (task per subagent + 2-stage review)
5. verification-before-completion → Başarı iddiası öncesi evidence topla
6. requesting-code-review → Code review ile quality gate
7. finishing-a-development-branch → Development tamamlandığında merge/PR/cleanup karar ver
```

**Kural:** Eğer brainstorming olmadan kod yazma temeyyülü hissetmişsen, dur. Spec yaz ilk.

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

---

## Superpowers Skills Sistemi

### Core Skills (Zorunlu)

| Skill | Açıklama | Aktivasyon |
|-------|----------|-----------|
| **brainstorming** | Tasarım & spec oluştur | Kod yazma ÖNCE (HARD-GATE) |
| **writing-plans** | Detaylı implementasyon planı | Tasarım onayından sonra |
| **test-driven-development** | RED-GREEN-REFACTOR TDD cycle | Her feature/bugfix öncesi |
| **systematic-debugging** | Root cause investigation | Herhangi bir bug/test failure |
| **subagent-driven-development** | Task per subagent + 2-stage review | Implementasyon planını çalıştır |
| **verification-before-completion** | Başarı iddiası öncesi evidence | Herhangi bir claim öncesi |
| **requesting-code-review** | Code review dispatching | Görev tamamlandığında |
| **receiving-code-review** | Review feedback alma & implement | Review feedback alındığında |
| **finishing-a-development-branch** | Dev tamamlama: merge/PR/cleanup | Bütün tasklar tamamlandığında |

### Supporting Skills

- **using-git-worktrees** — İzole workspace kurmak (subagent-driven öncesi)
- **dispatching-parallel-agents** — 3+ bağımsız görev için paralel execution
- **executing-plans** — Plan yürütme (subagent-driven yerine inline execution)
- **using-superpowers** — Meta-skill: skill sistemi introduksiyon
- **writing-skills** — Yeni skill yazmak/mevcut skill'leri improve etmek
- **verification-before-completion** — Başarı iddiası öncesi doğrulama

### Skill Dosya Yapısı

```
.agent/
├── skills/               # 48+ skill (Superpowers + custom)
│   ├── brainstorming/
│   ├── writing-plans/
│   ├── test-driven-development/
│   ├── systematic-debugging/
│   ├── subagent-driven-development/
│   ├── ... [44+ daha skill]
│   └── [skill-name]/SKILL.md
└── workflows/            # Custom workflows
    ├── maestro.md        # Akıllı orkestrasyon
    ├── plan.md           # Görev planlaması
    ├── deploy.md         # Canlıya alma
    └── ... [diğer workflows]
```

### Skill Kullanım Kuralları

1. **Skill'ler otomatik aktivasyon:** Belirli durumlarda skill'ler auto-invoke edilmelidir (HARD-GATE)
2. **Mandatory workflows:** brainstorming → writing-plans → implementation (TDD) → subagent-driven → verification
3. **Skill tool invocation zorunlu:** Skill'i aktif etmeden cevap verme (Using-superpowers skill)
4. **Spec & plan dosya konumları:**
   - Specs: `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`
   - Plans: `docs/superpowers/plans/YYYY-MM-DD-<feature>-plan.md`

---

## Slash Komutlar (Superpowers Workflows)

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
