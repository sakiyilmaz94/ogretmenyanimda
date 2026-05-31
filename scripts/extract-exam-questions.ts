import * as fs from "fs-extra";
import * as pdfParse from "pdf-parse";
import * as path from "path";

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

async function extractExamsFromPDF(
  pdfPath: string,
  gradeLevel: number,
  subject: string,
  kitapNumber: number
): Promise<UnitExam[]> {
  console.log(`\n📖 ${path.basename(pdfPath)} okunuyor...`);

  try {
    const pdfBuffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(pdfBuffer);
    const text = data.text;

    console.log(`   PDF okuma başarılı (${data.numpages} sayfa)`);

    const units: UnitExam[] = [];

    // Üniteleri tespit et: "Ünite 1", "ÜNITE 1", "Unite 1" vb.
    const unitPattern = /(?:Ünite|ÜNITE|Unite|UNITE)\s*(\d+)/gim;
    const unitMatches: RegExpExecArray[] = [];
    let match: RegExpExecArray | null;
    const pattern = new RegExp(unitPattern.source, unitPattern.flags);
    while ((match = pattern.exec(text)) !== null) {
      unitMatches.push(match);
    }

    console.log(`   Bulunan ünite: ${unitMatches.length}`);

    for (let i = 0; i < unitMatches.length; i++) {
      const match = unitMatches[i];
      const unitNumber = parseInt(match[1]);

      // Ünite başlangıç ve bitişini belirle
      const startIndex = match.index || 0;
      const nextUnitIndex =
        i + 1 < unitMatches.length
          ? unitMatches[i + 1].index || 0
          : text.length;

      const unitText = text.substring(startIndex, nextUnitIndex);

      // Sınav/Değerlendirme bölümünü bul
      const examPattern =
        /(?:Sınav|SINAV|Değerlendirme|DEĞERLENDİRME|Test|TEST|Çalışma Sayfası)[\s\S]*?(?=(?:Ünite|ÜNITE|Unite|UNITE)|\d+\.\s+Sınıf|$)/i;
      const examMatch = unitText.match(examPattern);

      if (!examMatch) {
        console.log(`   ⊘ Ünite ${unitNumber}: Sınav bölümü bulunamadı`);
        continue;
      }

      const examText = examMatch[0];
      const questions = parseExamQuestions(examText);

      if (questions.length > 0) {
        units.push({
          unitNumber,
          questions,
        });
        console.log(
          `   ✓ Ünite ${unitNumber}: ${questions.length} soru bulundu`
        );
      } else {
        console.log(`   ⊘ Ünite ${unitNumber}: Soru parse edilemedi`);
      }
    }

    return units;
  } catch (error) {
    console.error(`   ❌ Hata: ${error}`);
    return [];
  }
}

function parseExamQuestions(examText: string): ExamQuestion[] {
  const questions: ExamQuestion[] = [];

  // Soru bulma pattern: "1.", "2.", vb.
  const questionPattern = /(\d+)\.\s*(.+?)(?=\d+\.\s|$)/gim;

  let match;
  let questionCount = 0;
  const qPattern = new RegExp(questionPattern.source, questionPattern.flags);

  while ((match = qPattern.exec(examText)) !== null && questionCount < 15) {
    const questionText = match[2].trim();

    // Şık parsing: A) ... B) ... C) ... D) ...
    const optionPattern = /([A-D])\)\s*(.+?)(?=[A-D]\)|$)/gim;
    const options: string[] = [];
    let optMatch;
    const oPattern = new RegExp(optionPattern.source, optionPattern.flags);

    while ((optMatch = oPattern.exec(questionText)) !== null) {
      const optionText = optMatch[2].trim().split('\n')[0]; // İlk satırı al
      options.push(optionText);
    }

    // Sadece 4 şık olan soruları al
    if (options.length === 4) {
      questions.push({
        number: questionCount + 1,
        question: questionText
          .split(/[A-D]\)/)[0]
          .trim()
          .replace(/\s+/g, " "),
        options: options.map((o) => o.replace(/\s+/g, " ")),
        correctAnswer: "", // Manual review
        explanation: "",
      });
      questionCount++;
    }
  }

  return questions.slice(0, 10); // Max 10 soru per ünite
}

async function main() {
  try {
    console.log("🚀 2. Sınıf Matematik Sınav Extraction Başladı");
    console.log("=".repeat(50));

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
      if (!fs.existsSync(file.path)) {
        console.log(`\n❌ Dosya bulunamadı: ${file.path}`);
        continue;
      }

      const exams = await extractExamsFromPDF(
        file.path,
        file.grade,
        file.subject,
        file.kitap
      );

      if (exams.length === 0) {
        console.log(`   ⚠️ Hiçbir sınav bulunamadı`);
        continue;
      }

      // JSON'a kaydet
      const outputPath = `exams-${file.grade}-${file.subject}-${file.kitap}.json`;
      fs.writeJsonSync(outputPath, exams, { spaces: 2 });
      console.log(`   📄 JSON kaydedildi: ${outputPath}`);
    }

    console.log("\n" + "=".repeat(50));
    console.log("✅ Extraction tamamlandı!");
    console.log("\n⚠️  ÖNEMLİ: JSON dosyalarını açıp doğru cevapları (@correctAnswer) kontrol edin!");
  } catch (error) {
    console.error("❌ Hata:", error);
    process.exit(1);
  }
}

main();
