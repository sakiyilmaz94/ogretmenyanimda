/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

const MATH_TOPICS = [
  "1. Ünite: Çarpanlar ve Katlar",
  "1. Ünite: Üslü İfadeler",
  "2. Ünite: Kareköklü İfadeler",
  "2. Ünite: Veri Analizi",
  "3. Ünite: Basit Olayların Olma Olasılığı",
  "3. Ünite: Cebirsel İfadeler ve Özdeşlikler",
  "4. Ünite: Doğrusal Denklemler",
  "4. Ünite: Eşitsizlikler",
  "5. Ünite: Eşlik ve Benzerlik",
  "5. Ünite: Üçgenler",
  "6. Ünite: Dönüşüm Geometrisi",
  "6. Ünite: Geometrik Cisimler"
];

const SCIENCE_TOPICS = [
  "1. Ünite: Mevsimler ve İklim",
  "2. Ünite: DNA ve Genetik Kod",
  "3. Ünite: Basınç",
  "4. Ünite: Madde ve Endüstri",
  "5. Ünite: Basit Makineler",
  "6. Ünite: Enerji Dönüşümleri ve Çevre Bilimi",
  "7. Ünite: Elektrik Yükleri ve Elektrik Enerjisi"
];

const HISTORY_TOPICS = [
  "1. Ünite: Bir Kahraman Doğuyor",
  "2. Ünite: Millî Uyanış",
  "3. Ünite: Milli Bir Destan",
  "4. Ünite: Atatürkçülük ve Çağdaşlaşan Türkiye",
  "5. Ünite: Demokratikleşme Çabaları",
  "6. Ünite: Atatürk Dönemi Türk Dış Politikası",
  "7. Ünite: Atatürk'ün Ölümü ve Sonrası"
];

(async () => {
  try {
    console.log("📚 Grade 8 Konuları Oluşturuluyor...\n");

    let created = 0;

    // Create Matematik topics
    for (const topicName of MATH_TOPICS) {
      const existing = await db.curriculumTopic.findFirst({
        where: {
          gradeLevel: 8,
          subject: "MATEMATIK",
          name: topicName
        }
      });

      if (!existing) {
        await db.curriculumTopic.create({
          data: {
            gradeLevel: 8,
            subject: "MATEMATIK",
            name: topicName,
            description: topicName
          }
        });
        console.log(`   ✓ Oluşturuldu: [MATEMATIK] ${topicName}`);
        created++;
      }
    }

    // Create Science topics
    for (const topicName of SCIENCE_TOPICS) {
      const existing = await db.curriculumTopic.findFirst({
        where: {
          gradeLevel: 8,
          subject: "FEN_BILIMLERI",
          name: topicName
        }
      });

      if (!existing) {
        await db.curriculumTopic.create({
          data: {
            gradeLevel: 8,
            subject: "FEN_BILIMLERI",
            name: topicName,
            description: topicName
          }
        });
        console.log(`   ✓ Oluşturuldu: [FEN_BILIMLERI] ${topicName}`);
        created++;
      }
    }

    // Create History topics
    for (const topicName of HISTORY_TOPICS) {
      const existing = await db.curriculumTopic.findFirst({
        where: {
          gradeLevel: 8,
          subject: "INKILAP_TARIHI",
          name: topicName
        }
      });

      if (!existing) {
        await db.curriculumTopic.create({
          data: {
            gradeLevel: 8,
            subject: "INKILAP_TARIHI",
            name: topicName,
            description: topicName
          }
        });
        console.log(`   ✓ Oluşturuldu: [INKILAP_TARIHI] ${topicName}`);
        created++;
      }
    }

    console.log(`\n✅ ${created} yeni konu oluşturuldu!\n`);
    await db.$disconnect();
  } catch (error) {
    console.error("❌ Hata:", error);
    process.exit(1);
  }
})();
