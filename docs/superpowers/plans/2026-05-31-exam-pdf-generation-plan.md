# Sınav PDF Üretimi — Implementasyon Planı

**Tarih:** 2026-05-31  
**Phase 1:** Lokal klasör oluşturma + 2. Sınıf Matematik testi  
**Phase 2:** Diğer sınıflar + Supabase transfer  
**Spec:** `docs/superpowers/specs/2026-05-31-exam-pdf-generation-design.md`

---

## Phase 1: 2. Sınıf Matematik (Lokal Test)

### Adım 1: Klasör Yapısını Oluştur
```bash
mkdir -p "Eğitim Kitaplık/Sınavlar/2.Sinif-Matematik"
```

### Adım 2: PDF Extraction Script
**File:** `scripts/extract-exam-questions.ts`

**Görev:** 2. Sınıf Matematik Kitap 1 & 2 PDF'lerinden sınavları extract et

```typescript
import fs from "fs-extra";
import * as pdfParse from "pdf-parse";

interface ExamQuestion {
  number: number;
  question: string;
  options: string[]; // A, B, C, D
  correctAnswer: string;
  explanation?: string;
}

interface UnitExam {
  unitNumber: number;
  questions: ExamQuestion[];
}

async function extractExamsFromPDF(
  pdfPath: string,
  gradeLevel: number,
  subject: string,
  kitapNumber: number
): Promise<UnitExam[]> {
  console.log(`📖 ${pdfPath} okunuyor...`);

  // PDF'yi oku
  const pdfBuffer = fs.readFileSync(pdfPath);
  const data = await pdfParse(pdfBuffer);
  const text = data.text;

  // Üniteleri tespit et (regex: "Ünite 1", "Ünite 2", vb.)
  const unitPattern = /Ünite\s+(\d+)/gi;
  const units: UnitExam[] = [];
  let unitNumber = 1;

  // Her üniteyi parse et
  const unitMatches = text.matchAll(unitPattern);
  for (const match of unitMatches) {
    unitNumber = parseInt(match[1]);

    // Sınav bölümünü bul
    const startIndex = match.index || 0;
    const nextUnitMatch = text.indexOf(
      `Ünite ${unitNumber + 1}`,
      startIndex + 10
    );
    const unitText = text.substring(
      startIndex,
      nextUnitMatch > 0 ? nextUnitMatch : text.length
    );

    // Sınavı extract et (sınav bölümünü bul)
    const examMatch = unitText.match(
      /(?:Sınav|Değerlendirme|Test)[\s\S]*?(?=Ünite|$)/i
    );
    if (!examMatch) {
      console.log(`   ⊘ Ünite ${unitNumber}: Sınav bulunamadı`);
      continue;
    }

    const examText = examMatch[0];
    const questions = parseExamQuestions(examText);

    if (questions.length > 0) {
      units.push({
        unitNumber,
        questions,
      });
      console.log(`   ✓ Ünite ${unitNumber}: ${questions.length} soru`);
    }
  }

  return units;
}

function parseExamQuestions(examText: string): ExamQuestion[] {
  const questions: ExamQuestion[] = [];
  const questionPattern =
    /(\d+)\.\s*(.+?)(?:A\)|$)([\s\S]*?)(?=\d+\.|$)/g;

  let match;
  while ((match = questionPattern.exec(examText)) !== null) {
    const number = parseInt(match[1]);
    const question = match[2].trim();
    const optionsText = match[3];

    // Şıkları parse et (A, B, C, D)
    const optionPattern = /([A-D])\)\s*(.+?)(?=[A-D]\)|$)/g;
    const options: string[] = [];
    let optMatch;

    while ((optMatch = optionPattern.exec(optionsText)) !== null) {
      options.push(optMatch[2].trim());
    }

    if (options.length === 4) {
      questions.push({
        number,
        question,
        options,
        correctAnswer: "", // Manual review gerekli
      });
    }
  }

  return questions;
}

async function main() {
  try {
    console.log("🚀 2. Sınıf Matematik Sınav Extraction Başladı\n");

    const pdfFiles = [
      {
        path: "Eğitim Kitaplık/ders kitapları/2. Sınıf Matematik Ders Kitabı 1. Kitap .pdf",
        grade: 2,
        subject: "MATEMATIK",
        kitap: 1,
      },
      {
        path: "Eğitim Kitaplık/ders kitapları/2. Sınıf Matematik Ders Kitabı 2. Kitap .pdf",
        grade: 2,
        subject: "MATEMATIK",
        kitap: 2,
      },
    ];

    for (const file of pdfFiles) {
      const exams = await extractExamsFromPDF(
        file.path,
        file.grade,
        file.subject,
        file.kitap
      );
      console.log(`   Total: ${exams.length} ünite sınavı\n`);

      // Exams'ı JSON'a kaydet (review için)
      const outputPath = `exams-${file.grade}-${file.subject}-${file.kitap}.json`;
      fs.writeJsonSync(outputPath, exams, { spaces: 2 });
      console.log(`   JSON saved: ${outputPath}`);
    }

    console.log("\n✅ Extraction tamamlandı!");
  } catch (error) {
    console.error("❌ Hata:", error);
    process.exit(1);
  }
}

main();
```

