# MEB Müfradatı Tabanlı Seviye Testi - Implementasyon Planı

**Tarih:** 2026-05-24
**Hedef:** Topic-based assessment selection ve question filtering
**Teknik Yaklaşım:** TDD (RED → GREEN → REFACTOR)

---

## Faz 1: Veritabanı Şeması & Prisma Migrations

### Task 1.1: Prisma Şeması Güncellemesi
**File:** `prisma/schema.prisma`

Changes:
1. Add new model `CurriculumTopic`:
   ```prisma
   model CurriculumTopic {
     id              String   @id @default(cuid())
     subject         String   // "MATEMATIK", "TURKCE", etc.
     gradeLevel      Int      // 1-8
     name            String   // "Doğal Sayılar", "Okuma ve Anlama"
     description     String?
     unit            String?
     learningObjects String[] @default([])
     
     assessments     LevelAssessment[]
     
     @@unique([subject, gradeLevel, name])
     @@index([subject, gradeLevel])
     @@map("curriculum_topics")
   }
   ```

2. Update `LevelAssessment`:
   ```prisma
   model LevelAssessment {
     // ... existing fields ...
     topicId         String?
     topic           CurriculumTopic? @relation(fields: [topicId], references: [id], onDelete: SetNull)
     
     @@index([topicId])
   }
   ```

**Output:** `prisma/schema.prisma` (modified)
**Tests:** TypeScript compilation without errors

---

### Task 1.2: Create Migration
**Command:**
```bash
npm run db:create-migration -- add-curriculum-topics
```

**Output:** `prisma/migrations/[timestamp]_add_curriculum_topics/migration.sql`
- Creates `curriculum_topics` table
- Adds `topicId` column to `level_assessments` table
- Creates indexes for `(subject, gradeLevel)` and `topicId`

**Tests:** Migration runs without errors: `npm run db:push`

---

### Task 1.3: Curriculum Data Seed Script
**File:** `prisma/seed-curriculum.ts` (create new)

Purpose: Populate `CurriculumTopic` table with user-provided curriculum data

Structure:
```typescript
// User data format (comma-separated):
// MATEMATIK,1,Doğal Sayılar (0-10),10'a kadar sayıları tanır
// MATEMATIK,1,Toplama İşlemi,10'a kadar toplama yapar
// ...

const curriculumData = [
  { subject: "MATEMATIK", grade: 1, topic: "Doğal Sayılar (0-10)", description: "..." },
  // ... 100+ topics
];

async function seedCurriculum() {
  for (const item of curriculumData) {
    await db.curriculumTopic.create({
      data: {
        subject: item.subject,
        gradeLevel: item.grade,
        name: item.topic,
        description: item.description,
      },
    });
  }
}
```

**Input:** MEB curriculum data (user will provide)
**Output:** Database populated with 200-300 `CurriculumTopic` records (estimated)
**Tests:** Verify record count and sample queries: `SELECT COUNT(*) FROM curriculum_topics`

---

## Faz 2: API Endpoints

### Task 2.1: Topic Listing Endpoint
**File:** `app/api/curriculum/topics/route.ts` (create new)

```typescript
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const subject = searchParams.get("subject"); // "MATEMATIK"
  const gradeLevel = searchParams.get("gradeLevel"); // "3"
  
  if (!subject || !gradeLevel) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }
  
  const topics = await db.curriculumTopic.findMany({
    where: { subject, gradeLevel: parseInt(gradeLevel) },
    orderBy: { name: "asc" },
  });
  
  return NextResponse.json(topics); // Returns [{ id, name, description }, ...]
}
```

**Tests:**
- ✓ GET with valid subject/grade returns topics array
- ✓ GET with invalid subject returns 400
- ✓ Topics sorted alphabetically

**HTTP Examples:**
```
GET /api/curriculum/topics?subject=MATEMATIK&gradeLevel=3
→ [{ id: "...", name: "Doğal Sayılar", description: "..." }, ...]

GET /api/curriculum/topics?subject=INVALID
→ 400 Bad Request
```

---

