# Grade 2 Soru Bankası — Implementasyon Planı

**Tarih:** 2026-05-30  
**Metodoloji:** Superpowers (TDD + Subagent-driven)  
**Spec:** `docs/superpowers/specs/2026-05-30-grade2-question-bank-design.md`

---

## Faz 1: Prisma Schema Update

### 1.1 Schema Değişikliği
**File:** `prisma/schema.prisma`

```prisma
model LevelAssessmentQuestion {
  id               String   @id @default(cuid())
  topicId          String
  topic            CurriculumTopic @relation(fields: [topicId], references: [id])
  
  gradeLevel       Int
  subject          String
  topicName        String   // Denormalized for quick search
  
  question         String
  option1          String
  option2          String
  option3          String
  option4          String
  correctAnswer    Int      // 0-3
  difficulty       String   // "easy" | "medium" | "hard"
  
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  
  @@index([gradeLevel, subject, topicId])
}

// CurriculumTopic relation update
model CurriculumTopic {
  // ... existing fields ...
  questions        LevelAssessmentQuestion[]
}
```

### 1.2 Migration
```bash
npx prisma migrate dev --name add_level_assessment_questions
```

---

## Faz 2: Soru Üretim Script'i

### 2.1 Soru Üretim Fonksiyonu
**File:** `scripts/generate-grade2-questions.ts`

```typescript
import { Anthropic } from "@anthropic-ai/sdk";
import { db } from "@/lib/db";

interface Question {
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctAnswer: number;
  difficulty: string;
}

async function generateQuestionsForTopic(
  subject: string,
  topicName: string,
  gradeLevel: number
): Promise<Question[]> {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const systemPrompt = `Sen Türkiye MEB müfredatına göre 2. sınıf seviye belirleme test soruları üreten bir sistemsin.
Görevin: Verilen konu hakkında tam olarak 10 çoktan seçmeli soru üretmek.
- 3 kolay (easy)
- 4 orta (medium)  
- 3 zor (hard)

Kurallar:
1. Her soru sadece verilen konu hakkında olacak
2. Sorular 2. sınıf seviyesine uygun dil ile yazılacak
3. Her sorunun tam 4 şıkkı olacak
4. Sadece 1 doğru cevap var
5. Hiç belirsizlik veya çift cevap olmayacak
6. SADECE JSON dön, başka hiçbir şey yazma`;

  const userPrompt = `Konu: ${topicName}
Sınıf: 2. Sınıf
Ders: ${subject}

Bu konuya göre tam 10 soru üret. JSON formatı:
{
  "questions": [
    {
      "question": "...",
      "option1": "...",
      "option2": "...",
      "option3": "...",
      "option4": "...",
      "correctAnswer": 0-3,
      "difficulty": "easy|medium|hard"
    }
  ]
}`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const responseText =
    message.content[0].type === "text" ? message.content[0].text : "";

  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("JSON bulunamadı");

  const parsed = JSON.parse(jsonMatch[0]);
  return parsed.questions;
}

async function loadGrade2Questions() {
  try {
    console.log("🚀 Grade 2 Soru Bankası Oluşturma Başladı\n");

    // Türkçe konuları
    const turkishTopics = await db.curriculumTopic.findMany({
      where: { gradeLevel: 2, subject: "TÜRKÇE" },
    });

    console.log(`📝 ${turkishTopics.length} Türkçe konu için soru üretiliyor...`);
    for (const topic of turkishTopics) {
      try {
        const questions = await generateQuestionsForTopic(
          "TÜRKÇE",
          topic.name,
          2
        );

        for (const q of questions) {
          await db.levelAssessmentQuestion.create({
            data: {
              topicId: topic.id,
              gradeLevel: 2,
              subject: "TÜRKÇE",
              topicName: topic.name,
              question: q.question,
              option1: q.option1,
              option2: q.option2,
              option3: q.option3,
              option4: q.option4,
              correctAnswer: q.correctAnswer,
              difficulty: q.difficulty,
            },
          });
        }

        console.log(`   ✓ ${topic.name} (10 soru)`);
      } catch (e) {
        console.error(`   ❌ ${topic.name}:`, e);
      }
    }

    // Matematik konuları
    const mathTopics = await db.curriculumTopic.findMany({
      where: { gradeLevel: 2, subject: "MATEMATIK" },
    });

    console.log(`\n🔢 ${mathTopics.length} Matematik konu için soru üretiliyor...`);
    for (const topic of mathTopics) {
      try {
        const questions = await generateQuestionsForTopic(
          "MATEMATIK",
          topic.name,
          2
        );

        for (const q of questions) {
          await db.levelAssessmentQuestion.create({
            data: {
              topicId: topic.id,
              gradeLevel: 2,
              subject: "MATEMATIK",
              topicName: topic.name,
              question: q.question,
              option1: q.option1,
              option2: q.option2,
              option3: q.option3,
              option4: q.option4,
              correctAnswer: q.correctAnswer,
              difficulty: q.difficulty,
            },
          });
        }

        console.log(`   ✓ ${topic.name} (10 soru)`);
      } catch (e) {
        console.error(`   ❌ ${topic.name}:`, e);
      }
    }

    // Sonuç
    const turkishCount = await db.levelAssessmentQuestion.count({
      where: { gradeLevel: 2, subject: "TÜRKÇE" },
    });
    const mathCount = await db.levelAssessmentQuestion.count({
      where: { gradeLevel: 2, subject: "MATEMATIK" },
    });

    console.log("\n✅ SONUÇLAR:");
    console.log(`   Türkçe soruları: ${turkishCount}`);
    console.log(`   Matematik soruları: ${mathCount}`);
    console.log(`   Toplam: ${turkishCount + mathCount} soru\n`);

    if (turkishCount >= 290 && mathCount >= 220) {
      console.log("🎉 Soru Bankası Oluşturma Başarılı!");
      process.exit(0);
    } else {
      console.error("❌ Yeterli soru oluşturulamadı");
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Hata:", error);
    process.exit(1);
  }
}

loadGrade2Questions();
```

