/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");

const db = new PrismaClient();

(async () => {
  try {
    console.log("📚 Grade 2 Ek Soruları Yüklüyorum...\n");

    // Load questions from JSON
    const questions = JSON.parse(
      fs.readFileSync("./grade2-math-additional.json", "utf-8")
    );

    console.log(`✓ ${questions.length} soru JSON'dan okundu\n`);

    let inserted = 0;
    const themes = {};

    for (const q of questions) {
      // Find topic by theme name
      const topic = await db.curriculumTopic.findFirst({
        where: {
          gradeLevel: 2,
          subject: "MATEMATIK",
          name: q.theme
        }
      });

      if (!topic) {
        console.log(`   ⚠️  Tema bulunamadı: ${q.theme}`);
        continue;
      }

      // Insert question (ek soru olduğu için isUnique kontrol etmez)
      await db.levelAssessmentQuestion.create({
        data: {
          topicId: topic.id,
          gradeLevel: 2,
          subject: "MATEMATIK",
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

    // Print summary
    console.log("\n" + "=".repeat(60));
    console.log("✅ EK SORU YÜKLEME TAMAMLANDI!");
    console.log("=".repeat(60));
    console.log(`\n📊 Tema Özeti:`);
    for (const [theme, count] of Object.entries(themes)) {
      console.log(`   • ${theme}: ${count} soru`);
    }
    console.log(`\n📈 Toplam: ${inserted} ek soru başarıyla yüklendi\n`);

    await db.$disconnect();
  } catch (error) {
    console.error("❌ Hata:", error);
    process.exit(1);
  }
})();
