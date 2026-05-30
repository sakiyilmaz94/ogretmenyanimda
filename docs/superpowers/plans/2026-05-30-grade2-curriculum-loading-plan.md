# Grade 2 Müfredat Yükleme — Implementasyon Planı

**Tarih:** 2026-05-30  
**Metodoloji:** Superpowers (TDD + Subagent-driven)  
**Spec:** `docs/superpowers/specs/2026-05-30-grade2-curriculum-design.md`

---

## Faz 1: PDF Upload & Data Extraction (Yeni Sekmede)

### 1.1 PDF'leri Upload Et
**Task:** Grade 2 Türkçe ve Matematik PDF'lerini attach et ya da Google Drive linkini paylaş

**Expected Output:**
```
Grade2_Turkce.pdf
Grade2_Matematik.pdf
```

### 1.2 Konuları Ayıkla (Manual + Structured)
**Yöntem:** PDF'den oku → Konu listesi yap → JSON format'ında organize et

**Output Dosyası:** `docs/curriculum/grade2-topics.json`
```json
{
  "grade2_turkce": [
    { "name": "Harf ve Ses Tanıma", "description": "..." },
    { "name": "Basit Kelimeleri Okuma", "description": "..." },
    ...
  ],
  "grade2_matematik": [
    { "name": "Sayılar (0-100)", "description": "..." },
    ...
  ]
}
```

---

## Faz 2: Data Validation

### 2.1 Constraint Kontrolü
**Checklist:**
- [ ] Türkçe konuları: 8+ entry
- [ ] Matematik konuları: 8+ entry
- [ ] Subject field: "TÜRKÇE" / "MATEMATIK" (case-sensitive)
- [ ] GradeLevel: 2 (number)
- [ ] Duplicate? (Aynı (grade, subject, name) tuple yoksa)

**Script Location:** `scripts/validate-curriculum.ts`
```typescript
const validate = (data) => {
  for (const [subject, topics] of Object.entries(data)) {
    const names = new Set();
    for (const t of topics) {
      if (names.has(t.name)) throw new Error(`Duplicate: ${t.name}`);
      names.add(t.name);
    }
  }
};
```

### 2.2 Schema Alignment
**Kontrol:** Prisma schema'sında `CurriculumTopic` table'ı var mı?
```bash
$ npx prisma studio  # Açıp kontrol et
```

---

## Faz 3: Database Insertion (TDD)

### 3.1 Red Phase — Test Yazma
**File:** `scripts/grade2-curriculum.test.ts`

```typescript
import { db } from "@/lib/db";

describe("Grade 2 Curriculum Loading", () => {
  it("should insert Grade 2 Turkish topics without duplicates", async () => {
    const count = await db.curriculumTopic.count({
      where: { gradeLevel: 2, subject: "TÜRKÇE" },
    });
    expect(count).toBeGreaterThanOrEqual(8);
  });

  it("should insert Grade 2 Math topics without duplicates", async () => {
    const count = await db.curriculumTopic.count({
      where: { gradeLevel: 2, subject: "MATEMATIK" },
    });
    expect(count).toBeGreaterThanOrEqual(8);
  });

  it("should prevent duplicate topics via unique constraint", async () => {
    await expect(
      db.curriculumTopic.create({
        data: {
          gradeLevel: 2,
          subject: "TÜRKÇE",
          name: "Harf ve Ses Tanıma",
        },
      })
    ).rejects.toThrow("Unique constraint");
  });

  it("should not mix Grade 2 and Grade 3 topics", async () => {
    const grade2 = await db.curriculumTopic.findMany({
      where: { gradeLevel: 2 },
    });
    const grade3 = await db.curriculumTopic.findMany({
      where: { gradeLevel: 3 },
    });
    const grade2Names = new Set(grade2.map((t) => t.name));
    const grade3Names = new Set(grade3.map((t) => t.name));
    for (const name of grade2Names) {
      expect(grade3Names.has(name)).toBe(false); // Yanlış pattern, sabit adlı konular expected
    }
  });
});
```

### 3.2 Green Phase — Insert Script
**File:** `scripts/load-grade2-curriculum.ts`

```typescript
import { db } from "@/lib/db";
import grade2Topics from "@/docs/curriculum/grade2-topics.json";

async function loadGrade2Curriculum() {
  try {
    const turkishTopics = grade2Topics.grade2_turkce.map((t) => ({
      gradeLevel: 2,
      subject: "TÜRKÇE",
      name: t.name,
      description: t.description || "",
    }));

    const mathTopics = grade2Topics.grade2_matematik.map((t) => ({
      gradeLevel: 2,
      subject: "MATEMATIK",
      name: t.name,
      description: t.description || "",
    }));

    const allTopics = [...turkishTopics, ...mathTopics];

    const result = await db.$transaction(
      allTopics.map((t) =>
        db.curriculumTopic.create({ data: t })
      )
    );

    console.log(`✅ ${result.length} topics loaded successfully`);
  } catch (error) {
    console.error("❌ Curriculum loading failed:", error);
    process.exit(1);
  }
}

loadGrade2Curriculum();
```

