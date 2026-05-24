# MEB Müfradatı Tabanlı Konu Seçimi ve Seviye Testi Tasarımı

**Tarih:** 2026-05-24
**Amaç:** Velinin ders talebinde seçtiği konuya ait sorularla seviye testi oluşturma
**Kullanıcı İhtiyacı:** "1-8.sınıf arası MEB müfradatını tarayıp, velinin ders talebindeki konu eksiği belirttiği şey ile ilgili doğru bir şekilde seviye testi hazırlama"

---

## 1. Sistem Mimarisi

### 1.1 Veri Akışı
```
Parent: Grade + Subject Selection
    ↓
System: Fetch topics for [Grade][Subject] from database
    ↓
UI: Show scrollable topic list
    ↓
Parent: Click to select topic
    ↓
System: Store selected topic in assessment record
    ↓
System: Generate 7-question test filtered by topic
    ↓
Parent: Take assessment
    ↓
Educator: View results with topic context
```

### 1.2 Veritabanı Şeması Değişiklikleri

**Yeni Model: `CurriculumTopic`**
```prisma
model CurriculumTopic {
  id            String   @id @default(cuid())
  subject       String   // MATEMATIK, TURKCE, FEN_BILIMLERI, SOSYAL_BILGILER, INGILIZCE
  gradeLevel    Int      // 1-8
  name          String   // e.g., "Doğal Sayılar", "Okuma ve Anlama"
  description   String?  // Kısa açıklama
  unit          String?  // MEB müfredat ünitesi/bölümü
  learningObjects String[]  // JSON array: öğrenme çıktıları
  
  @@unique([subject, gradeLevel, name])
  @@index([subject, gradeLevel])
}
```

**Güncellenmiş Model: `LevelAssessment`**
```prisma
model LevelAssessment {
  // ... existing fields ...
  topicId       String?   // Null = generic test, Set = topic-specific test
  topic         CurriculumTopic? @relation(fields: [topicId], references: [id], onDelete: SetNull)
  
  @@index([topicId])
}
```

### 1.3 API Endpoint'leri

**GET `/api/curriculum/topics?subject=MATEMATIK&gradeLevel=3`**
- Returns: `CurriculumTopic[]` for specific grade+subject
- Format: `[{ id, name, description }, ...]`

**POST `/api/assessments`** (Updated)
- Existing payload + `topicId?: string`
- If `topicId` provided: Filter questions by topic
- If no `topicId`: Use generic level test (backward compatible)

**GET `/api/assessments/[id]/results`** (Updated)
- Include topic name in response if available
- Show student's topic selection in results

---

## 2. UI/UX Değişiklikleri

### 2.1 Booking Wizard - Step 2 (Grade + Subject)
**Current Flow:**
```
Step 1: Student Selection
Step 2: Grade + Subject + Time Slot Selection
Step 3: Confirm + Create Booking
```

**New Flow:**
```
Step 1: Student Selection
Step 2: Grade + Subject + Time Slot Selection
Step 2.5: Topic Selection (NEW - scrollable list after subject selection)
Step 3: Confirm + Create Booking
```

### 2.2 Topic Selection UI
- Show after subject selection in Step 2
- Horizontal scrollable list (mobile-friendly)
- Each topic: name + short description
- Click to select (highlight active topic)
- Mandatory: Parent MUST select topic before proceeding

### 2.3 Assessment Taker View
- Show selected topic at top: "📚 Seçilen Konu: Doğal Sayılar (3. Sınıf)"
- 7 questions filtered by topic
- Same visual design as current assessment

### 2.4 Educator Results View (AssessmentResultViewer)
- Add topic display: "Konu: Doğal Sayılar"
- Show topic context when opening results modal

---

## 3. Müfredat Veri Yapısı (MEB 2023 Standartları)

### 3.1 Konu Örneği Yapısı
```
Matematik - 3. Sınıf - "Doğal Sayılar"
  Unit: "Sayılar ve İşlemler"
  Learning Objects:
    - "Dört basamaklı doğal sayıları okur ve yazar"
    - "Dört basamaklı doğal sayıların basamaklarının adı ve basamak değerini belirtir"
    - "Dört basamaklı doğal sayıları çözümler"
```

### 3.2 Başlangıç Müfredat Veri Kaynağı
- User will provide curriculum data in text format
- Seed script: `prisma/seed-curriculum.ts` to populate `CurriculumTopic` table
- Format expected: CSV or structured text with [Subject, Grade, Topic, Description]

---

## 4. Soru Bankası Güncellemeleri

### 4.1 Soru-Konu Haritalaması
Current `lib/assessment-questions.ts`:
- Has 56 questions (8 questions × 7 subjects)
- Generic for each grade level
- NO topic mapping

