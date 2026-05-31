const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

(async () => {
  const topic = await db.curriculumTopic.findFirst({
    where: { name: "Nesnelerin Geometrisi" }
  });

  if (!topic) {
    console.log("Topic bulunamadı");
    await db.$disconnect();
    return;
  }

  const q = await db.levelAssessmentQuestion.findFirst({
    where: { topicId: topic.id }
  });

  if (!q) {
    console.log("Soru bulunamadı");
  } else {
    console.log("Soru bulundu:");
    console.log("  ID:", q.id);
    console.log("  Question:", q.question.substring(0, 50));
    console.log("  ImageData:", q.imageData ? `Var (${q.imageData.length} bytes)` : "Yok");
    console.log("  ImageFormat:", q.imageFormat);
  }

  await db.$disconnect();
})();