**Çalıştırma:**
```bash
$ npx ts-node scripts/load-grade2-curriculum.ts
```

### 3.3 Refactor Phase
- Error handling iyileştir (loop detection, retry logic)
- Logging ekle (başarı/başarısızlık detayı)
- Transaction guarantees kontrol et

---

## Faz 4: API Verification (Dual-Filter Test)

### 4.1 Manual Test (Browser)
```
GET http://localhost:3000/api/curriculum/topics?subject=TURKCE&gradeLevel=2
GET http://localhost:3000/api/curriculum/topics?subject=MATEMATIK&gradeLevel=2
```

**Expected Response:**
```json
[
  { "id": "...", "name": "Harf ve Ses Tanıma", "description": "..." },
  { "id": "...", "name": "Basit Kelimeleri Okuma", "description": "..." },
  ...
]
```

### 4.2 Test: No Cross-Grade Contamination
```bash
# Grade 2 Türkçe konuları sorgulanırken Grade 3 konusu gelmemeli
curl "http://localhost:3000/api/curriculum/topics?subject=TURKCE&gradeLevel=2"
# → Sadece 2. sınıf Türkçe konuları dönmeli
```

---

## Faz 5: Assessment Integration Test

### 5.1 Parent Selection Flow Simülasyonu
1. Grade 2 seç
2. TÜRKÇE seç
3. "Harf ve Ses Tanıma" konusunu seç
4. Assessment başla
5. Claude API soru üretişini kontrol et (sadece bu konuyu test ediyor mu?)

**API Response Örneği:**
```json
{
  "id": "...",
  "subject": "TURKCE",
  "gradeLevel": "2. sınıf",
  "questions": [
    {
      "index": 0,
      "question": "Aşağıdakilerden hangisi bir sesli harf değildir?",
      "options": ["A) a", "B) k", "C) e", "D) ı"]
    },
    ...
  ]
}
```

---

## Faz 6: Verification & Evidence

### 6.1 Database Durumu
```sql
-- Türkçe konuları
SELECT COUNT(*) FROM "CurriculumTopic" 
WHERE grade_level = 2 AND subject = 'TÜRKÇE';
-- → 8+ satır dönmeli

-- Matematik konuları
SELECT COUNT(*) FROM "CurriculumTopic" 
WHERE grade_level = 2 AND subject = 'MATEMATIK';
-- → 8+ satır dönmeli

-- Constraint check
SELECT DISTINCT (grade_level, subject, name) FROM "CurriculumTopic";
-- → Duplicates olmamalı
```

### 6.2 Screenshot/Evidence
- [ ] `GET /api/curriculum/topics?subject=TURKCE&gradeLevel=2` → 200 + topic list
- [ ] `GET /api/curriculum/topics?subject=MATEMATIK&gradeLevel=2` → 200 + topic list
- [ ] Assessment test: Claude API soru üretime başarılı
- [ ] Grade 2 ≠ Grade 3 topics (contamination yok)

---

## Faz 7: Code Review & Merge

### 7.1 Files Changed
- `docs/superpowers/specs/2026-05-30-grade2-curriculum-design.md` — Spec
- `docs/superpowers/plans/2026-05-30-grade2-curriculum-loading-plan.md` — Plan
- `docs/curriculum/grade2-topics.json` — Extracted data
- `scripts/grade2-curriculum.test.ts` — Tests
- `scripts/load-grade2-curriculum.ts` — Insertion script
- `scripts/validate-curriculum.ts` — Validation

### 7.2 Review Checklist
- [ ] Spec ve plan tutarlı
- [ ] Tests geçti (npm test)
- [ ] No duplicate topics (constraint enforced)
- [ ] API dual-filter çalışıyor
- [ ] Grade separation maintained
- [ ] Zero errors, zero loops

### 7.3 Merge Decision
- Single PR: Spec + Plan + Scripts + Data
- Branch: `feature/grade2-curriculum`
- Merge: Main'e (after review approval)

---

## Timeline & Estimates

| Faz | Görev | Süre | Sorumlu |
|-----|-------|------|---------|
| 1 | PDF upload & extraction | 15-30 min | User (new tab) |
| 2 | Data validation | 10 min | Claude |
| 3 | TDD & insertion | 20 min | Claude |
| 4 | API verification | 10 min | Claude |
| 5 | Assessment test | 15 min | Claude |
| 6 | Evidence collection | 10 min | Claude |
| 7 | Code review & merge | 10 min | User |
| **Total** | | **90 min** | |

---

## Rollback Plan

Eğer hata oluşursa:
```sql
DELETE FROM "CurriculumTopic" WHERE grade_level = 2;
```

Sonra:
1. Error log'u analiz et
2. Data validation'ı fix et
3. Script'i güncelle
4. Retry

---

## Notes

⚠️ **Critical Reminders:**
- PDF'ler şart (yeni sekmede upload et)
- Dual-filter constraint'i kırma (API döğru dönmeli)
- Grade 2 ≠ Grade 3 (contamination yasak)
- Transaction safety (all-or-nothing)
- Zero errors policy
