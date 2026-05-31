const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function testQuestions() {
  console.log("🧪 Grade 2 Matematik Soruları Test\n");

  // 1. "Nesnelerin Geometrisi" konusunu bul
  const topic = await db.curriculumTopic.findFirst({
    where: {
      gradeLevel: 2,
      subject: "MATEMATIK",
      name: "Nesnelerin Geometrisi"
    }
  });

  if (!topic) {
    console.log("❌ Konu bulunamadı!");
    await db.$disconnect();
    return;
  }

  console.log(`✓ Konu bulundu: ${topic.name} (ID: ${topic.id})\n`);

  // 2. Bu konuya ait soruları getir
  const questions = await db.levelAssessmentQuestion.findMany({
    where: {
      gradeLevel: 2,
      subject: "MATEMATIK",
      topicId: topic.id
    },
    take: 10
  });

  if (questions.length === 0) {
    console.log("❌ Sorular bulunamadı!");
    await db.$disconnect();
    return;
  }

  console.log(`✓ ${questions.length} soru bulundu\n`);

  // 3. Soruları göster
  console.log("📋 Sorular:\n");
  questions.forEach((q, i) => {
    console.log(`${i + 1}. ${q.question}`);
    if (q.option1) console.log(`   ✓ Cevap: ${q.option1}`);
    if (q.difficulty) console.log(`   Zorluk: ${q.difficulty}`);
    console.log();
  });

  // 4. Cevap anahtarını göster (sadece backend'de görülebilir)
  console.log("🔐 Cevap Anahtarı (sadece eğitimci/backend görür):\n");
  questions.forEach((q, i) => {
    console.log(`${i + 1}. correctAnswer: ${q.correctAnswer} (${q.option1})`);
  });

  console.log("\n✅ Test başarılı! Sorular database'de düzgün kaydedilmiş.");

  await db.$disconnect();
}

testQuestions().catch(console.error);
