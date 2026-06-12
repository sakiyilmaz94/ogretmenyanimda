/**
 * 1. sınıf Türkçe müfredatı — ünite + kapsadığı konular. SORU YOK.
 * Çalıştır: node scripts/seed-grade1-turkce.js
 */
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient({ log: ["warn", "error"] });

const GRADE = 1;
const SUBJECT = "TURKCE";

const UNITS = [
  { ad: "1. Ünite - Harf Bilgisi", konular: ["Alfabe", "Ünlü harf, ünsüz harf", "Harf sayısı"] },
  { ad: "2. Ünite - Hece Bilgisi", konular: ["Kelimeleri hecesine ayırma", "Hece sayısı", "Hecelerden kelime türetme"] },
  { ad: "3. Ünite - Kelime Bilgisi", konular: ["Kelimelerin doğru yazımı", "Tek başına anlamı olan ve olmayan kelimeler", "Kelimeleri alfabetik sıralama", "Satır sonuna sığmayan kelimeler"] },
  { ad: "4. Ünite - Kelime Bilgisi (2)", konular: ["Zıt anlamlı kelimeler"] },
  { ad: "5. Ünite - Ad (İsim) Bilgisi", konular: ["Özel ad", "Tür (cins) ad", "Tekil ad", "Çoğul ad"] },
  { ad: "6. Ünite - Noktalama İşaretleri", konular: ["Nokta", "Virgül", "Soru işareti", "Ünlem işareti", "Kesme işareti", "Kısa çizgi"] },
  { ad: "7. Ünite - Özel Adların Yazım Kuralları", konular: ["Büyük harflerin yazımı"] },
  { ad: "8. Ünite - Cümle Bilgisi", konular: ["Anlamlı ve kurallı cümleler", "Soru cümlesi"] },
  { ad: "9. Ünite - Metin Bilgisi", konular: ["Okuduğunu anlama ve anlatma", "Metnin konusunu bulma", "Hikaye unsurlarını bulma", "5N1K çalışması", "Olayları oluş sırasına dizme", "Yer, zaman, kahramanı verilen metinleri yazma", "Yarım kalan metni tamamlama"] },
];

(async () => {
  const del = await db.curriculumTopic.deleteMany({ where: { gradeLevel: GRADE, subject: SUBJECT } });
  console.log(`🗑️  ${del.count} eski 1. sınıf Türkçe konusu silindi.`);
  for (const u of UNITS) {
    await db.curriculumTopic.create({
      data: { subject: SUBJECT, gradeLevel: GRADE, name: u.ad, unit: u.ad, learningObjects: u.konular },
    });
  }
  const totalK = UNITS.reduce((a, u) => a + u.konular.length, 0);
  console.log(`✅ 1. sınıf Türkçe: ${UNITS.length} ünite / ${totalK} konu yüklendi (sorusuz).`);
  process.exit(0);
})().catch((e) => { console.error("HATA:", e); process.exit(1); });
