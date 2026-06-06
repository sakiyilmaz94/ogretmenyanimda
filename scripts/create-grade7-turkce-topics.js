/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

const TURKCE_TOPICS = [
  "1. Ünite: SÖZCÜKTE ANLAM",
  "2. Ünite: CÜMLEDE ANLAM",
  "3. Ünite: DEYİMLER VE ATASÖZLERİ",
  "4. Ünite: SÖZ SANATLARI",
  "5. Ünite: PARAGRAFTA ANLAM",
  "6. Ünite: FİİLLER",
  "7. Ünite: ZARFLAR",
  "8. Ünite: ANLATIM BOZUKLUKLARI",
  "9. Ünite: YAZIM KURALLARI",
  "10. Ünite: NOKTALAMA İŞARETLERİ",
  "11. Ünite: SÖZEL MANTIK VE MUHAKEME",
];

(async () => {
  try {
    console.log("📚 Grade 7 Türkçe Konuları Oluşturuluyor...\n");

    const legacy = await db.curriculumTopic.findMany({
      where: {
        gradeLevel: 7,
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
        where: { gradeLevel: 7, subject: "TURKCE", name: topicName },
      });
      if (!existing) {
        await db.curriculumTopic.create({
          data: {
            gradeLevel: 7,
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
