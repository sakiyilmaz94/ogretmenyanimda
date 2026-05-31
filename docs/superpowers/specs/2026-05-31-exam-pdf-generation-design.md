# Sınav PDF Üretimi — Tasarım Spec

**Tarih:** 2026-05-31  
**Görev:** Eğitim Kitaplığı PDF'lerinden sınav sorularını extract edip, profesyonel sınav PDF'leri + cevap anahtarı PDF'leri oluştur

---

## 1. Problem Tanımı

Eğitim Kitaplığı MEB ders kitaplarında **her ünite için sınav soruları** var. Bunları extract edip, professional PDF'ler oluşturmalıyız.

**Target:**
- Grade 2-8 (Grade 1 hariç)
- Tüm dersler (Türkçe, Matematik, Fen, Sosyal Bilgiler, İngilizce, vb.)
- Her ünite için: Sınav PDF + Cevap Anahtarı PDF

---

## 2. Workflow

### 2.1 Input
**Eğitim Kitaplık/ders kitapları** klasöründeki PDF'ler
- Örn: `2. Sınıf Matematik Ders Kitabı 1. Kitap.pdf`

### 2.2 Processing
1. PDF'i oku
2. Üniteleri tespit et (kitabın içinde "Ünite 1", "Ünite 2", vb.)
3. Her ünitenin sınav bölümünü extract et
4. Soruları parse et (soru metni + seçenekler + cevap)

### 2.3 Output
**Lokal klasör (Phase 1):** `./Eğitim Kitaplık/Sınavlar/`

```
Eğitim Kitaplık/Sınavlar/
├── 2.Sinif-Matematik/
│   ├── 2.Sinif-Matematik-1.Kitap-Unite-1-Sinav.pdf
│   ├── 2.Sinif-Matematik-1.Kitap-Unite-1-Cevap-Anahtari.pdf
│   ├── 2.Sinif-Matematik-1.Kitap-Unite-2-Sinav.pdf
│   ├── 2.Sinif-Matematik-1.Kitap-Unite-2-Cevap-Anahtari.pdf
│   └── ...
├── 2.Sinif-Turkce/
│   └── ...
```

**Supabase Storage (Phase 2):** Lokal test'ler başarılı olunca

---

## 3. PDF Format Spesifikasyonu

### 3.1 Sınav PDF
**Layout:**
```
┌─────────────────────────────────────┐
│  SEVIYE TESPİT SINAVI              │
│  2. Sınıf Matematik - Ünite 1      │
│  Öğrenci Adı: _________________    │
│  Tarih: _________________          │
└─────────────────────────────────────┘

1. [Soru 1 metni]
   A) [Şık 1]
   B) [Şık 2]
   C) [Şık 3]
   D) [Şık 4]

2. [Soru 2 metni]
   A) [Şık 1]
   ...

[10 soruya kadar]

─────────────────────────────────────
Toplam Puan: _____ / 100
```

**Styling:**
- Font: Arial, 11pt
- Satır aralığı: 1.5
- Sayfa: A4
- Margin: 2.5cm
- Profesyonel, clean, basit

### 3.2 Cevap Anahtarı PDF
**Layout:**
```
┌─────────────────────────────────────┐
│  CEVAP ANAHTARI                     │
│  2. Sınıf Matematik - Ünite 1      │
│  (Eğitimci için)                   │
└─────────────────────────────────────┘

1. Doğru Cevap: C
   Açıklama: [Kısa açıklama/gerekçe]

2. Doğru Cevap: A
   Açıklama: [...]

3. Doğru Cevap: B
   Açıklama: [...]

─────────────────────────────────────
Puanlama:
- Her soru: 10 puan
- Toplam: 100 puan
```

---

## 4. Data Extraction

### 4.1 PDF Read
**Tool:** `pdf-parse` / `pdfjs-dist` (Node.js)
- PDF'yi text olarak oku
- Üniteleri tespit et (regex: "Ünite \d+", "Bölüm \d+", vb.)
- Sınav bölümünü bul (regex: "Sınav|Değerlendirme|Test")

### 4.2 Question Parsing
**Pattern:**
```
Soru 1: [Metin]
A) [Şık]
B) [Şık]
C) [Şık]
D) [Şık]
Cevap: [A|B|C|D]

Soru 2: ...
```

**Fallback:** Eğer otomatik parse başarısız olursa, manual review gerekli.

---

## 5. PDF Generation

### 5.1 Library
- **Node.js:** `pdfkit` / `puppeteer`
- `pdfkit`: Lightweight, fast, programmatic
- `puppeteer`: HTML → PDF, daha flexible

**Seçim:** `pdfkit` (hızlı, bağımlılık az)

### 5.2 Generation Script
```typescript
// scripts/generate-exam-pdfs.ts
async function generateExamPDFs() {
  const pdfFiles = getAllPDFsInEducationLibrary();
  
  for (const pdfFile of pdfFiles) {
    // Skip Grade 1
    if (pdfFile.includes("1.sınıf")) continue;
    
    // Extract units and questions
    const units = await extractUnits(pdfFile);
    
    for (const unit of units) {
      const questions = unit.questions;
      
      // Generate exam PDF
      await generateExamPDF(
        `${pdfFile.name}-${unit.number}-Sinav.pdf`,
        questions
      );
      
      // Generate answer key PDF
      await generateAnswerKeyPDF(
        `${pdfFile.name}-${unit.number}-Cevap-Anahtari.pdf`,
        questions
      );
    }
  }
}
```

---

## 6. Storage Integration

### 6.1 Supabase Storage
Path: `Eğitim Kitaplık/Sınavlar/[Sınıf]/[Ders]/[Sınav PDF]`

```bash
# Supabase Storage setup
sb = await supabase.storage.from('documents').upload(
  `Eğitim Kitaplık/Sınavlar/2.Sinif-Matematik/2.Sinif-Matematik-1.Kitap-Unite-1-Sinav.pdf`,
  pdfBuffer
)
```

### 6.2 Database Record
**Tablo:** `ExamPDF` (yeni)

```prisma
model ExamPDF {
  id          String   @id @default(cuid())
  gradeLevel  Int      // 2
  subject     String   // "MATEMATIK"
  unitNumber  Int      // 1
  kitapNumber Int      // 1 (1. Kitap, 2. Kitap, vb.)
  
  examPdfUrl     String   // Supabase URL
  answerKeyUrl   String   // Supabase URL
  
  questionCount  Int      // 10 (genellikle)
  createdAt      DateTime @default(now())
  
  @@unique([gradeLevel, subject, unitNumber, kitapNumber])
}
```

---

## 7. Success Criteria

✅ 2. Sınıf Matematik:
- Kitap 1: [Ünite sayısı] × 2 PDF (sınav + cevap)
- Kitap 2: [Ünite sayısı] × 2 PDF (sınav + cevap)

✅ Sınav PDF'ler:
- Professional, clean layout
- 10 soru (ya da daha az, üniteye göre)
- Öğrenci yazacak alanlar var

✅ Cevap Anahtarı PDF'ler:
- Doğru cevaplar açık
- Kısa açıklamalar
- Eğitimci için uygun

✅ Supabase Storage'da organize
✅ Database record'ları oluşturuldu

---

## 8. Next Steps

- Grade 2 diğer dersler (Türkçe, vb.)
- Grade 3-8 tüm dersler
- Assessment flow update (DB'den sınav PDF link'i ver)
