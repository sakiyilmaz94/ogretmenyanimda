const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

(async () => {
  const themes = [
    "Nesnelerin Geometrisi",
    "Sayılar",
    "İşlemlerden Cebirsel Düşünmeye"
  ];

  console.log("📚 Tema Kontrol Raporu:\n");

  for (const themeName of themes) {
    const topic = await db.curriculumTopic.findFirst({
      where: {
        gradeLevel: 2,
        subject: "MATEMATIK",
        name: themeName
      }
    });

    if (!topic) {
      console.log(`❌ ${themeName} — Topic bulunamadı`);
      continue;
    }

    const count = await db.levelAssessmentQuestion.count({
      where: {
        topicId: topic.id,
        gradeLevel: 2,
        subject: "MATEMATIK"
      }
    });

    console.log(`✓ ${themeName}`);
    console.log(`  Topic ID: ${topic.id}`);
    console.log(`  Sorular: ${count}/10`);
    console.log();
  }

  await db.$disconnect();
})();
