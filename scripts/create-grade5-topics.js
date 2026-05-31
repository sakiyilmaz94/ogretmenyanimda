/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

const MATH_TOPICS = [
  "1. Ünite: Doğal Sayılar ve İşlemler",
  "2. Ünite: Kesirler",
  "3. Ünite: Ondalık Gösterim",
  "4. Ünite: Yüzdeler",
  "5. Ünite: Temel Geometrik Kavramlar ve Çizimler",
  "6. Ünite: Veri İşleme ve Zaman Ölçme",
  "7. Ünite: Uzunluk ve Alan Ölçme, Geometrik Cisimler"
];

const SCIENCE_TOPICS = [
  "1. Ünite: Güneş, Dünya ve Ay",
  "2. Ünite: Canlılar Dünyası",
  "3. Ünite: Kuvvetin Ölçülmesi ve Sürtünme",
  "4. Ünite: Maddenin Hal Değişimi",
  "5. Ünite: Işığın Yayılması",
  "6. Ünite: İnsan ve Çevre",
  "7. Ünite: Elektrik Devre Elemanları"
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
    console.log("📚 Grade 5 Konuları Oluşturuluyor...\n");

    let created = 0;

    // Create Matematik topics
    for (const topicName of MATH_TOPICS) {
      const existing = await db.curriculumTopic.findFirst({
        where: {
          gradeLevel: 5,
          subject: "MATEMATIK",
          name: topicName
        }
      });

      if (!existing) {
        await db.curriculumTopic.create({
          data: {
            gradeLevel: 5,
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
          gradeLevel: 5,
          subject: "FEN_BİLİMLERİ",
          name: topicName
        }
      });

      if (!existing) {
        await db.curriculumTopic.create({
          data: {
            gradeLevel: 5,
            subject: "FEN_BİLİMLERİ",
            name: topicName,
            description: topicName
          }
        });
        console.log(`   ✓ Oluşturuldu: [FEN_BİLİMLERİ] ${topicName}`);
        created++;
      }
    }

    // Create Social Studies topics
    for (const topicName of SOCIAL_TOPICS) {
      const existing = await db.curriculumTopic.findFirst({
        where: {
          gradeLevel: 5,
          subject: "SOSYAL_BİLGİLER",
          name: topicName
        }
      });

      if (!existing) {
        await db.curriculumTopic.create({
          data: {
            gradeLevel: 5,
            subject: "SOSYAL_BİLGİLER",
            name: topicName,
            description: topicName
          }
        });
        console.log(`   ✓ Oluşturuldu: [SOSYAL_BİLGİLER] ${topicName}`);
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
