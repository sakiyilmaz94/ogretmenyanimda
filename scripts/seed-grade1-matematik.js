/**
 * 1. sınıf Matematik müfredatı — ünite/tema + kapsadığı konular.
 * SORU YOK (1. sınıfta seviye sınavı gönderilmiyor). Sadece booking'te ders/ünite seçimi için.
 * Çalıştır: node scripts/seed-grade1-matematik.js
 */
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient({ log: ["warn", "error"] });

const GRADE = 1;
const SUBJECT = "MATEMATIK";

const UNITS = [
  { ad: "1. Ünite - Nesnelerin Geometrisi (1)", konular: ["Uzamsal ilişkiler", "Eş nesneler"] },
  { ad: "2. Ünite - Sayılar ve Nicelikler (1)", konular: ["Rakamlar ve sayılar", "Sayı ve şekil örüntüleri", "Tahmin"] },
  { ad: "3. Ünite - Sayılar ve Nicelikler (2)", konular: ["Uzunluk ölçme", "Tartma"] },
  { ad: "4. Ünite - İşlemlerden Cebirsel Düşünmeye (1)", konular: ["Toplama ve çıkarma", "Doğal sayılarla çıkarma işlemi"] },
  { ad: "5. Ünite - Sayılar ve Nicelikler (3)", konular: ["Paralarımız"] },
  { ad: "6. Ünite - Nesnelerin Geometrisi (2)", konular: ["Nesneler ve geometrik şekiller"] },
  { ad: "7. Ünite - Veriye Dayalı Araştırma", konular: ["Veri toplama ve değerlendirme"] },
];

(async () => {
  // Temiz yükleme: 1. sınıf Matematik konularını sil (soru yok, cascade riski yok)
  const del = await db.curriculumTopic.deleteMany({ where: { gradeLevel: GRADE, subject: SUBJECT } });
  console.log(`🗑️  ${del.count} eski 1. sınıf Matematik konusu silindi.`);

  for (const u of UNITS) {
    await db.curriculumTopic.create({
      data: { subject: SUBJECT, gradeLevel: GRADE, name: u.ad, unit: u.ad, learningObjects: u.konular },
    });
  }
  console.log(`✅ 1. sınıf Matematik: ${UNITS.length} ünite yüklendi (sorusuz).`);
  const totalK = UNITS.reduce((a, u) => a + u.konular.length, 0);
  console.log(`   Toplam ${totalK} konu.`);
  process.exit(0);
})().catch((e) => { console.error("HATA:", e); process.exit(1); });
