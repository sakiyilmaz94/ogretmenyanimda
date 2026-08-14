/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

// MEB 8. Sınıf İngilizce üniteleri (10 ünite)
const INGILIZCE_TOPICS = [
  { name: "1. Ünite: Friendship (Arkadaşlık)", description: "Arkadaşlık" },
  { name: "2. Ünite: Teen Life (Genç Yaşamı)", description: "Genç yaşamı" },
  { name: "3. Ünite: In the Kitchen (Mutfakta)", description: "Mutfakta" },
  { name: "4. Ünite: On the Phone (Telefonda)", description: "Telefonda" },
  { name: "5. Ünite: The Internet (İnternet)", description: "İnternet" },
  { name: "6. Ünite: Adventures (Maceralar)", description: "Maceralar" },
  { name: "7. Ünite: Tourism (Turizm)", description: "Turizm" },
  { name: "8. Ünite: Chores (Ev İşleri)", description: "Ev işleri" },
  { name: "9. Ünite: Science (Bilim)", description: "Bilim" },
  { name: "10. Ünite: Natural Forces (Doğal Afetler)", description: "Doğal afetler" },
];

(async () => {
  try {
    console.log("📚 8. Sınıf İngilizce Üniteleri Oluşturuluyor...\n");

    let created = 0;
    let skipped = 0;

    for (const topic of INGILIZCE_TOPICS) {
      const existing = await db.curriculumTopic.findFirst({
        where: {
          gradeLevel: 8,
          subject: "INGILIZCE",
          name: topic.name,
        },
      });

      if (existing) {
        console.log(`   ↷ Zaten var, atlandı: ${topic.name}`);
        skipped++;
        continue;
      }

      await db.curriculumTopic.create({
        data: {
          gradeLevel: 8,
          subject: "INGILIZCE",
          name: topic.name,
          description: topic.description,
          learningObjects: [],
        },
      });
      console.log(`   ✓ Oluşturuldu: ${topic.name}`);
      created++;
    }

    console.log(`\n✅ Tamamlandı — ${created} yeni ünite, ${skipped} atlandı.\n`);
    await db.$disconnect();
  } catch (error) {
    console.error("❌ Hata:", error);
    process.exit(1);
  }
})();
