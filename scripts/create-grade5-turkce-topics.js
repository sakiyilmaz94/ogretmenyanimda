/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

const TURKCE_TOPICS = [
  "1. Ünite: SÖZCÜKTE VE SÖZ GRUPLARINDA ANLAM",
  "2. Ünite: CÜMLEDE ANLAM",
  "3. Ünite: PARÇADA ANLAM",
  "4. Ünite: İSİMLER (ADLAR)",
  "5. Ünite: İSİMLERİ NİTELEYEN YA DA BELİRTEN KELİMELER (SIFATLAR)",
  "6. Ünite: İSİMLERİN YERİNE KULLANILAN KELİMELER (ZAMİRLER)",
  "7. Ünite: YAZIM KURALLARI",
  "8. Ünite: NOKTALAMA İŞARETLERİ",
];

(async () => {
  try {
    console.log("📚 Grade 5 Türkçe Konuları Oluşturuluyor...\n");

    const legacy = await db.curriculumTopic.findMany({
      where: {
        gradeLevel: 5,
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
        where: { gradeLevel: 5, subject: "TURKCE", name: topicName },
      });
      if (!existing) {
        await db.curriculumTopic.create({
          data: {
            gradeLevel: 5,
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
