/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");

const db = new PrismaClient();

(async () => {
  try {
    console.log("📚 Grade 7 Türkçe Soruları Yüklüyorum...\n");

    const questions = JSON.parse(
      fs.readFileSync("./grade7-turkce.json", "utf-8")
    );

    console.log(`✓ ${questions.length} soru JSON'dan okundu\n`);

    let inserted = 0;
    const themes = {};

    for (const q of questions) {
      const topic = await db.curriculumTopic.findFirst({
        where: {
          gradeLevel: 7,
          subject: "TURKCE",
          name: q.theme,
        },
      });

      if (!topic) {
        console.log(`   ⚠️  Tema bulunamadı: ${q.theme}`);
        continue;
      }

      await db.levelAssessmentQuestion.create({
        data: {
          topicId: topic.id,
          gradeLevel: 7,
          subject: "TURKCE",
          topicName: q.theme,
          question: q.question,
          option1: q.option1,
          option2: q.option2,
          option3: q.option3,
          option4: q.option4,
          correctAnswer: q.correctAnswer - 1, // kaynak 1-based -> 0-based index
          difficulty: q.difficulty,
        },
      });

      inserted++;
      themes[q.theme] = (themes[q.theme] || 0) + 1;
    }

    console.log("\n" + "=".repeat(60));
    console.log("✅ GRADE 7 TÜRKÇE YÜKLEME TAMAMLANDI!");
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
