const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

(async () => {
  const topic = await db.curriculumTopic.findFirst({
    where: { name: "Nesnelerin Geometrisi" }
  });

  const qs = await db.levelAssessmentQuestion.findMany({
    where: { topicId: topic.id },
    orderBy: { createdAt: "asc" },
  });

  console.log("Soruların şekil durumu:");
  qs.forEach((q, i) => {
    const hasImage = !!q.imageData;
    console.log(`${i + 1}. ${q.question.substring(0, 40)}... ${hasImage ? "✓ VAR" : "✗ YOK"}`);
  });

  await db.$disconnect();
})();
