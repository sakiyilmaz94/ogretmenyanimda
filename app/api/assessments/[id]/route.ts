import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notify } from "@/lib/notify";
import { sendEmail } from "@/lib/email";
import { SUBJECT_LABELS, GRADE_LABELS } from "@/lib/utils";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const assessment = await db.levelAssessment.findUnique({
    where: { id },
    include: { responses: true, topic: true },
  });

  if (!assessment) return NextResponse.json({ error: "Test bulunamadı" }, { status: 404 });
  if (assessment.status === "COMPLETED") {
    return NextResponse.json({ error: "Bu test zaten tamamlandı." }, { status: 409 });
  }

  try {
    // Grade level'i sayıya dönüştür
    const gradeMap: Record<string, number> = {
      ILKOKUL_1: 1,
      ILKOKUL_2: 2,
      ILKOKUL_3: 3,
      ILKOKUL_4: 4,
      ORTAOKUL_5: 5,
      ORTAOKUL_6: 6,
      ORTAOKUL_7: 7,
      ORTAOKUL_8: 8,
    };

    const gradeNumber = gradeMap[assessment.gradeLevel as string] || 2;

    // Database'den soruları çek
    const questions = await db.levelAssessmentQuestion.findMany({
      where: {
        gradeLevel: gradeNumber,
        subject: assessment.subject,
        topicId: assessment.topicId || undefined,
      },
      take: 10,
    });

    if (questions.length === 0) {
      return NextResponse.json({ error: "Sorular bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({
      id: assessment.id,
      subject: assessment.subject,
      gradeLevel: assessment.gradeLevel,
      questions: questions.map((q, i) => ({
        index: i,
        question: q.question,
        // 4 seçenek - cevap anahtarı server-side gizli
        options: [q.option1, q.option2, q.option3, q.option4].filter(Boolean),
        image: q.imageData ? {
          data: q.imageData,
          format: q.imageFormat || "svg"
        } : null,
      })),
    });
  } catch (error) {
    console.error("Soru çekme hatası:", error);
    return NextResponse.json(
      { error: "Sorular oluşturulamadı" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const assessment = await db.levelAssessment.findUnique({
    where: { id },
    include: {
      booking: {
        include: {
          educator: { include: { user: true } },
          student: true,
        },
      },
      topic: true,
    },
  });
  if (!assessment) return NextResponse.json({ error: "Test bulunamadı" }, { status: 404 });
  if (assessment.status === "COMPLETED") {
    return NextResponse.json({ error: "Bu test zaten tamamlandı." }, { status: 409 });
  }

  const { answers } = await req.json() as { answers: { index: number; selected: number }[] };

  try {
    // Grade level'i sayıya dönüştür
    const gradeMap: Record<string, number> = {
      ILKOKUL_1: 1,
      ILKOKUL_2: 2,
      ILKOKUL_3: 3,
      ILKOKUL_4: 4,
      ORTAOKUL_5: 5,
      ORTAOKUL_6: 6,
      ORTAOKUL_7: 7,
      ORTAOKUL_8: 8,
    };

    const gradeNumber = gradeMap[assessment.gradeLevel as string] || 2;

    // Database'den soruları çek
    const questions = await db.levelAssessmentQuestion.findMany({
      where: {
        gradeLevel: gradeNumber,
        subject: assessment.subject,
        topicId: assessment.topicId || undefined,
      },
      take: 10,
    });

    if (questions.length === 0) {
      return NextResponse.json({ error: "Sorular bulunamadı" }, { status: 404 });
    }

    // Cevapları kaydet ve puanla
    let correct = 0;
    await db.$transaction([
      db.assessmentResponse.deleteMany({ where: { assessmentId: id } }),
      ...answers.map((a) =>
        db.assessmentResponse.create({
          data: {
            assessmentId: id,
            questionIndex: a.index,
            selectedAnswer: a.selected,
          },
        })
      ),
      db.levelAssessment.update({
        where: { id },
        data: { status: "COMPLETED", completedAt: new Date() },
      }),
    ]);

    // Doğru cevapları hesapla
    correct = answers.filter((a) => questions[a.index]?.correctAnswer === a.selected).length;

    // Öğretmene bildirim ve email gönder
    const educator = assessment.booking.educator;
    const student = assessment.booking.student;
    const subjectLabel = SUBJECT_LABELS[assessment.subject] ?? assessment.subject;
    const gradeLabel = GRADE_LABELS[assessment.gradeLevel] ?? assessment.gradeLevel;
    const pct = Math.round((correct / questions.length) * 100);

    await notify({
      userId: educator.userId,
      title: "Seviye Testi Tamamlandı 📊",
      message: `${student.name}, ${subjectLabel} (${gradeLabel}) seviye testini tamamladı. Sonuç: ${correct}/${questions.length} (${pct}%)`,
      link: "/educator/bookings",
    });

    sendEmail({
      to: educator.user.email,
      subject: `${student.name} seviye testini tamamladı — ${subjectLabel}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
          <h2 style="color:#0f172a">Seviye Testi Sonucu 📊</h2>
          <p>Merhaba <strong>${educator.user.name ?? "Öğretmenim"}</strong>,</p>
          <p><strong>${student.name}</strong>, <strong>${subjectLabel}</strong> (${gradeLabel}) seviye belirleme testini tamamladı.</p>
          <div style="background:#f1f5f9;border-radius:12px;padding:20px;margin:16px 0;text-align:center">
            <p style="font-size:36px;font-weight:bold;color:#0f172a;margin:0">${pct}%</p>
            <p style="color:#64748b;margin:4px 0">${correct} / ${questions.length} doğru</p>
          </div>
          <p>İlk ders planını hazırlarken bu sonucu göz önünde bulundurabilirsiniz.</p>
        </div>`,
    }).catch(console.error);

    return NextResponse.json({ correct, total: questions.length });
  } catch (error) {
    console.error("Test tamamlama hatası:", error);
    return NextResponse.json(
      { error: "Test tamamlanamadı" },
      { status: 500 }
    );
  }
}
