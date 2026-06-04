/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

const TURKCE_TOPICS = [
  "1. Ünite: HARF VE HECE BİLGİSİ",
  "2. Ünite: SÖZCÜK BİLGİSİ",
  "3. Ünite: CÜMLE BİLGİSİ",
  "4. Ünite: SÖZ VARLIĞI",
  "5. Ünite: OKUMA ANLAMA",
  "6. Ünite: SÖZCÜK TÜRETLERİ",
  "7. Ünite: NOKTALAMA İŞARETLERİ",
];

(async () => {
  try {
    console.log("📚 Grade 3 Türkçe Konuları Oluşturuluyor...\n");

    // Eski (sorusuz, sınav-dışı) Grade 3 Türkçe konularını temizle
    const legacy = await db.curriculumTopic.findMany({
      where: {
        gradeLevel: 3,
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
        where: { gradeLevel: 3, subject: "TURKCE", name: topicName },
      });
      if (!existing) {
        await db.curriculumTopic.create({
          data: {
            gradeLevel: 3,
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
