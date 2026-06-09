/**
 * sinavlar/uniteler.json + sınıf soru dosyalarından
 * CurriculumTopic (learningObjects = kapsadığı konular) ve
 * LevelAssessmentQuestion kayıtlarını yükler.
 *
 * Kapsam: Matematik, Fen Bilimleri, Sosyal Bilgiler, T.C. İnkılap Tarihi.
 * Türkçe'ye DOKUNMAZ. Bu 4 ders için eski konu/sorular silinir (temiz replace).
 *
 * Çalıştır: node scripts/seed-from-uniteler.js
 */
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient({ log: ["warn", "error"] });

const SINAVLAR = path.join(__dirname, "..", "sinavlar");

// uniteler.json ders etiketi → Prisma Subject enum
const SUBJECT_MAP = {
  "Matematik": "MATEMATIK",
  "Fen Bilimleri": "FEN_BILIMLERI",
  "Sosyal Bilgiler": "SOSYAL_BILGILER",
  "T.C. İnkılap Tarihi ve Atatürkçülük": "INKILAP_TARIHI",
};
const TARGET_SUBJECTS = Object.values(SUBJECT_MAP);

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(SINAVLAR, file), "utf-8"));
}

async function main() {
  const uniteler = readJson("uniteler.json");

  // 1) Temiz replace: 4 dersin tüm konularını sil (sorular cascade ile gider).
  console.log("🗑️  Eski konu/sorular siliniyor (4 ders)...");
  const delQ = await db.levelAssessmentQuestion.deleteMany({
    where: { subject: { in: TARGET_SUBJECTS } },
  });
  const delT = await db.curriculumTopic.deleteMany({
    where: { subject: { in: TARGET_SUBJECTS } },
  });
  console.log(`   ${delT.count} konu, ${delQ.count} soru silindi.\n`);

  let totalTopics = 0;
  let totalQuestions = 0;
  const warnings = [];

  for (const sinif of uniteler.siniflar) {
    const grade = sinif.sinif;
    const groupField = sinif.gruplamaAlani; // "tema" | "unit"
    const questions = readJson(sinif.soruDosyasi);

    // Soruları gruplama değerine göre indeksle
    const qByGroup = {};
    for (const q of questions) {
      const key = q[groupField];
      (qByGroup[key] ??= []).push(q);
    }

    for (const ders of sinif.dersler) {
      const subject = SUBJECT_MAP[ders.ders];
      if (!subject) {
        warnings.push(`Bilinmeyen ders: "${ders.ders}" (sınıf ${grade})`);
        continue;
      }

      let dersTopics = 0;
      let dersQuestions = 0;

      for (const unite of ders.uniteler) {
        // 2) Konu (ünite/tema) oluştur
        const topic = await db.curriculumTopic.create({
          data: {
            subject,
            gradeLevel: grade,
            name: unite.ad,
            unit: unite.ad,
            learningObjects: unite.konular ?? [],
          },
        });
        dersTopics++;
        totalTopics++;

        // 3) Bu üniteye ait soruları bağla — sadece doğru subject olanlar
        const groupQs = (qByGroup[unite.ad] ?? []).filter(
          (q) => SUBJECT_MAP[q.subject] === subject
        );

        for (const q of groupQs) {
          await db.levelAssessmentQuestion.create({
            data: {
              topicId: topic.id,
              gradeLevel: grade,
              subject,
              topicName: unite.ad,
              question: q.question,
              option1: q.option1 ?? null,
              option2: q.option2 ?? null,
              option3: q.option3 ?? null,
              option4: q.option4 ?? null,
              correctAnswer: q.correctAnswer ?? 0,
              difficulty: q.difficulty ?? "medium",
            },
          });
          dersQuestions++;
          totalQuestions++;
        }

        if (groupQs.length === 0) {
          warnings.push(
            `Soru bulunamadı: sınıf ${grade} / ${ders.ders} / "${unite.ad}"`
          );
        }
      }

      console.log(
        `  Sınıf ${grade} | ${ders.ders.padEnd(36)} → ${dersTopics} ünite / ${dersQuestions} soru`
      );
    }
  }

  console.log(`\n✅ TOPLAM: ${totalTopics} konu / ${totalQuestions} soru yüklendi.`);
  if (warnings.length) {
    console.log(`\n⚠️  Uyarılar (${warnings.length}):`);
    warnings.forEach((w) => console.log("   - " + w));
  } else {
    console.log("\n✓ Uyarı yok — tüm üniteler soru içeriyor, tüm dersler eşleşti.");
  }
}

main()
  .catch((e) => {
    console.error("HATA:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
