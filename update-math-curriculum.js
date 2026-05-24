const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const mathCurriculum = {
  // 2. SINIF MATEMATİK
  2: [
    { name: "Doğal Sayılar", unit: "1. Ünite", code: "M.2.1.1" },
    { name: "Doğal Sayılarla Toplama İşlemi (Başlangıç)", unit: "1. Ünite", code: "M.2.1.2" },
    { name: "Doğal Sayılarla Çıkarma İşlemi (Başlangıç)", unit: "1. Ünite", code: "M.2.1.3" },
    { name: "Doğal Sayılarla Toplama İşlemi (Devam)", unit: "2. Ünite", code: "M.2.1.2" },
    { name: "Doğal Sayılarla Çıkarma İşlemi (Devam)", unit: "2. Ünite", code: "M.2.1.3" },
    { name: "Sıvı Ölçme", unit: "2. Ünite", code: "M.2.3.5" },
    { name: "Geometrik Cisimler ve Şekiller", unit: "3. Ünite", code: "M.2.2.1" },
    { name: "Uzamsal İlişkiler", unit: "3. Ünite", code: "M.2.2.2" },
    { name: "Geometrik Örüntüler", unit: "3. Ünite", code: "M.2.2.3" },
    { name: "Doğal Sayılarla Çarpma İşlemi", unit: "4. Ünite", code: "M.2.1.4" },
    { name: "Doğal Sayılarla Bölme İşlemi", unit: "4. Ünite", code: "M.2.1.5" },
    { name: "Kesirler", unit: "4. Ünite", code: "M.2.1.6" },
    { name: "Zaman Ölçme", unit: "5. Ünite", code: "M.2.3.3" },
    { name: "Paralarımız", unit: "5. Ünite", code: "M.2.3.2" },
    { name: "Veri Toplama ve Değerlendirme", unit: "6. Ünite", code: "M.2.4.1" },
    { name: "Uzunluk Ölçme", unit: "6. Ünite", code: "M.2.3.1" },
    { name: "Tartma", unit: "6. Ünite", code: "M.2.3.4" },
  ],

  // 3. SINIF MATEMATİK
  3: [
    { name: "Doğal Sayılar", unit: "1. Ünite", code: "M.3.1.1" },
    { name: "Doğal Sayılarla Toplama İşlemi (Başlangıç)", unit: "1. Ünite", code: "M.3.1.2" },
    { name: "Doğal Sayılarla Çıkarma İşlemi (Başlangıç)", unit: "1. Ünite", code: "M.3.1.3" },
    { name: "Doğal Sayılarla Toplama İşlemi (Devam)", unit: "2. Ünite", code: "M.3.1.2" },
    { name: "Doğal Sayılarla Çıkarma İşlemi (Devam)", unit: "2. Ünite", code: "M.3.1.3" },
    { name: "Veri Toplama ve Değerlendirme", unit: "2. Ünite", code: "M.3.4.1" },
    { name: "Doğal Sayılarla Çarpma İşlemi", unit: "3. Ünite", code: "M.3.1.4" },
    { name: "Doğal Sayılarla Bölme İşlemi", unit: "3. Ünite", code: "M.3.1.5" },
    { name: "Kesirler", unit: "3. Ünite", code: "M.3.1.6" },
    { name: "Zaman Ölçme", unit: "4. Ünite", code: "M.3.3.5" },
    { name: "Paralarımız", unit: "4. Ünite", code: "M.3.3.4" },
    { name: "Tartma", unit: "4. Ünite", code: "M.3.3.6" },
    { name: "Geometrik Cisimler ve Şekiller", unit: "5. Ünite", code: "M.3.2.1" },
    { name: "Geometrik Örüntüler", unit: "5. Ünite", code: "M.3.2.3" },
    { name: "Geometride Temel Kavramlar", unit: "5. Ünite", code: "M.3.2.4" },
    { name: "Uzamsal İlişkiler", unit: "5. Ünite", code: "M.3.2.2" },
    { name: "Uzunluk Ölçme", unit: "6. Ünite", code: "M.3.3.1" },
    { name: "Çevre Ölçme", unit: "6. Ünite", code: "M.3.3.2" },
    { name: "Alan Ölçme", unit: "6. Ünite", code: "M.3.3.3" },
    { name: "Sıvı Ölçme", unit: "6. Ünite", code: "M.3.3.7" },
  ],

  // 4. SINIF MATEMATİK
  4: [
    { name: "Doğal Sayılar", unit: "1. Ünite", code: "M.4.1.1" },
    { name: "Doğal Sayılarla Toplama İşlemi (Başlangıç)", unit: "1. Ünite", code: "M.4.1.2" },
    { name: "Doğal Sayılarla Çıkarma İşlemi (Başlangıç)", unit: "1. Ünite", code: "M.4.1.3" },
    { name: "Doğal Sayılarla Toplama İşlemi (Devam)", unit: "2. Ünite", code: "M.4.1.2" },
    { name: "Doğal Sayılarla Çıkarma İşlemi (Devam)", unit: "2. Ünite", code: "M.4.1.3" },
    { name: "Doğal Sayılarla Çarpma İşlemi", unit: "3. Ünite", code: "M.4.1.4" },
    { name: "Doğal Sayılarla Bölme İşlemi", unit: "3. Ünite", code: "M.4.1.5" },
    { name: "Kesirler", unit: "3. Ünite", code: "M.4.1.6" },
    { name: "Kesirlerle İşlemler", unit: "3. Ünite", code: "M.4.1.7" },
    { name: "Zaman Ölçme", unit: "4. Ünite", code: "M.4.3.4" },
    { name: "Veri Toplama ve Değerlendirme", unit: "4. Ünite", code: "M.4.4.1" },
    { name: "Geometrik Cisimler ve Şekiller", unit: "5. Ünite", code: "M.4.2.1" },
    { name: "Geometride Temel Kavramlar", unit: "5. Ünite", code: "M.4.2.3" },
    { name: "Uzamsal İlişkiler", unit: "5. Ünite", code: "M.4.2.2" },
    { name: "Uzunluk Ölçme", unit: "6. Ünite", code: "M.4.3.1" },
    { name: "Çevre Ölçme", unit: "6. Ünite", code: "M.4.3.2" },
    { name: "Alan Ölçme", unit: "6. Ünite", code: "M.4.3.3" },
    { name: "Tartma", unit: "6. Ünite", code: "M.4.3.5" },
    { name: "Sıvı Ölçme", unit: "6. Ünite", code: "M.4.3.6" },
  ],

  // 5. SINIF MATEMATİK
  5: [
    { name: "Doğal Sayılar", unit: "1. Ünite", code: "M.5.1.1" },
    { name: "Doğal Sayılarla İşlemler", unit: "1. Ünite", code: "M.5.1.2" },
    { name: "Kesirler", unit: "2. Ünite", code: "M.5.1.3" },
    { name: "Kesirlerle İşlemler", unit: "2. Ünite", code: "M.5.1.4" },
    { name: "Ondalık Gösterim", unit: "3. Ünite", code: "M.5.1.5" },
    { name: "Yüzdeler", unit: "3. Ünite", code: "M.5.1.6" },
    { name: "Temel Geometrik Kavramlar ve Çizimler", unit: "4. Ünite", code: "M.5.2.1" },
    { name: "Üçgen ve Dörtgenler", unit: "4. Ünite", code: "M.5.2.2" },
    { name: "Veri Toplama ve Değerlendirme", unit: "5. Ünite", code: "M.5.3.1" },
    { name: "Uzunluk ve Zaman Ölçme", unit: "5. Ünite", code: "M.5.2.3" },
    { name: "Alan Ölçme", unit: "6. Ünite", code: "M.5.2.4" },
    { name: "Geometrik Cisimler", unit: "6. Ünite", code: "M.5.2.5" },
  ],

  // 6. SINIF MATEMATİK
  6: [
    { name: "Doğal Sayılarla İşlemler", unit: "1. Ünite", code: "M.6.1.1" },
    { name: "Çarpanlar ve Katlar", unit: "1. Ünite", code: "M.6.1.2" },
    { name: "Kümeleri", unit: "1. Ünite", code: "M.6.1.3" },
    { name: "Tam Sayılar", unit: "2. Ünite", code: "M.6.1.4" },
    { name: "Kesirlerle İşlemler", unit: "2. Ünite", code: "M.6.1.5" },
    { name: "Ondalık Gösterim", unit: "3. Ünite", code: "M.6.1.6" },
    { name: "Oran", unit: "3. Ünite", code: "M.6.1.7" },
    { name: "Cebirsel İfadeler", unit: "4. Ünite", code: "M.6.2.1" },
    { name: "Veri Toplama ve Değerlendirme", unit: "4. Ünite", code: "M.6.4.1" },
    { name: "Veri Analizi", unit: "4. Ünite", code: "M.6.4.2" },
    { name: "Açılar", unit: "5. Ünite", code: "M.6.3.1" },
    { name: "Alan Ölçme", unit: "5. Ünite", code: "M.6.3.2" },
    { name: "Çember", unit: "5. Ünite", code: "M.6.3.3" },
    { name: "Geometrik Cisimler", unit: "6. Ünite", code: "M.6.3.4" },
    { name: "Sıvı Ölçme", unit: "6. Ünite", code: "M.6.3.5" },
  ],

  // 7. SINIF MATEMATİK
  7: [
    { name: "Tam Sayılarla İşlemler", unit: "1. Ünite", code: "M.7.1.1" },
    { name: "Rasyonel Sayılar", unit: "2. Ünite", code: "M.7.1.2" },
    { name: "Rasyonel Sayılarla İşlemler", unit: "2. Ünite", code: "M.7.1.3" },
    { name: "Cebirsel İfadeler", unit: "3. Ünite", code: "M.7.2.1" },
    { name: "Eşitlik ve Denklem", unit: "3. Ünite", code: "M.7.2.2" },
    { name: "Oran ve Orantı", unit: "4. Ünite", code: "M.7.1.4" },
    { name: "Yüzdeler", unit: "4. Ünite", code: "M.7.1.5" },
    { name: "Doğrular ve Açılar", unit: "5. Ünite", code: "M.7.3.1" },
    { name: "Çokgenler", unit: "5. Ünite", code: "M.7.3.2" },
    { name: "Çember ve Daire", unit: "5. Ünite", code: "M.7.3.3" },
    { name: "Veri Analizi", unit: "6. Ünite", code: "M.7.4.1" },
    { name: "Cisimlerinin Farklı Yönlerden Görünümleri", unit: "6. Ünite", code: "M.7.3.4" },
  ],

  // 8. SINIF MATEMATİK
  8: [
    { name: "Çarpanlar ve Katlar", unit: "1. Ünite", code: "M.8.1.1" },
    { name: "Üslü İfadeler", unit: "1. Ünite", code: "M.8.1.2" },
    { name: "Kareköklü İfadeler", unit: "2. Ünite", code: "M.8.1.3" },
    { name: "Veri Analizi", unit: "2. Ünite", code: "M.8.4.1" },
    { name: "Basit Olayların Olma Olasılığı", unit: "3. Ünite", code: "M.8.5.1" },
    { name: "Cebirsel İfadeler ve Özdeşlikler", unit: "3. Ünite", code: "M.8.2.1" },
    { name: "Doğrusal Denklemler", unit: "4. Ünite", code: "M.8.2.2" },
    { name: "Eşitsizlikler", unit: "4. Ünite", code: "M.8.2.3" },
    { name: "Üçgenler", unit: "5. Ünite", code: "M.8.3.1" },
    { name: "Eşlik ve Benzerlik", unit: "5. Ünite", code: "M.8.3.3" },
    { name: "Dönüşüm Geometrisi", unit: "6. Ünite", code: "M.8.3.2" },
    { name: "Geometrik Cisimler", unit: "6. Ünite", code: "M.8.3.4" },
  ],
};

