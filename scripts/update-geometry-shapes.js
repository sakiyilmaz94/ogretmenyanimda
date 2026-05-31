const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

const GEOMETRY_SHAPES = {
  // Soru 1: Küp
  cube: `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,50 150,50 180,80 80,80" fill="none" stroke="black" stroke-width="2"/>
    <polygon points="150,50 150,150 180,180 180,80" fill="none" stroke="black" stroke-width="2"/>
    <polygon points="50,50 50,150 80,180 80,80" fill="none" stroke="black" stroke-width="2"/>
    <line x1="50" y1="150" x2="150" y2="150" stroke="black" stroke-width="2"/>
    <line x1="80" y1="180" x2="180" y2="180" stroke="black" stroke-width="2"/>
  </svg>`,

  // Soru 2: Üçgen
  triangle: `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <polygon points="100,30 30,150 170,150" fill="none" stroke="black" stroke-width="2"/>
    <circle cx="100" cy="30" r="4" fill="red"/>
    <circle cx="30" cy="150" r="4" fill="blue"/>
    <circle cx="170" cy="150" r="4" fill="green"/>
    <text x="85" y="15" font-size="12">1</text>
    <text x="5" y="160" font-size="12">3</text>
    <text x="170" y="160" font-size="12">0</text>
  </svg>`,

  // Soru 3: Kare Prizma
  rectangular_prism: `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <rect x="40" y="50" width="120" height="90" fill="none" stroke="black" stroke-width="2"/>
    <polygon points="40,50 20,30 140,30 160,50" fill="none" stroke="black" stroke-width="2"/>
    <polygon points="160,50 160,140 140,120 140,30" fill="none" stroke="black" stroke-width="2"/>
  </svg>`,

  // Soru 7: Kare/Dikdörtgen
  square_rectangle: `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="30" x2="180" y2="30" stroke="black" stroke-width="2" stroke-dasharray="5,5"/>
    <text x="50" y="20" font-size="12">Nokta: 15, 20, 25, 30, 15</text>
    <circle cx="50" cy="80" r="4" fill="red"/>
    <circle cx="100" cy="80" r="4" fill="red"/>
    <circle cx="150" cy="80" r="4" fill="red"/>
    <circle cx="100" cy="120" r="4" fill="red"/>
    <circle cx="50" cy="80" r="4" fill="none" stroke="red" stroke-width="2"/>
    <text x="40" y="70" font-size="10">15</text>
    <text x="90" y="70" font-size="10">20</text>
    <text x="140" y="70" font-size="10">25</text>
    <text x="90" y="135" font-size="10">30</text>
    <polygon points="50,80 100,80 150,80 100,120" fill="none" stroke="blue" stroke-width="2" stroke-dasharray="3,3"/>
  </svg>`,

  // Soru 8: Üçgen Prizma
  triangular_prism: `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <polygon points="100,30 40,100 160,100" fill="none" stroke="black" stroke-width="2"/>
    <polygon points="100,30 80,50 140,50" fill="none" stroke="black" stroke-width="2" stroke-dasharray="5,5"/>
    <line x1="40" y1="100" x2="30" y2="120" stroke="black" stroke-width="2"/>
    <line x1="160" y1="100" x2="150" y2="120" stroke="black" stroke-width="2"/>
    <line x1="30" y1="120" x2="150" y2="120" stroke="black" stroke-width="2"/>
  </svg>`,

  // Soru 9 & 10: Sıvı Ölçme
  liquid_container_small: `<svg width="100" height="150" viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="40" width="60" height="80" fill="lightblue" stroke="black" stroke-width="2" opacity="0.5"/>
    <rect x="20" y="40" width="60" height="5" fill="none" stroke="black" stroke-width="2"/>
    <text x="25" y="135" font-size="12" font-weight="bold">Bardak</text>
  </svg>`,

  liquid_container_large: `<svg width="120" height="150" viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">
    <polygon points="25,50 95,50 100,130 20,130" fill="lightblue" stroke="black" stroke-width="2" opacity="0.5"/>
    <polygon points="25,50 95,50 95,55 25,55" fill="none" stroke="black" stroke-width="2"/>
    <text x="30" y="135" font-size="12" font-weight="bold">Kova</text>
  </svg>`,
};

async function updateGeometryShapes() {
  console.log("🎨 Geometri Soruları Şekil Güncellemesi\n");

  const topic = await db.curriculumTopic.findFirst({
    where: {
      gradeLevel: 2,
      subject: "MATEMATIK",
      name: "Nesnelerin Geometrisi"
    }
  });

  if (!topic) {
    console.log("❌ Geometri konusu bulunamadı!");
    await db.$disconnect();
    return;
  }

  const updates = [
    { index: 0, shape: "cube", name: "Küp" },
    { index: 1, shape: "triangle", name: "Üçgen" },
    { index: 2, shape: "rectangular_prism", name: "Kare Prizma" },
    { index: 3, shape: "liquid_container_small", name: "Sıvı Ölçme (Bardak)" },
    { index: 4, shape: "liquid_container_large", name: "Sıvı Ölçme (Kova)" },
    { index: 5, shape: "rectangular_prism", name: "Dikdörtgen Prizma" },
    { index: 6, shape: "square_rectangle", name: "Kare/Dikdörtgen" },
    { index: 7, shape: "triangular_prism", name: "Üçgen Prizma" },
    { index: 8, shape: "liquid_container_small", name: "Sıvı Ölçme (Bardak)" },
    { index: 9, shape: "liquid_container_large", name: "Sıvı Ölçme (Kova)" },
  ];

  for (const update of updates) {
    const questions = await db.levelAssessmentQuestion.findMany({
      where: {
        topicId: topic.id,
        gradeLevel: 2,
        subject: "MATEMATIK",
      },
      orderBy: { createdAt: "asc" },
    });

    if (questions[update.index]) {
      const q = questions[update.index];
      await db.levelAssessmentQuestion.update({
        where: { id: q.id },
        data: {
          imageData: GEOMETRY_SHAPES[update.shape],
          imageFormat: "svg",
        },
      });

      console.log(`✓ Soru ${update.index + 1}: ${update.name} şekli eklendi`);
    }
  }

  console.log("\n✅ Şekil güncellemesi tamamlandı!");
  await db.$disconnect();
}

updateGeometryShapes().catch(console.error);
