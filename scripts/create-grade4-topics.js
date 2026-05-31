/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

const MATH_TOPICS = [
  "3. Ünite: Ölçme",
  "4. Ünite: Geometri ve Uzamsal İlişkiler",
  "5. Ünite: Veri ve Olasılık"
];

const SCIENCE_TOPICS = [
  "3. Ünite: Kuvvetin Etkileri",
  "4. Ünite: Maddenin Özellikleri",
  "5. Ünite: Aydınlatma ve Ses Teknolojileri",
  "6. Ünite: İnsan ve Çevre",
  "7. Ünite: Basit Elektrik Devreleri"
];

const SOCIAL_TOPICS = [
  "3. Ünite: İnsanlar, Yerler ve Çevreler",
  "4. Ünite: Bilim, Teknoloji ve Toplum"
];

(async () => {
  try {
    console.log("📚 Grade 4 Konuları Oluşturuluyor...\n");

    let created = 0;

    // Create Matematik topics
    for (const topicName of MATH_TOPICS) {
      const existing = await db.curriculumTopic.findFirst({
        where: {
          gradeLevel: 4,
          subject: "MATEMATIK",
          name: topicName
        }
      });

      if (!existing) {
        await db.curriculumTopic.create({
          data: {
            gradeLevel: 4,
            subject: "MATEMATIK",
            name: topicName,
            description: topicName
          }
        });
        console.log(`   ✓ Oluşturuldu: [MATEMATIK] ${topicName}`);
        created++;
      } else {
        console.log(`   - Zaten var: [MATEMATIK] ${topicName}`);
      }
    }

    // Create Science topics
    for (const topicName of SCIENCE_TOPICS) {
      const existing = await db.curriculumTopic.findFirst({
        where: {
          gradeLevel: 4,
          subject: "FEN_BİLİMLERİ",
          name: topicName
        }
      });

      if (!existing) {
        await db.curriculumTopic.create({
          data: {
            gradeLevel: 4,
            subject: "FEN_BİLİMLERİ",
            name: topicName,
            description: topicName
          }
        });
        console.log(`   ✓ Oluşturuldu: [FEN_BİLİMLERİ] ${topicName}`);
        created++;
      } else {
        console.log(`   - Zaten var: [FEN_BİLİMLERİ] ${topicName}`);
      }
    }

    // Create Social Studies topics
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