async function updateMathCurriculum() {
  console.log("📚 Matematik müfredatı güncelleniyor...");

  try {
    // Mevcut matematik konularını sil
    const deleted = await prisma.curriculumTopic.deleteMany({
      where: { subject: "MATEMATIK" },
    });
    console.log(`Deleted ${deleted.count} existing math topics`);

    // Tüm sınıflar için konuları ekle
    let totalAdded = 0;
    for (const [grade, topics] of Object.entries(mathCurriculum)) {
      for (const topic of topics) {
        await prisma.curriculumTopic.create({
          data: {
            subject: "MATEMATIK",
            gradeLevel: parseInt(grade),
            name: topic.name,
            unit: topic.unit,
            description: `${topic.unit} - Kazanım Kodu: ${topic.code}`,
          },
        });
        totalAdded++;
      }
    }

    console.log(`✅ ${totalAdded} matematik konusu başarıyla eklendi!`);

    // Kontrol: konu sayısını doğrula
    const count = await prisma.curriculumTopic.count({
      where: { subject: "MATEMATIK" },
    });
    console.log(`📊 Toplam matematik konusu: ${count}`);

    // Sınıf başına konu sayısını göster
    for (let grade = 1; grade <= 8; grade++) {
      const gradeCount = await prisma.curriculumTopic.count({
        where: { subject: "MATEMATIK", gradeLevel: grade },
      });
      console.log(`  ${grade}. Sınıf: ${gradeCount} konu`);
    }
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
}

updateMathCurriculum()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
