/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

const SOCIAL_TOPICS = [
  "5. Ünite: Üretim, Dağıtım ve Tüketim",
  "6. Ünite: Etkin Vatandaşlık",
  "7. Ünite: Küresel Bağlantılar"
];

(async () => {
  try {
    console.log("📚 Grade 4 Sosyal Bilgiler Konuları Oluşturuluyor...\n");

    let created = 0;

    for (const topicName of SOCIAL_TOPICS) {
      const existing = await db.curriculumTopic.findFirst({
        where: {
          gradeLevel: 4,
          subject: "SOSYAL_BİLGİLER",
          name: topicName
        }
      });

      if (!existing) {
        await db.curriculumTopic.create({
          data: {
            gradeLevel: 4,
            subject: "SOSYAL_BİLGİLER",
            name: topicName,
            description: topicName
          }
        });
        console.log(`   ✓ Oluşturuldu: [SOSYAL_BİLGİLER] ${topicName}`);
        created++;
      } else {
        console.log(`   - Zaten var: [SOSYAL_BİLGİLER] ${topicName}`);
      }
    }

    console.log(`\n✅ ${created} yeni konu oluşturuldu!\n`);
    await db.$disconnect();
  } catch (error) {
    console.error("❌ Hata:", error);
    process.exit(1);
  }
})();
