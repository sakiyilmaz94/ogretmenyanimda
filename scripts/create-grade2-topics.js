const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

const MATH_TOPICS = [
  'Doğal Sayılar',
  'Toplama ve Çıkarma İşlemi',
  'Toplama İşlemi',
  'Çıkarma İşlemi',
  'Çarpma İşlemi',
  'Bölme İşlemi',
  'Kesirler',
  'Paralarımız',
  'Uzunluk Ölçme',
  'Zaman Ölçme',
  'Geometrik Cisimler ve Şekiller',
  'Veri Toplama ve Değerlendirme'
];

(async () => {
  console.log('📚 Grade 2 Konuları Oluşturuluyor...\n');

  for (const topicName of MATH_TOPICS) {
    const existing = await db.curriculumTopic.findFirst({
      where: {
        gradeLevel: 2,
        subject: 'MATEMATIK',
        name: topicName
      }
    });

    if (!existing) {
      await db.curriculumTopic.create({
        data: {
          gradeLevel: 2,
          subject: 'MATEMATIK',
          name: topicName,
          unit: '0',
          description: topicName
        }
      });
      console.log(`   ✓ Oluşturuldu: [MATEMATIK] ${topicName}`);
    } else {
      console.log(`   ~ Zaten var: [MATEMATIK] ${topicName}`);
    }
  }

  console.log(`\n✅ ${MATH_TOPICS.length} konu oluşturuldu!`);
  process.exit(0);
})();
