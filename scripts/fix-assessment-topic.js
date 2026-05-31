const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

(async () => {
  // Doğru topic'i bul
  const topic = await db.curriculumTopic.findFirst({
    where: {
      gradeLevel: 2,
      subject: "MATEMATIK",
      name: "Nesnelerin Geometrisi"
    }
  });

  if (!topic) {
    console.log("❌ Topic bulunamadı");
    await db.$disconnect();
    return;
  }

  // Assessment'ı update et
  const updated = await db.levelAssessment.update({
    where: { id: "cmptwy31i0005jl04ctd7orfo" },
    data: { topicId: topic.id }
  });

  console.log("✓ Assessment güncellendi!");
  console.log(`  Topic adı: ${topic.name}`);
  console.log(`  Topic ID: ${topic.id}`);

  // Doğrulama
  const assessment = await db.levelAssessment.findUnique({
    where: { id: "cmptwy31i0005jl04ctd7orfo" },
    include: { topic: true }
  });

  const questions = await db.levelAssessmentQuestion.findMany({
    where: {
      gradeLevel: 2,
      subject: "MATEMATIK",
      topicId: assessment.topicId || undefined,
    },
    take: 10,
  });

  console.log(`  Sorular: ${questions.length} bulundu`);

  await db.$disconnect();
})();
