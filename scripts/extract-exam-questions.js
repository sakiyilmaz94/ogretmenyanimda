const fs = require("fs-extra");
const pdfParse = require("pdf-parse/lib/pdf-parse.js");
const path = require("path");

async function extractExamsFromPDF(pdfPath, gradeLevel, subject, kitapNumber) {
  console.log(`\n📖 ${path.basename(pdfPath)} okunuyor...`);

  try {
    const pdfBuffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(pdfBuffer);
    const text = data.text;

    console.log(`   PDF okuma başarılı (${data.numpages} sayfa)`);

    const units = [];

    // Üniteleri tespit et
    const unitPattern = /(?:Ünite|ÜNITE|Unite|UNITE)\s*(\d+)/gim;
    let match;
    const unitMatches = [];

    while ((match = unitPattern.exec(text)) !== null) {
      unitMatches.push(match);
    }

    console.log(`   Bulunan ünite: ${unitMatches.length}`);

    for (let i = 0; i < unitMatches.length; i++) {
      const match = unitMatches[i];
      const unitNumber = parseInt(match[1]);

      const startIndex = match.index;
      const nextUnitIndex =
        i + 1 < unitMatches.length ? unitMatches[i + 1].index : text.length;

      const unitText = text.substring(startIndex, nextUnitIndex);

      // Sınav bölümünü bul
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
    console.error(`   ❌ Hata: ${error.message}`);
    return [];
  }
}

function parseExamQuestions(examText) {
  const questions = [];

  // Soru bulma
  const questionPattern = /(\d+)\.\s*(.+?)(?=\d+\.\s|$)/gim;
  let match;

  let questionCount = 0;
  while ((match = questionPattern.exec(examText)) !== null && questionCount < 15) {
    const questionText = match[2].trim();

    // Şık bulma
    const optionPattern = /([A-D])\)\s*(.+?)(?=[A-D]\)|$)/gim;
    const options = [];
    let optMatch;

    while ((optMatch = optionPattern.exec(questionText)) !== null) {
      const optionText = optMatch[2].trim().split("\n")[0];
      options.push(optionText);
    }

    // 4 şık olan soruları al
    if (options.length === 4) {
      questions.push({
        number: questionCount + 1,
        question: questionText
          .split(/[A-D]\)/)[0]
          .trim()
          .replace(/\s+/g, " "),
        options: options.map((o) => o.replace(/\s+/g, " ")),
        correctAnswer: "",
        explanation: "",
      });
      questionCount++;
    }
  }

  return questions.slice(0, 10);
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

      const outputPath = `exams-${file.grade}-${file.subject}-${file.kitap}.json`;
      fs.writeJsonSync(outputPath, exams, { spaces: 2 });
      console.log(`   📄 JSON kaydedildi: ${outputPath}`);
    }

    console.log("\n" + "=".repeat(50));
    console.log("✅ Extraction tamamlandı!");
    console.log(
      "\n⚠️  ÖNEMLİ: JSON dosyalarını açıp doğru cevapları (@correctAnswer) kontrol edin!"
    );
  } catch (error) {
    console.error("❌ Hata:", error.message);
    process.exit(1);
  }
}

main();
