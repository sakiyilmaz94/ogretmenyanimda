const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

// DB'deki yanlış (Türkçe/enum-dışı) subject değerlerini Prisma Subject enum'una eşle
const MAPPINGS = [
  { from: "FEN_BİLİMLERİ", to: "FEN_BILIMLERI" },
  { from: "SOSYAL_BİLGİLER", to: "SOSYAL_BILGILER" },
  { from: "TC_INKILAP_TARIHI", to: "INKILAP_TARIHI" },
  { from: "TÜRKÇE", to: "TURKCE" },
];

(async () => {
  console.log("🔧 Subject enum normalizasyonu başlıyor...\n");

  for (const { from, to } of MAPPINGS) {
    const topics = await db.curriculumTopic.updateMany({
      where: { subject: from },
      data: { subject: to },
    });
    const questions = await db.levelAssessmentQuestion.updateMany({
      where: { subject: from },
      data: { subject: to },
    });
    console.log(
      `   ${from} → ${to}  |  konu: ${topics.count}, soru: ${questions.count}`
    );
  }

  console.log("\n📊 Güncel CurriculumTopic.subject değerleri:");
  const topicGroups = await db.curriculumTopic.groupBy({
    by: ["subject"],
    _count: true,
    orderBy: { subject: "asc" },
  });
  for (const g of topicGroups) {
    console.log(`   • ${g.subject}: ${g._count}`);
  }

  console.log("\n📊 Güncel LevelAssessmentQuestion.subject değerleri:");
  const qGroups = await db.levelAssessmentQuestion.groupBy({
    by: ["subject"],
    _count: true,
    orderBy: { subject: "asc" },
  });
  for (const g of qGroups) {
    console.log(`   • ${g.subject}: ${g._count}`);
  }

  console.log("\n✅ Tamamlandı!");
  process.exit(0);
})();
