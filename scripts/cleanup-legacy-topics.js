const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

(async () => {
  console.log('🗑️ Eski topic verilerini siliyorum...\n');

  // Sınav temalarını tut: "X. Ünite: ..." formatı
  // Eski veri formatını sil: unit alanında olan topics

  const deleted = await db.curriculumTopic.deleteMany({
    where: {
      unit: {
        not: null,
      },
    },
  });

  console.log(`✅ Silindi: ${deleted.count} eski topic`);
  console.log('\n📚 Kalan topics (sadece sınav temaları):');

  const remaining = await db.curriculumTopic.groupBy({
    by: ['gradeLevel', 'subject'],
    _count: true,
  });

  for (const r of remaining.sort((a, b) => a.gradeLevel - b.gradeLevel)) {
    console.log(`   Grade ${r.gradeLevel} - ${r.subject}: ${r._count}`);
  }

  process.exit(0);
})();
