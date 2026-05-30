import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const grade2Topics = await req.json();

    console.log("🚀 Grade 2 Müfredat Yükleme Başladı");

    // Türkçe konuları ekle
    console.log("📝 Türkçe konuları ekleniyor...");
    const turkishTopics = grade2Topics.grade2_turkce.map(
      (t: { name: string; description?: string }) => ({
        gradeLevel: 2,
        subject: "TÜRKÇE",
        name: t.name,
        description: t.description || "",
      })
    );

    let turkishCount = 0;
    for (const topic of turkishTopics) {
      try {
        await db.curriculumTopic.create({ data: topic });
        turkishCount++;
        console.log(`   ✓ ${topic.name}`);
      } catch (e: any) {
        if (e.code === "P2002") {
          console.log(`   ⊘ ${topic.name} (zaten var)`);
        } else {
          throw e;
        }
      }
    }

    // Matematik konuları ekle
    console.log("\n🔢 Matematik konuları ekleniyor...");
    const mathTopics = grade2Topics.grade2_matematik.map(
      (t: { name: string; description?: string }) => ({
        gradeLevel: 2,
        subject: "MATEMATIK",
        name: t.name,
        description: t.description || "",
      })
    );

    let mathCount = 0;
    for (const topic of mathTopics) {
      try {
        await db.curriculumTopic.create({ data: topic });
        mathCount++;
        console.log(`   ✓ ${topic.name}`);
      } catch (e: any) {
        if (e.code === "P2002") {
          console.log(`   ⊘ ${topic.name} (zaten var)`);
        } else {
          throw e;
        }
      }
    }

    // Sonuç
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

    return NextResponse.json({
      success: true,
      message: "Grade 2 müfredat başarıyla yüklendi",
      turkish: finalTurkish,
      math: finalMath,
      total: finalTurkish + finalMath,
    });
  } catch (error) {
    console.error("❌ Hata:", error);
    return NextResponse.json(
      { error: "Müfredat yüklemesi başarısız", details: String(error) },
      { status: 500 }
    );
  }
}
