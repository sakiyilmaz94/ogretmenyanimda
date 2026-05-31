/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

(async () => {
  try {
    console.log("🗑️  Grade 4 eski soruları siliniyor...\n");

    const deleted = await db.levelAssessmentQuestion.deleteMany({
      where: {
        gradeLevel: 4
      }
    });

    console.log(`✅ ${deleted.count} soru silindi\n`);
    await db.$disconnect();
  } catch (error) {
    console.error("❌ Hata:", error);
    process.exit(1);
  }
})();
