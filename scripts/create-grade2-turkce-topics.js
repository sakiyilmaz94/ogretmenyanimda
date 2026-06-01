/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

const TURKCE_TOPICS = [
  "ALFABE (Sesli ve Sessiz Harfler)",
  "HECE BİLGİSİ (Hecelere Ayırma, Satır Sonuna Sığmayan Kelimeler)",
  "KELİME BİLGİSİ (Kelimede Anlam)",
  "ZIT ANLAMLI KELİMELER",
  "EŞ ANLAMLI KELİMELER",
  "CÜMLE BİLGİSİ (Anlamlı ve Kurallı Cümle Oluşturma)",
  "METİN BİLGİSİ (Paragraf, Başlık, Konu, Ana Fikir)",
  "5N 1K (Ne, Niçin, Nasıl, Nerede, Ne zaman ve Kim)",
  "YAZIM KURALLARI",
  "BÜYÜK HARFLERİN KULLANIMI",
  "İSİMLER (Özel İsimler, Tekil-Çoğul)",
  "NOKTALAMA İŞARETLERİ (Nokta, Virgül, Soru İşareti, Ünlem, Kısa Çizgi, Kesme İşareti)",
  "SORU EKİNİN (Mİ) YAZIMI",
];

(async () => {
  try {
    console.log("📚 Grade 2 Türkçe Konuları Oluşturuluyor...\n");

    // Eski (sorusuz, sınav-dışı) Grade 2 Türkçe konularını temizle
    const legacy = await db.curriculumTopic.findMany({
      where: {
        gradeLevel: 2,
        subject: "TURKCE",
        name: { notIn: TURKCE_TOPICS },
      },
      select: { id: true },
    });
    if (legacy.length > 0) {
      await db.curriculumTopic.deleteMany({
        where: { id: { in: legacy.map((t) => t.id) } },
      });
      console.log(`   🗑️  ${legacy.length} eski konu temizlendi\n`);
    }

    let created = 0;
    for (const topicName of TURKCE_TOPICS) {
      const existing = await db.curriculumTopic.findFirst({
        where: { gradeLevel: 2, subject: "TURKCE", name: topicName },
      });
      if (!existing) {
        await db.curriculumTopic.create({
          data: {
            gradeLevel: 2,
            subject: "TURKCE",
            name: topicName,
            unit: "0",
            description: topicName,
          },
        });
        console.log(`   ✓ Oluşturuldu: [TURKCE] ${topicName}`);
        created++;
      } else {
        console.log(`   ~ Zaten var: [TURKCE] ${topicName}`);
      }
    }

    console.log(`\n✅ ${created} yeni konu oluşturuldu!`);
    await db.$disconnect();
  } catch (error) {
    console.error("❌ Hata:", error);
    process.exit(1);
  }
})();
