# Grade 2 Soru Bankası — Tasarım Spec

**Tarih:** 2026-05-30  
**Aşama:** Brainstorming → Spec  
**Görev:** Grade 2 Türkçe + Matematik soru bankası oluştur (MEB müfredatına göre)  

---

## 1. Problem Tanımı

Öğretmen Yanımda platformunda **seviye belirleme testleri (Level Assessment)** için soru bankası gerekli.

**Kısıt:** Claude API ücretli → Sorular önceden generate edip, database'e kaydedelim. Assessment'de bu hazır soruları ver (API call sıfır).

**Target:**
- Grade 2 Türkçe: 29 konu × 10 soru = 290 soru
- Grade 2 Matematik: 22 konu × 10 soru = 220 soru
- **Total: 510 soru**

---

## 2. Soru Format Spesifikasyonu

### 2.1 Database Schema
**Tablo:** `LevelAssessmentQuestion` (yeni)

```prisma
model LevelAssessmentQuestion {
  id          String   @id @default(cuid())
  topicId     String
  topic       CurriculumTopic @relation(fields: [topicId], references: [id])
  
  gradeLevel  Int      // 2 (Grade 2)
  subject     String   // "TÜRKÇE" | "MATEMATIK"
  topicName   String   // Konu adı (denormalized)
  
  question    String   // Soru metni
  options     String[] // 4 şık (JSON array ya da 4 text field)
  correctAnswer Int    // 0-3 (hangi şık doğru)
  difficulty  String   // "easy" | "medium" | "hard"
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([gradeLevel, subject, topicId])
}
```

### 2.2 Soru Özellikleri
- **Dil:** Türkçe (sade, 2. sınıf seviyesi)
- **Format:** Multiple-choice (4 şık, 1 doğru cevap)
- **Zorluk:** Easy (3) / Medium (4) / Hard (3) — dağılım 3-4-3
- **Bağlam:** MEB 2024-2025 müfredatında tanımlı bilgiler
- **Kalite:** Herhangi bir belirsizlik veya çift cevap YOK

### 2.3 Örnek Soru (Türkçe)

**Konu:** Harf Bilgisi - Alfabe  
**Zorluk:** Easy

```json
{
  "question": "Aşağıdakilerden hangisi bir sesli harftir?",
  "options": [
    "A) b",
    "B) a",
    "C) k",
    "D) t"
  ],
  "correctAnswer": 1,
  "difficulty": "easy"
}
```

**Konu:** Kelime Bilgisi - Eş Anlamlı Kelimeler  
**Zorluk:** Medium

```json
{
  "question": "'Mutlu' kelimesinin anlamı en yakın olan kelime hangisidir?",
  "options": [
    "A) Hüzünlü",
    "B) Sevinçli",
    "C) Şaşırmış",
    "D) Korkmuş"
  ],
  "correctAnswer": 1,
  "difficulty": "medium"
}
```

### 2.4 Örnek Soru (Matematik)

**Konu:** Sayılar (0-100)  
**Zorluk:** Easy

```json
{
  "question": "45 sayısında kaç tane onluk vardır?",
  "options": [
    "A) 4",
    "B) 5",
    "C) 45",
    "D) 9"
  ],
  "correctAnswer": 0,
  "difficulty": "easy"
}
```

**Konu:** Toplama ve Çıkarma İşlemleriyle İlgili Problemler  
**Zorluk:** Hard

```json
{
  "question": "Elin 23 kalemin var. Arkadaşına 7 kalem verdikten sonra 5 kalem daha aldı. Şimdi kaç kalemi vardır?",
  "options": [
    "A) 21",
    "B) 30",
    "C) 15",
    "D) 25"
  ],
  "correctAnswer": 0,
  "difficulty": "hard"
}
```

---

## 3. Soru Üretim Stratejisi

### 3.1 Yöntem
**MEB Müfredatı + Claude AI** (tek pass, bir kere çalışır)
- Konu adı → Claude: "Bu konu hakkında 10 soru üret (3 easy, 4 medium, 3 hard)"
- JSON formatında response
- Database'e insert et
- **Sonrasında API call YOOK**

### 3.2 Quality Assurance
- [ ] Her sorunun 4 şıkkı var
- [ ] Sadece 1 doğru cevap var
- [ ] Soru metni türkçe, anlaşılır, 2. sınıf seviyesi
- [ ] Hiç belirsizlik yok (çift cevap, garip şık vs.)
- [ ] Zorluk dağılımı: 3-4-3

### 3.3 Batch Processing
**Sırası:**
1. Grade 2 Türkçe konuları (29 konu)
2. Grade 2 Matematik konuları (22 konu)
3. **Total API calls: 51** (minimal)

---

## 4. Database Changes

### 4.1 Prisma Schema Update
```prisma
model LevelAssessmentQuestion {
  id               String   @id @default(cuid())
  topicId          String
  topic            CurriculumTopic @relation(fields: [topicId], references: [id])
  gradeLevel       Int
  subject          String
  topicName        String
  question         String
  option1          String
  option2          String
  option3          String
  option4          String
  correctAnswer    Int      // 0-3
  difficulty       String
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  
  @@index([gradeLevel, subject, topicId])
}
```

### 4.2 Migration
```bash
npx prisma migrate dev --name add_level_assessment_questions
```

---

## 5. Assessment Endpoint Değişikliği

### 5.1 Eski Logic (API call)
```typescript
// app/api/assessments/[id]/route.ts GET handler
const questions = await generateQuestions(gradeLevel, subject, topicName);
// → Claude API call (ücretli)
```

### 5.2 Yeni Logic (Database)
```typescript
// Yeni versiyonda
const questions = await db.levelAssessmentQuestion.findMany({
  where: {
    gradeLevel: parseInt(gradeLevel),
    subject: subject,
    topicName: topicName,
  },
  take: 10, // 10 soru
  orderBy: { difficulty: 'asc' }, // Easy → Medium → Hard
});
// → Zero API calls
```

---

## 6. Success Criteria

✅ 290 Türkçe soru (29 konu × 10)  
✅ 220 Matematik soru (22 konu × 10)  
✅ Total 510 soru database'de  
✅ Zorluk dağılımı: 3-4-3 (Easy-Medium-Hard)  
✅ Hiç boş/eksik soru YOK  
✅ Assessment endpoint'i database'den soru çekiyor (API call sıfır)  
✅ Sorular 2. sınıf seviyesi (anlaşılır, uygun)  
✅ Quality check: 100% valid questions  

---

## 7. Sonraki Etaplar

- Grade 3-8 soru bankası (same pattern)
- Educator tarafından custom soru eklemesi (future)
- Soru güncelleme / archiving (future)

---

## 8. Cost Analysis

| Senaryo | API Calls | Ücret |
|---------|-----------|--------|
| Eski (her assessment'de API) | 1,000+ / ay | ❌ Yüksek |
| Yeni (önceden generate) | 51 total | ✅ Minimal (~$0.3) |

**Tasarruf:** ~99% API call reduction
