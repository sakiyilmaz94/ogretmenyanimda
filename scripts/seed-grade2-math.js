const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

(async () => {
  console.log('📚 Grade 2 Matematik Soruları Yüklüyorum...\n');

  const questions = JSON.parse(fs.readFileSync('./grade2-math.json', 'utf-8'));
  console.log(`✓ ${questions.length} soru JSON'dan okundu\n`);

  const themeStats = {};

  for (const q of questions) {
    const themeName = q.theme || q.unit || 'Unknown';
    
    const topic = await db.curriculumTopic.findFirst({
      where: {
        gradeLevel: 2,
        subject: 'MATEMATIK',
        name: themeName
      }
    });

    if (!topic) {
      console.log(`⚠️ Tema bulunamadı: ${themeName}`);
      continue;
    }

    await db.levelAssessmentQuestion.create({
      data: {
        topicId: topic.id,
        gradeLevel: 2,
        subject: 'MATEMATIK',
        topicName: themeName,
        question: q.question,
        option1: q.option1,
        option2: q.option2,
        option3: q.option3,
        option4: q.option4,
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty || 'ORTA'
      }
    });

    themeStats[themeName] = (themeStats[themeName] || 0) + 1;
  }

  console.log('\n============================================================');
  console.log('✅ GRADE 2 MATEMATİK YÜKLEME TAMAMLANDI!');
  console.log('============================================================\n');
  console.log('📊 Tema Özeti:');
  for (const [theme, count] of Object.entries(themeStats).sort()) {
    console.log(`   • ${theme}: ${count} soru`);
  }
  
  const total = Object.values(themeStats).reduce((a, b) => a + b, 0);
  console.log(`\n📈 Toplam: ${total} soru başarıyla yüklendi`);
  
  process.exit(0);
})();
