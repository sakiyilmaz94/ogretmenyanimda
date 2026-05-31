# 2. Sınıf Matematik — Ünite Sonu Soruları Extraction

**Tarih:** 2026-05-31  
**Görev:** 2. Sınıf Matematik Kitap 1 & 2'nin ünite sonu sorularını extract edip, database'e insert et

---

## 1. Hedef

**Kaynak:** Eğitim Kitaplığı/ders kitapları klasöründe:
- `2. Sınıf Matematik Ders Kitabı 1. Kitap .pdf`
- `2. Sınıf Matematik Ders Kitabı 2. Kitap .pdf`

**İşlem:**
1. PDF'leri text olarak oku (PyMuPDF)
2. Her ünite için "Sınav/Değerlendirme" bölümünü bul
3. O bölümdeki 10 soru al
4. Database'e insert et (LevelAssessmentQuestion)

**Database Schema:**
```
LevelAssessmentQuestion
├── id: CUID
├── topicId: string (FK → CurriculumTopic)
├── gradeLevel: 2
├── subject: "MATEMATIK"
├── topicName: string (ünite adı, denormalized)
├── question: string
├── option1-4: string (4 şık)
├── correctAnswer: 0-3
├── difficulty: "easy|medium|hard"
├── createdAt: DateTime
```

---

## 2. İş Akışı

### 2.1 PDF Parsing (Python)
```python
# 1. PDF'i oku (PyMuPDF)
# 2. Üniteleri tespit et ("Ünite 1", "Ünite 2", vb.)
# 3. Her ünite için "Sınav/Değerlendirme" bölümünü extract et
# 4. Soruları parse et (A/B/C/D şıkları ile)
# 5. JSON'a kaydet
```

### 2.2 Database Insert (Node.js API)
```typescript
// JSON'daki soruları iterate et
// Her soru için:
// - topicId: CurriculumTopic'ten bul (gradeLevel=2, subject=MATEMATIK, topicName match)
// - insert: db.levelAssessmentQuestion.create()
```

---

## 3. Output

**Dosya:** `grade2-math-questions.json`

```json
[
  {
    "unitNumber": 1,
    "unitName": "Sayılar (0-100)",
    "kitapNumber": 1,
    "questions": [
      {
        "question": "45 sayısında kaç tane onluk vardır?",
        "options": ["4", "5", "45", "9"],
        "correctAnswer": 0,
        "difficulty": "easy"
      },
      ...
    ]
  }
]
```

---

## 4. Success Criteria

✅ 2. Sınıf Matematik Kitap 1: X ünite × 10 soru  
✅ 2. Sınıf Matematik Kitap 2: Y ünite × 10 soru  
✅ Database'de LevelAssessmentQuestion'lar var (total Z)  
✅ Test interface'de sorular görünüyor (web test)  
✅ Mail gönderimi çalışıyor (eğitmene notification)
