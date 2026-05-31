/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");

const db = new PrismaClient();

(async () => {
  try {
    console.log("📚 Grade 4 Fen Bilimleri Soruları Yüklüyorum...\n");

    const questions = JSON.parse(
      fs.readFileSync("./grade4-science.json", "utf-8")
    );

    console.log(`✓ ${questions.length} soru JSON'dan okundu\n`);

    let inserted = 0;
    const themes = {};

    for (const q of questions) {
      const topic = await db.curriculumTopic.findFirst({
        where: {
          gradeLevel: 4,
          subject: "FEN_BİLİMLERİ",
          name: q.theme
        }
      });

      if (!topic) {
        console.log(`   ⚠️  Tema bulunamadı: ${q.theme}`);
        continue;
      }

      await db.levelAssessmentQuestion.create({
        data: {
          topicId: topic.id,
          gradeLevel: 4,
          subject: "FEN_BİLİMLERİ",
          topicName: q.theme,
          question: q.question,
          option1: q.option1,
          option2: q.option2,
          option3: q.option3,
          option4: q.option4,
          correctAnswer: q.correctAnswer,
          difficulty: q.difficulty
        }
      });

      inserted++;
      themes[q.theme] = (themes[q.theme] || 0) + 1;
    }

    console.log("\n" + "=".repeat(60));
    console.log("✅ GRADE 4 FEN BİLİMLERİ YÜKLEME TAMAMLANDI!");
    console.log("=".repeat(60));
    console.log(`\n📊 Tema Özeti:`);
    for (const [theme, count] of Object.entries(themes)) {
      console.log(`   • ${theme}: ${count} soru`);
    }
    console.log(`\n📈 Toplam: ${inserted} soru başarıyla yüklendi\n`);

    await db.$disconnect();
  } catch (error) {
    console.error("❌ Hata:", error);
    process.exit(1);
  }
})();
