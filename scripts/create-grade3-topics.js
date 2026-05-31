/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

const MATH_TOPICS = [
  "1. Ünite: Doğal Sayılar ve İşlemler",
  "2. Ünite: Veri ve İşlemler",
  "3. Ünite: Çarpma ve Bölme",
  "4. Ünite: Kesirler ve Ölçme",
  "5. Ünite: Geometri",
  "6. Ünite: Ölçme"
];

const SCIENCE_TOPICS = [
  "1. Ünite: Gezegenimizi Tanıyalım",
  "2. Ünite: Beş Duyumuz",
  "3. Ünite: Kuvveti Tanıyalım",
  "4. Ünite: Maddeyi Tanıyalım",
  "5. Ünite: Çevremizdeki Işık ve Sesler",
  "6. Ünite: Canlılar Dünyasına Yolculuk",
  "7. Ünite: Elektrikli Araçlar"
];

(async () => {
  try {
    console.log("📚 Grade 3 Konuları Oluşturuluyor...\n");

    let created = 0;

    // Create Matematik topics
    for (const topicName of MATH_TOPICS) {
      const existing = await db.curriculumTopic.findFirst({
        where: {
          gradeLevel: 3,
          subject: "MATEMATIK",
          name: topicName
        }
      });

      if (!existing) {
        await db.curriculumTopic.create({
          data: {
            gradeLevel: 3,
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
          gradeLevel: 3,
          subject: "FEN_BİLİMLERİ",
          name: topicName
        }
      });

      if (!existing) {
        await db.curriculumTopic.create({
          data: {
            gradeLevel: 3,
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

    console.log(`\n✅ ${created} yeni konu oluşturuldu!\n`);
    await db.$disconnect();
  } catch (error) {
    console.error("❌ Hata:", error);
    process.exit(1);
  }
})();