**Çalıştırma:**
```bash
npx ts-node scripts/extract-exam-questions.ts
```

### Adım 3: Manual Review (Critical)
**Output:** `exams-2-MATEMATIK-1.json` ve `exams-2-MATEMATIK-2.json`

Dosyaları oku ve verify et:
- [ ] Her soru tamlı̣̈ysa (question + 4 options)
- [ ] Doğru cevapları ekle (`correctAnswer: "A"` şeklinde)
- [ ] Açıklamalar ekle (optional, ama iyiyse ekle)

---

### Adım 4: PDF Generation Script
**File:** `scripts/generate-exam-pdfs.ts`

```typescript
import PDFDocument from "pdfkit";
import fs from "fs-extra";

interface ExamQuestion {
  number: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

interface UnitExam {
  unitNumber: number;
  questions: ExamQuestion[];
}

async function generateExamPDF(
  unitExam: UnitExam,
  gradeLevel: number,
  subject: string,
  kitapNumber: number,
  outputDir: string
) {
  const filename = `${gradeLevel}.Sinif-${subject}-${kitapNumber}.Kitap-Unite-${unitExam.unitNumber}-Sinav.pdf`;
  const filepath = `${outputDir}/${filename}`;

  const doc = new PDFDocument({ margin: 40 });
  const stream = fs.createWriteStream(filepath);
  doc.pipe(stream);

  // Header
  doc.fontSize(16).font("Helvetica-Bold").text("SEVIYE TESPİT SINAVI", {
    align: "center",
  });
  doc
    .fontSize(12)
    .font("Helvetica")
    .text(
      `${gradeLevel}. Sınıf ${subject} - Ünite ${unitExam.unitNumber}`,
      { align: "center" }
    );
  doc.moveDown(0.5);

  doc
    .fontSize(10)
    .text(`Öğrenci Adı: _________________________________`);
  doc.text(`Tarih: _________________________________`);
  doc.moveDown(1);

  // Questions
  unitExam.questions.forEach((q, idx) => {
    doc
      .fontSize(11)
      .font("Helvetica-Bold")
      .text(`${idx + 1}. ${q.question}`, { width: 450 });
    doc.moveDown(0.3);

    doc.fontSize(10).font("Helvetica");
    q.options.forEach((opt, i) => {
      const letter = String.fromCharCode(65 + i); // A, B, C, D
      doc.text(`   ${letter}) ${opt}`);
    });
    doc.moveDown(0.5);
  });

  doc.moveDown(1);
  doc
    .fontSize(10)
    .text("─".repeat(50));
  doc.fontSize(10).text("Toplam Puan: _____ / 100");

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on("finish", () => {
      console.log(`   ✓ ${filename}`);
      resolve(filepath);
    });
    stream.on("error", reject);
  });
}

async function generateAnswerKeyPDF(
  unitExam: UnitExam,
  gradeLevel: number,
  subject: string,
  kitapNumber: number,
  outputDir: string
) {
  const filename = `${gradeLevel}.Sinif-${subject}-${kitapNumber}.Kitap-Unite-${unitExam.unitNumber}-Cevap-Anahtari.pdf`;
  const filepath = `${outputDir}/${filename}`;

  const doc = new PDFDocument({ margin: 40 });
  const stream = fs.createWriteStream(filepath);
  doc.pipe(stream);

  // Header
  doc.fontSize(16).font("Helvetica-Bold").text("CEVAP ANAHTARI", {
    align: "center",
  });
  doc
    .fontSize(12)
    .font("Helvetica")
    .text(
      `${gradeLevel}. Sınıf ${subject} - Ünite ${unitExam.unitNumber}`,
      { align: "center" }
    );
  doc.fontSize(10).font("Helvetica-Oblique").text("(Eğitimci için)", {
    align: "center",
  });
  doc.moveDown(1);

  // Answer keys
  unitExam.questions.forEach((q, idx) => {
    doc
      .fontSize(11)
      .font("Helvetica-Bold")
      .text(`${idx + 1}. Doğru Cevap: ${q.correctAnswer}`);

    if (q.explanation) {
      doc.fontSize(10).font("Helvetica").text(`   Açıklama: ${q.explanation}`);
    }

    doc.moveDown(0.5);
  });

  doc.moveDown(1);
  doc
    .fontSize(10)
    .text("─".repeat(50));
  doc.fontSize(10).text("Puanlama: Her soru 10 puan (Toplam: 100 puan)");

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on("finish", () => {
      console.log(`   ✓ ${filename}`);
      resolve(filepath);
    });
    stream.on("error", reject);
  });
}

async function main() {
  try {
    console.log(
      "🎯 2. Sınıf Matematik Sınav PDF'leri Oluşturuluyor...\n"
    );

    const examDataFiles = [
      { path: "exams-2-MATEMATIK-1.json", kitap: 1 },
      { path: "exams-2-MATEMATIK-2.json", kitap: 2 },
    ];

    const outputDir = "Eğitim Kitaplık/Sınavlar/2.Sinif-Matematik";
    fs.ensureDirSync(outputDir);

    for (const dataFile of examDataFiles) {
      if (!fs.existsSync(dataFile.path)) {
        console.log(`⊘ ${dataFile.path} bulunamadı`);
        continue;
      }

      const exams = fs.readJsonSync(dataFile.path) as UnitExam[];
      console.log(`📄 ${dataFile.path} (${exams.length} ünite):`);

      for (const exam of exams) {
        await generateExamPDF(
          exam,
          2,
          "MATEMATIK",
          dataFile.kitap,
          outputDir
        );
        await generateAnswerKeyPDF(
          exam,
          2,
          "MATEMATIK",
          dataFile.kitap,
          outputDir
        );
      }
    }

    console.log("\n✅ PDF'ler oluşturuldu!");
    console.log(`📁 Lokasyon: ${outputDir}`);
  } catch (error) {
    console.error("❌ Hata:", error);
    process.exit(1);
  }
}

main();
```