New approach:
- Add `topic?: string` field to each question
- Organize by: `[SUBJECT]_[GRADE] → [TOPIC] → [QUESTIONS]`
- Example:
  ```typescript
  MATEMATIK_ILKOKUL_3: {
    "Doğal Sayılar": [q1, q2, q3, ...],
    "Toplama İşlemi": [q4, q5, q6, ...],
    ...
  }
  ```

### 4.2 Question Filtering Logic
```typescript
function getQuestionsByTopic(
  subject: string,
  gradeLevel: number,
  topicId?: string
): Question[] {
  const questions = getAllQuestionsForGrade(subject, gradeLevel);
  if (!topicId) return questions.slice(0, 7);
  
  // Filter by topic, return up to 7
  return questions
    .filter(q => q.topic === topicId)
    .slice(0, 7);
}
```

---

## 5. Implementasyon Faz Planı

### Faz 1: Veritabanı & API (Priority: CRITICAL)
- [ ] Add `CurriculumTopic` model + migration
- [ ] Update `LevelAssessment` model with `topicId`
- [ ] Create `GET /api/curriculum/topics` endpoint
- [ ] Create `prisma/seed-curriculum.ts` script
- [ ] Add topic filtering to question bank

### Faz 2: Booking Wizard UI (Priority: HIGH)
- [ ] Update BookingWizard Step 2 to show topic selector after subject
- [ ] Add scrollable topic list component
- [ ] Make topic selection mandatory before Step 3
- [ ] Pass `topicId` to assessment creation

### Faz 3: Assessment & Results (Priority: HIGH)
- [ ] Update `/api/assessments` POST to handle `topicId`
- [ ] Update question filtering in assessment generation
- [ ] Update `AssessmentResultViewer` to show topic
- [ ] Update `/api/assessments/[id]/results` to include topic

### Faz 4: Testing & Verification (Priority: MEDIUM)
- [ ] Test topic selection UI
- [ ] Verify question filtering by topic
- [ ] Test educator result viewing with topic context
- [ ] Manual QA: End-to-end flow

---

## 6. Curriculum Veri Giriş Planı

### 6.1 Format Beklentisi (User tarafından sağlanacak)
User will provide data as text. Expected format example:
```
MATEMATIK,1,Doğal Sayılar (0-10),10'a kadar olan sayıları tanır
MATEMATIK,1,Toplama İşlemi,10'a kadar toplama yapar
TURKCE,1,Harf Tanıma,Harfleri tanır ve yazılı şekilleri bilir
...
```

### 6.2 Seed Komut Dosyası
- Parse user-provided data
- Create `CurriculumTopic` records for each entry
- Map to existing subjects and grades

### 6.3 Geçiş Stratejisi
- Backward compatible: assessments without `topicId` still work
- Existing tests: generic questions (current behavior)
- New tests: topic-filtered questions if `topicId` provided

---

## 7. İnsan Kullanıcı Akışı (Veli Perspektifi)

1. **Booking Wizard Step 2 açılıyor**
   - "3. Sınıf" seçer
   - "Matematik" seçer
   
2. **Konu seçimi görünür**
   - Scrollable list: "Doğal Sayılar", "Toplama İşlemi", "Çıkarma İşlemi", ...
   - Veli "Doğal Sayılar"ı tıklar (highlight olur)
   
3. **Reservation tamamlanıyor**
   - "Step 3: Onayla" düğmesi aktif hale gelir
   - Selected topic gösterilir: "✓ Seçilen Konu: Doğal Sayılar"

4. **Assessment başlatılıyor**
   - Student: "Konu: Doğal Sayılar (3. Sınıf)"
   - 7 soru, tümü "Doğal Sayılar" hakkında

5. **Sonuçlar gözleniyor (Educator)**
   - "Konu: Doğal Sayılar" başlıkla gösterilir
   - Sonuçlar açılan modal'da: "3. Sınıf, Matematik, Doğal Sayılar → 5/7 doğru (%71)"

---

## 8. Sınırlamalar ve Notlar

- **Müfredat Veri**: User must provide curriculum topics. System does not auto-scrape MEB website.
- **Soru Bankası**: Soru-konu haritalaması manual olacak (ML otomasyonu değil)
- **Backward Compatibility**: Generic level tests (no topicId) still work
- **Performans**: Curriculum topics cached in-memory or Prisma query

---

## 9. Başarı Kriterleri

✓ Parent can select specific curriculum topic after grade+subject
✓ Assessment questions filtered to selected topic (7 questions from topic)
✓ Educator sees topic context in results
✓ System handles missing curriculum data gracefully (fallback to generic)
✓ Backward compatible with existing generic assessments
✓ UI is mobile-responsive and intuitive