### Task 2.2: Update Assessment Creation Endpoint
**File:** `app/api/assessments/[bookingId]/route.ts` (modify existing)

Changes:
```typescript
export async function POST(
  req: Request,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  const { topicId, ...rest } = await req.json();
  
  // ... existing auth/validation ...
  
  const assessment = await db.levelAssessment.create({
    data: {
      bookingId,
      subject: booking.subject,
      gradeLevel: booking.gradeLevel,
      topicId: topicId || null, // Optional
      // ... rest of fields ...
    },
  });
  
  return NextResponse.json({ assessmentId: assessment.id });
}
```

**Tests:**
- ✓ POST with `topicId` creates assessment with topic
- ✓ POST without `topicId` creates generic assessment (backward compat)
- ✓ Invalid `topicId` returns 400

---

### Task 2.3: Update Results Endpoint
**File:** `app/api/assessments/[id]/results/route.ts` (modify existing)

Changes:
```typescript
const results = {
  subject: assessment.subject,
  gradeLevel: assessment.gradeLevel,
  topic: assessment.topic?.name || null, // NEW
  studentName: assessment.booking.student.name,
  // ... rest ...
};

return NextResponse.json(results);
```

**Tests:**
- ✓ GET returns topic name if assessment has topicId
- ✓ GET returns null for topic if no topicId
- ✓ Authorization still works

---

## Faz 3: Question Bank & Filtering

### Task 3.1: Update Question Structure
**File:** `lib/assessment-questions.ts` (major refactor)

Current structure:
```typescript
const MATEMATIK_ILKOKUL_3 = [
  { question: "...", options: [...], correct: 0 },
  // 8 generic questions
];
```

New structure:
```typescript
const MATEMATIK_3 = {
  "Doğal Sayılar": [
    { question: "...", options: [...], correct: 0, topic: "Doğal Sayılar" },
    { question: "...", options: [...], correct: 1, topic: "Doğal Sayılar" },
    // 5+ questions per topic
  ],
  "Toplama İşlemi": [
    { question: "...", options: [...], correct: 2, topic: "Toplama İşlemi" },
    // 5+ questions per topic
  ],
  // ... more topics
};
```

