const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

(async () => {
  // Test assessment bulma
  const assessment = await db.levelAssessment.findUnique({
    where: { id: "cmptwy31i0005jl04ctd7orfo" },
    include: { topic: true, booking: { include: { student: true } } }
  });

  if (!assessment) {
    console.log("❌ Assessment bulunamadı");
  } else {
    console.log("✓ Assessment bulundu:");
    console.log("  ID:", assessment.id);
    console.log("  Status:", assessment.status);
    console.log("  Subject:", assessment.subject);
    console.log("  GradeLevel:", assessment.gradeLevel);
    console.log("  TopicId:", assessment.topicId);
    console.log("  Topic:", assessment.topic?.name);
    console.log("  Student:", assessment.booking?.student?.name);

    // Soruları kontrol et
    const gradeMap = { ILKOKUL_1: 1, ILKOKUL_2: 2, ILKOKUL_3: 3, ILKOKUL_4: 4, ORTAOKUL_5: 5, ORTAOKUL_6: 6, ORTAOKUL_7: 7, ORTAOKUL_8: 8 };
    const gradeNumber = gradeMap[assessment.gradeLevel] || 2;

    const questions = await db.levelAssessmentQuestion.findMany({
      where: {
        gradeLevel: gradeNumber,
        subject: assessment.subject,
        topicId: assessment.topicId || undefined,
      },
      take: 10,
    });

    console.log(`\n  Sorular: ${questions.length} bulundu`);
  }

  await db.$disconnect();
})();
