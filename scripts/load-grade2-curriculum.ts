import { PrismaClient } from "@prisma/client";
import grade2Topics from "../docs/curriculum/grade2-topics.json";

const db = new PrismaClient();

interface Topic {
  name: string;
  description?: string;
}

async function validateData(topics: Record<string, Topic[]>) {
  console.log("🔍 Validating curriculum data...");

  let totalTopics = 0;
  const errors: string[] = [];

  for (const [key, topicList] of Object.entries(topics)) {
    console.log(`\n📚 ${key}:`);

    if (!topicList || topicList.length === 0) {
      errors.push(`${key}: Boş konu listesi`);
      continue;
    }

    const nameSet = new Set<string>();

    for (const topic of topicList) {
      // Konu adı kontrolü
      if (!topic.name || topic.name.trim() === "") {
        errors.push(`${key}: Boş konu adı`);
        continue;
      }

      // Duplicate kontrolü
      if (nameSet.has(topic.name)) {
        errors.push(`${key}: Duplicate konu - "${topic.name}"`);
        continue;
      }

      nameSet.add(topic.name);
      totalTopics++;
    }

    console.log(`   ✓ ${topicList.length} konu (${nameSet.size} unique)`);
  }

  console.log(`\n📊 Toplam konular: ${totalTopics}`);

  if (errors.length > 0) {
    console.error("\n❌ Validation hataları:");
    errors.forEach((err) => console.error(`   - ${err}`));
    process.exit(1);
  }

  console.log("✅ Validation başarılı");
  return totalTopics;
}

async function loadGrade2Curriculum() {
  try {
    console.log("🚀 Grade 2 Müfredat Yükleme Başladı\n");

    // 1. Validation
    const totalCount = await validateData(grade2Topics);

    // 2. Database kontrolü
    console.log("\n🔗 Veritabanı bağlantısı kontrol ediliyor...");
    const existingCount = await db.curriculumTopic.count({
      where: { gradeLevel: 2 },
    });
    console.log(`   Mevcut Grade 2 konuları: ${existingCount}`);

    // 3. Türkçe konuları ekle
    console.log("\n📝 Türkçe konuları ekleniyor...");
    const turkishTopics = grade2Topics.grade2_turkce.map((t) => ({
      gradeLevel: 2,
      subject: "TÜRKÇE",
      name: t.name,
      description: t.description || "",
    }));

    for (const topic of turkishTopics) {
      try {
        await db.curriculumTopic.create({ data: topic });
        console.log(`   ✓ ${topic.name}`);
      } catch (e: any) {
        if (e.code === "P2002") {
          console.log(`   ⊘ ${topic.name} (zaten var)`);
        } else {
          throw e;
        }
      }
    }

    // 4. Matematik konuları ekle
    console.log("\n🔢 Matematik konuları ekleniyor...");
    const mathTopics = grade2Topics.grade2_matematik.map((t) => ({
      gradeLevel: 2,
      subject: "MATEMATIK",
      name: t.name,
      description: t.description || "",
    }));

    for (const topic of mathTopics) {
      try {
        await db.curriculumTopic.create({ data: topic });
        console.log(`   ✓ ${topic.name}`);
      } catch (e: any) {
        if (e.code === "P2002") {
          console.log(`   ⊘ ${topic.name} (zaten var)`);
        } else {
          throw e;
        }
      }
    }

    // 5. Sonuç
    const finalTurkish = await db.curriculumTopic.count({
      where: { gradeLevel: 2, subject: "TÜRKÇE" },
    });
    const finalMath = await db.curriculumTopic.count({
      where: { gradeLevel: 2, subject: "MATEMATIK" },
    });

    console.log("\n✅ SONUÇLAR:");
    console.log(`   Türkçe: ${finalTurkish} konu`);
    console.log(`   Matematik: ${finalMath} konu`);
    console.log(`   Toplam: ${finalTurkish + finalMath} konu\n`);

    if (finalTurkish >= 20 && finalMath >= 15) {
      console.log("🎉 Grade 2 Müfredat Yüklemesi Başarılı!");
      process.exit(0);
    } else {
      console.error("❌ Yeterli konu yüklenmedi");
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Hata:", error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

loadGrade2Curriculum();