### 2.2 Çalıştırma
```bash
npx ts-node scripts/generate-grade2-questions.ts
```

---

## Faz 3: Assessment Endpoint Güncelleme

### 3.1 GET Handler Değişikliği
**File:** `app/api/assessments/[id]/route.ts`

**Eski (Claude API):**
```typescript
const questions = await generateQuestions(gradeLevel, subject, topicName);
```

**Yeni (Database):**
```typescript
const questions = await db.levelAssessmentQuestion.findMany({
  where: {
    gradeLevel: parseInt(gradeLevel),
    subject: subject,
    topicName: topicName,
  },
  take: 10,
  orderBy: { difficulty: 'asc' }, // Easy → Medium → Hard
});
```

### 3.2 Response Format Compatibility
- Eski format: `{ index, question, options: [4 strings] }`
- Yeni format: `{ question, option1, option2, option3, option4 }`
- **Mapper yazmalı:** Yeni formatı eski formata çevir (frontend compatibility)

---

## Faz 4: Quality Assurance Test

### 4.1 Soru Validation
**Test Points:**
- [ ] Her sorunun 4 şıkkı var
- [ ] Sadece 1 doğru cevap (0-3 range)
- [ ] Zorluk: "easy" | "medium" | "hard"
- [ ] Soru metni boş değil
- [ ] Hiç null/undefined field YOK

### 4.2 SQL Query
```sql
SELECT 
  COUNT(*) as total,
  SUM(CASE WHEN difficulty = 'easy' THEN 1 ELSE 0 END) as easy,
  SUM(CASE WHEN difficulty = 'medium' THEN 1 ELSE 0 END) as medium,
  SUM(CASE WHEN difficulty = 'hard' THEN 1 ELSE 0 END) as hard
FROM "LevelAssessmentQuestion"
WHERE "gradeLevel" = 2;
```

**Expected:**
- Total: 510 (290 Türkçe + 220 Matematik)
- Easy: ~153 (510 × 3/10)
- Medium: ~204 (510 × 4/10)
- Hard: ~153 (510 × 3/10)

---

## Faz 5: API Test

### 5.1 Assessment GET Test
```bash
# Create LevelAssessment (manual database insert ya da API call)
# GET /api/assessments/[assessmentId]
# → 10 sorular döndürüyor? (database'den)
```

### 5.2 Score Calculation Test
```bash
# POST /api/assessments/[assessmentId]
# { answers: [...] }
# → Correct score calculation?
```

---

## Faz 6: Verification & Evidence

### 6.1 Database Sorguları
```sql
-- Toplam soru sayısı
SELECT COUNT(*) FROM "LevelAssessmentQuestion" WHERE "gradeLevel" = 2;

-- Türkçe soru dağılımı
SELECT difficulty, COUNT(*) FROM "LevelAssessmentQuestion"
WHERE "gradeLevel" = 2 AND subject = 'TÜRKÇE'
GROUP BY difficulty;

-- Matematik soru dağılımı
SELECT difficulty, COUNT(*) FROM "LevelAssessmentQuestion"
WHERE "gradeLevel" = 2 AND subject = 'MATEMATIK'
GROUP BY difficulty;
```

### 6.2 Evidence Collection
- [ ] Screenshot: Database query sonuçları (510 sorular)
- [ ] Screenshot: Assessment GET response (10 sorular döndürüyor)
- [ ] Screenshot: Assessment POST response (score calculation doğru)

---

## Timeline & Estimates

| Faz | Görev | Süre |
|-----|-------|------|
| 1 | Schema update + migration | 5 min |
| 2 | Soru üretim script | 20 min |
| 3 | Endpoint güncelleme | 10 min |
| 4 | QA test | 15 min |
| 5 | API test | 10 min |
| 6 | Evidence collection | 10 min |
| **Total** | | **70 min** |

---

## Rollback Plan

Eğer hata:
```sql
DELETE FROM "LevelAssessmentQuestion" WHERE "gradeLevel" = 2;
DROP TABLE "LevelAssessmentQuestion";
```

---

## Notes

⚠️ **Critical:**
- ANTHROPIC_API_KEY gerekli (bir kere, soru üretimi için)
- Sonrasında API call YOOK
- 51 API calls × ~$0.003 = ~$0.15 toplam ücret
- Uygun/ekonomik çözüm