**Gerekli paket:** `pdfkit`
```bash
npm install pdfkit
npm install --save-dev @types/pdfkit
```

**Çalıştırma:**
```bash
npx ts-node scripts/generate-exam-pdfs.ts
```

---

### Adım 5: Verification
```bash
# Oluşturulan PDF'leri kontrol et
ls -la "Eğitim Kitaplık/Sınavlar/2.Sinif-Matematik/"
```

**Checklist:**
- [ ] 2. Sınıf Matematik 1. Kitap: X ünite × 2 PDF (sınav + cevap)
- [ ] 2. Sınıf Matematik 2. Kitap: Y ünite × 2 PDF (sınav + cevap)
- [ ] PDF'ler açılıyor ve okunaklı

---

## Phase 2: Diğer Sınıflar (Future)
- Grade 2 Türkçe
- Grade 3-8 tüm dersler
- Supabase'e upload

---

## Timeline

| Görev | Süre |
|-------|------|
| Extraction script | 30 min |
| PDF extraction | 15 min |
| Manual review | 30 min |
| PDF generation script | 30 min |
| PDF creation | 10 min |
| Verification | 10 min |
| **Total** | **2.5 saat** |

---

## Notes

⚠️ **Critical:**
- PDF extract işlemi regex'e bağlı, manual review şart
- Doğru cevapları (A/B/C/D) manuel olarak doğrulamak gerekli
- Açıklamalar (explanation) optional ama iyiyse ekle