Implementation:
1. Keep existing 56 questions (don't break backward compat)
2. Add `topic` field to each question
3. Reorganize export: `getQuestionsByGrade(subject, grade, topic?)`
4. If `topic` provided: filter by topic
5. If no `topic`: return all questions for grade (current behavior)

**Output:** `lib/assessment-questions.ts` (refactored)
**Tests:**
- ✓ `getQuestionsByGrade("MATEMATIK", 3)` returns all 3rd grade math questions
- ✓ `getQuestionsByGrade("MATEMATIK", 3, "Doğal Sayılar")` returns only topic questions
- ✓ Returns up to 7 questions

---

### Task 3.2: Question Filtering Function
**File:** `lib/assessment-questions.ts`

Add function:
```typescript
export function getQuestionsByTopic(
  subject: string,
  gradeLevel: number,
  topicName?: string
): Question[] {
  const questions = getQuestionsByGrade(subject, gradeLevel);
  
  if (!topicName) return questions.slice(0, 7);
  
  const filtered = questions.filter(q => q.topic === topicName);
  if (filtered.length === 0) {
    // Fallback: return generic questions if topic has no questions
    return questions.slice(0, 7);
  }
  
  return filtered.slice(0, 7);
}
```

**Tests:**
- ✓ Returns 7 questions when topic has ≥7 questions
- ✓ Returns fewer when topic has <7 questions
- ✓ Fallback to generic when topic not found

---

### Task 3.3: Update Assessment Taking
**File:** `components/dashboard/AssessmentTaker.tsx` (existing, needs update)

Changes:
1. Fetch assessment with topic data:
   ```typescript
   const assessment = await db.levelAssessment.findUnique({
     where: { id },
     include: { topic: true, booking: true },
   });
   ```

2. Display topic at top:
   ```tsx
   {assessment.topic && (
     <div className="mb-4 p-3 bg-secondary-container rounded-lg">
       <p className="text-label-sm text-on-secondary-container">
         📚 Seçilen Konu: {assessment.topic.name} ({GRADE_LABELS[assessment.gradeLevel]})
       </p>
     </div>
   )}
   ```

3. Use topic-filtered questions in `getQuestionsByTopic()`:
   ```typescript
   const questions = getQuestionsByTopic(
     assessment.subject,
     assessment.gradeLevel,
     assessment.topic?.name
   );
   ```

**Tests:**
- ✓ Topic displays if available
- ✓ Questions filtered to topic
- ✓ No topic shown if assessment is generic

---

## Faz 4: Booking Wizard UI

### Task 4.1: Topic Selection Component (NEW)
**File:** `components/dashboard/TopicSelector.tsx` (create new)

```typescript
interface TopicSelectorProps {
  subject: string;
  gradeLevel: number;
  onSelect: (topicId: string, topicName: string) => void;
  selected?: string;
}

export default function TopicSelector({
  subject,
  gradeLevel,
  onSelect,
  selected,
}: TopicSelectorProps) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!subject || !gradeLevel) return;
    setLoading(true);
    fetch(`/api/curriculum/topics?subject=${subject}&gradeLevel=${gradeLevel}`)
      .then(r => r.json())
      .then(setTopics)
      .finally(() => setLoading(false));
  }, [subject, gradeLevel]);
  
  return (
    <div className="space-y-2">
      <label className="text-label-sm font-medium text-on-surface-variant">
        📚 Seçilen Konu *
      </label>
      {loading && <p className="text-caption text-on-surface-variant">Konular yükleniyor...</p>}
      <div className="overflow-x-auto flex gap-2 pb-2">
        {topics.map(topic => (
          <button
            key={topic.id}
            onClick={() => onSelect(topic.id, topic.name)}
            className={`shrink-0 px-4 py-2 rounded-full font-medium text-caption transition ${
              selected === topic.id
                ? "bg-primary text-on-primary"
                : "bg-surface-container border border-outline-variant text-on-surface-variant hover:border-primary"
            }`}
          >
            {topic.name}
          </button>
        ))}
      </div>
    </div>
  );
}
```

**Tests:**
- ✓ Loads topics from API on mount
- ✓ Shows loading state
- ✓ Displays topics as horizontally scrollable list
- ✓ Selected topic highlighted
- ✓ `onSelect` called with topic ID and name

---

### Task 4.2: Update BookingWizard
**File:** `components/dashboard/BookingWizard.tsx` (modify existing)

Changes in Step 2:
```tsx
const [selectedTopic, setSelectedTopic] = useState<{ id: string; name: string } | null>(null);

// After subject selection, show topic selector:
{selectedSubject && selectedGrade && (
  <TopicSelector
    subject={selectedSubject}
    gradeLevel={selectedGrade}
    onSelect={(id, name) => setSelectedTopic({ id, name })}
    selected={selectedTopic?.id}
  />
)}

// Modify "Create Booking" to include topicId:
const bookingData = {
  // ... existing fields ...
  topicId: selectedTopic?.id || null,
};

// Make topic mandatory:
<button
  disabled={!selectedSubject || !selectedGrade || !selectedTopic}
  className="... disabled:opacity-50 disabled:cursor-not-allowed"
>
  Ders Rezervasyonu Yap
</button>

// Show selected topic summary:
{selectedTopic && (
  <div className="mt-2 p-2 bg-primary-fixed rounded text-on-primary-fixed text-caption">
    ✓ Seçilen Konu: {selectedTopic.name}
  </div>
)}
```

**Tests:**
- ✓ Topic selector appears after subject selection
- ✓ Topic is mandatory (button disabled if not selected)
- ✓ Selected topic displayed in summary
- ✓ `topicId` passed to API on booking creation

---

### Task 4.3: Update AssessmentResultViewer
**File:** `components/dashboard/AssessmentResultViewer.tsx` (modify existing)

Changes:
```typescript
interface AssessmentResult {
  // ... existing fields ...
  topic?: string; // NEW
}

// In display:
{data && (
  <p className="text-caption text-on-surface-variant mt-0.5">
    {data.studentName} · {SUBJECT_LABELS[data.subject]} · {GRADE_LABELS[data.gradeLevel]}
    {data.topic && ` · 📚 ${data.topic}`}
  </p>
)}
```

**Tests:**
- ✓ Topic displays if available
- ✓ Results still show without topic (backward compat)

---

## Faz 5: Testing & Verification

### Task 5.1: End-to-End Testing
**Manual Test Steps:**
1. Login as Parent
2. Go to "Ders Talep Et"
3. Select student, grade (3), subject (Matematik)
4. **See topic list appear** ✓
5. Click "Doğal Sayılar" ✓
6. **See "✓ Seçilen Konu: Doğal Sayılar"** ✓
7. Create booking
8. Student takes assessment
9. **See "📚 Seçilen Konu: Doğal Sayılar" at top** ✓
10. Questions are only about Doğal Sayılar ✓
11. Educator views results
12. **See "📚 Doğal Sayılar" in results modal** ✓

**Regression Tests:**
- Booking WITHOUT topic selection (should fail - mandatory)
- OLD assessments without topic (should work - backward compat)
- Generic tests still work

---

### Task 5.2: API Testing
```bash
# Test topic listing
curl "http://localhost:3000/api/curriculum/topics?subject=MATEMATIK&gradeLevel=3"

# Test assessment with topic
curl -X POST http://localhost:3000/api/assessments/booking-123 \
  -H "Content-Type: application/json" \
  -d '{ "topicId": "abc123" }'

# Test results
curl http://localhost:3000/api/assessments/assessment-456/results
```

---

## Curriculum Data Input

### Required from User:
Structured list of MEB curriculum topics in format:
```
SUBJECT,GRADE,TOPIC_NAME,DESCRIPTION

Examples:
MATEMATIK,1,Doğal Sayılar (0-10),10'a kadar sayıları tanır ve yazılı şekilleri bilir
MATEMATIK,1,Toplama İşlemi,10'a kadar toplama yapar
MATEMATIK,2,Doğal Sayılar (0-100),100'e kadar sayıları tanır
TURKCE,1,Harf Tanıma,Harfleri tanır ve yazılı şekilleri bilir
...
```

### Steps:
1. User provides curriculum data (CSV or structured text)
2. Copy data into `prisma/curriculum-data.txt`
3. Parse in `seed-curriculum.ts`
4. Run: `npm run db:seed`
5. Verify: SELECT COUNT(*) FROM curriculum_topics

---

## Success Criteria

✓ Database: `CurriculumTopic` table created with 200+ topics
✓ API: `/api/curriculum/topics` returns topics for subject+grade
✓ UI: Topic selector appears after subject selection
✓ Booking: Topic is mandatory, passed to assessment creation
✓ Assessment: Questions filtered by selected topic (7 questions)
✓ Results: Topic name shown in educator results modal
✓ Backward Compat: Old assessments (no topicId) still work
✓ E2E: Parent selects topic → student gets topic-specific questions → educator sees topic in results

---

## Implementation Order (Dependency Chain)

1. **Prisma Schema + Migration** (Task 1.1, 1.2)
   - No dependencies, foundation layer

2. **Seed Script + Curriculum Data** (Task 1.3)
   - Depends on Schema migration

3. **API Endpoints** (Task 2.1, 2.2, 2.3)
   - Depends on Schema + Seed data

4. **Question Bank Refactor** (Task 3.1, 3.2)
   - Depends on API endpoints

5. **Assessment Taking** (Task 3.3)
   - Depends on Question Bank

6. **BookingWizard UI** (Task 4.1, 4.2)
   - Depends on API endpoints

7. **Results Viewer** (Task 4.3)
   - Depends on Results endpoint

8. **Testing & Verification** (Task 5.1, 5.2)
   - Depends on all above

---

## Estimated Effort

- Schema + Migration: 30 min
- Seed Script: 1 hour (+ user data input time)
- API Endpoints: 1.5 hours
- Question Bank Refactor: 2 hours
- Booking Wizard UI: 1.5 hours
- Results Viewer: 30 min
- Testing: 1 hour

**Total: ~8 hours** (1-2 development sessions)
