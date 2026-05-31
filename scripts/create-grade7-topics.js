/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

const MATH_TOPICS = [
  "1. Ünite: Tam Sayılarla İşlemler",
  "2. Ünite: Rasyonel Sayılar",
  "3. Ünite: Cebirsel İfadeler ve Denklemler",
  "4. Ünite: Oran, Orantı ve Yüzdeler",
  "5. Ünite: Çokgenler ve Cisimlerin Görünümleri",
  "6. Ünite: Veri Analizi"
];

const SCIENCE_TOPICS = [
  "1. Ünite: Güneş Sistemi ve Ötesi",
  "2. Ünite: Hücre ve Bölünmeler",
  "3. Ünite: Kuvvet ve Enerji",
  "4. Ünite: Saf Madde ve Karışımlar",
  "5. Ünite: Işığın Madde ile Etkileşimi",
  "6. Ünite: Canlılarda Üreme, Büyüme ve Gelişme",
  "7. Ünite: Elektrik Devreleri"
];

const SOCIAL_TOPICS = [
  "1. Ünite: Birey ve Toplum",
  "2. Ünite: Kültür ve Miras",
  "3. Ünite: İnsanlar, Yerler ve Çevreler",
  "4. Ünite: Bilim, Teknoloji ve Toplum",
  "5. Ünite: Ekonomi ve Yaşam",
  "6. Ünite: Demokrasi ve Vatandaşlık",
  "7. Ünite: Dünyadaki Yerimiz"
];

(async () => {
  try {
    console.log("📚 Grade 7 Konuları Oluşturuluyor...\n");

    let created = 0;

    // Create Matematik topics
    for (const topicName of MATH_TOPICS) {
      const existing = await db.curriculumTopic.findFirst({
        where: {
          gradeLevel: 7,
          subject: "MATEMATIK",
          name: topicName
        }
      });

      if (!existing) {
        await db.curriculumTopic.create({
          data: {
            gradeLevel: 7,
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
          gradeLevel: 7,
          subject: "FEN_BILIMLERI",
          name: topicName
        }
      });

      if (!existing) {
        await db.curriculumTopic.create({
          data: {
            gradeLevel: 7,
            subject: "FEN_BILIMLERI",
            name: topicName,
            description: topicName
          }
        });
        console.log(`   ✓ Oluşturuldu: [FEN_BILIMLERI] ${topicName}`);
        created++;
      }
    }

    // Create Social Studies topics
    for (const topicName of SOCIAL_TOPICS) {
      const existing = await db.curriculumTopic.findFirst({
        where: {
          gradeLevel: 7,
          subject: "SOSYAL_BILGILER",
          name: topicName
        }
      });

      if (!existing) {
        await db.curriculumTopic.create({
          data: {
            gradeLevel: 7,
            subject: "SOSYAL_BILGILER",
            name: topicName,
            description: topicName
          }
        });
        console.log(`   ✓ Oluşturuldu: [SOSYAL_BILGILER] ${topicName}`);
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
