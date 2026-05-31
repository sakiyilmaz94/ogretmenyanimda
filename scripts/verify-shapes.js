const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

(async () => {
  const topic = await db.curriculumTopic.findFirst({
    where: { name: "Nesnelerin Geometrisi" }
  });

  const qs = await db.levelAssessmentQuestion.findMany({
    where: { topicId: topic.id },
    orderBy: { createdAt: "asc" },
    take: 10,
  });

  console.log("📊 Şekil Kontrol Raporu:\n");
  let withShapes = 0;

  qs.forEach((q, i) => {
    const hasShape = !!q.imageData;
    const shapeType = q.imageFormat || "none";
    const sizeKB = q.imageData ? (q.imageData.length / 1024).toFixed(1) : "0";

    if (hasShape) withShapes++;

    console.log(`${i + 1}. ${hasShape ? "✓" : "✗"} [${shapeType}] ${sizeKB}KB`);
    console.log(`   Soru: ${q.question.substring(0, 50)}...`);
  });

  console.log(`\n✅ Özet: ${withShapes}/10 soruda şekil var`);
  await db.$disconnect();
})();
