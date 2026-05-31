/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

const MATH_TOPICS = [
  "1. Ünite: Doğal Sayılar ve İşlemler",
  "2. Ünite: Çarpma ve Bölme İşlemleri",
  "3. Ünite: Kesirler",
  "4. Ünite: Zaman Ölçme ve Veri İşleme",
  "5. Ünite: Geometri",
  "6. Ünite: Ölçme (Uzunluk, Çevre, Alan, Tartma, Sıvı)"
];

const SCIENCE_TOPICS = [
  "1. Ünite: Yer Kabuğu ve Dünya'mızın Hareketleri",
  "2. Ünite: Besinlerimiz",
  "3. Ünite: Kuvvetin Etkileri",
  "4. Ünite: Maddenin Özellikleri",
  "5. Ünite: Aydınlatma ve Ses Teknolojileri",
  "6. Ünite: İnsan ve Çevre",
  "7. Ünite: Basit Elektrik Devreleri"
];

const SOCIAL_TOPICS = [
  "1. Ünite: Birey ve Toplum",
  "2. Ünite: Kültür ve Miras",
  "3. Ünite: İnsanlar, Yerler ve Çevreler",
  "4. Ünite: Bilim, Teknoloji ve Toplum",
  "5. Ünite: Üretim, Dağıtım ve Tüketim",
  "6. Ünite: Etkin Vatandaşlık",
  "7. Ünite: Küresel Bağlantılar"
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
          subject: "FEN_BILIMLERI",
          name: topicName
        }
      });

      if (!existing) {
        await db.curriculumTopic.create({
          data: {
            gradeLevel: 4,
            subject: "FEN_BILIMLERI",
            name: topicName,
            description: topicName
          }
        });
        console.log(`   ✓ Oluşturuldu: [FEN_BILIMLERI] ${topicName}`);
        created++;
      } else {
        console.log(`   - Zaten var: [FEN_BILIMLERI] ${topicName}`);
      }
    }

    // Create Social Studies topics
    for (const topicName of SOCIAL_TOPICS) {
      const existing = await db.curriculumTopic.findFirst({
        where: {
          gradeLevel: 4,
          subject: "SOSYAL_BILGILER",
          name: topicName
        }
      });

      if (!existing) {
        await db.curriculumTopic.create({
          data: {
            gradeLevel: 4,
            subject: "SOSYAL_BILGILER",
            name: topicName,
            description: topicName
          }
        });
        console.log(`   ✓ Oluşturuldu: [SOSYAL_BILGILER] ${topicName}`);
        created++;
      } else {
        console.log(`   - Zaten var: [SOSYAL_BILGILER] ${topicName}`);
      }
    }

    console.log(`\n✅ ${created} yeni konu oluşturuldu!\n`);
    await db.$disconnect();
  } catch (error) {
    console.error("❌ Hata:", error);
    process.exit(1);
  }
})();
