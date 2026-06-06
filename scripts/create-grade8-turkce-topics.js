/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

const TURKCE_TOPICS = [
  "1. Ünite: PARAGRAFTA ANA FİKİR, GİRİŞ-GELİŞME-SONUÇ",
  "2. Ünite: FİİLİMSİLER (İSİM FİİL - SIFAT FİİL - ZARF FİİL)",
  "3. Ünite: YAZIM KURALLARI (BÜYÜK HARFLER, DE-Mİ-Kİ, SAYILAR VE BİRLEŞİK SÖZCÜKLER)",
  "4. Ünite: NOKTALAMA İŞARETLERİ (NOKTA, VİRGÜL, İKİ NOKTA, TIRNAK VE ÇİZGİLER)",
  "5. Ünite: CÜMLENİN ÖGELERİ (TEMEL VE YARDIMCI ÖGELER, VURGU VE ARA SÖZ)",
  "6. Ünite: CÜMLE TÜRLERİ (YÜKLEMİNE, ANLAMINA VE YAPISINA GÖRE CÜMLELER)",
  "7. Ünite: FİİLDE ÇATI (ÖZNESİNE VE NESNESİNE GÖRE FİİLLER)",
  "8. Ünite: ANLATIM BOZUKLAKLARI (ANLAMSAL VE YAPISAL BOZUKLUKLAR)",
  "9. Ünite: METİN TÜRLERİ VE SÖZ SANATLARI",
  "10. Ünite: SÖZEL MANTIK, TABLO VE GRAFİK OKUMA",
];

(async () => {
  try {
    console.log("📚 Grade 8 Türkçe Konuları Oluşturuluyor...\n");

    const legacy = await db.curriculumTopic.findMany({
      where: {
        gradeLevel: 8,
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
        where: { gradeLevel: 8, subject: "TURKCE", name: topicName },
      });
      if (!existing) {
        await db.curriculumTopic.create({
          data: {
            gradeLevel: 8,
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
