import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notify } from "@/lib/notify";
import { sendEmail } from "@/lib/email";
import { SUBJECT_LABELS, GRADE_LABELS } from "@/lib/utils";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface Question {
  question: string;
  options: [string, string, string, string];
  correct: number;
  difficulty: string;
}

async function generateQuestions(
  gradeLevel: string,
  subject: string,
  topicName: string
): Promise<Question[]> {
  const systemPrompt = `Sen Türkiye MEB müfredatına göre ilkokul seviye belirleme sınavı soruları üreten bir sistemsin. Görevin: verilen sınıf, ders ve konuya birebir uygun, o konuyu doğrudan ölçen sorular üretmek. Başka konu veya ders karıştırma. Sadece geçerli JSON döndür, açıklama veya markdown yazma.`;

  const userPrompt = `Sınıf: ${gradeLevel}. Ders: ${subject}. Konu: ${topicName}. Bu bilgilere göre tam olarak 10 çoktan seçmeli soru üret. Kurallar: 1) Her soru yalnızca '${topicName}' konusunu test etsin, başka konu girmesin. 2) Sorular MEB ${gradeLevel}. sınıf ${subject} müfredatına uygun dil ve kavramlarla yazılsın. 3) Her sorunun 4 şıkkı olsun. 4) Zorluk dağılımı: 3 kolay, 4 orta, 3 zor. 5) Sadece şu JSON formatında dön, başka hiçbir şey yazma: {"questions":[{"question":"...","options":["...","...","...","..."],"correct":0,"difficulty":"easy"}]}`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: userPrompt,
      },
    ],
  });

  const responseText =
    message.content[0].type === "text" ? message.content[0].text : "";

  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("JSON bulunamadı");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return parsed.questions;
  } catch (error) {
    console.error("Soru parse hatası:", error, "Response:", responseText);
    throw new Error("Sorular oluşturulamadı");
  }
}

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
    const topicName = (assessment.topic as any)?.name || "Genel";
    const questions = await generateQuestions(
      assessment.gradeLevel,
      assessment.subject,
      topicName
    );

    return NextResponse.json({
      id: assessment.id,
      subject: assessment.subject,
      gradeLevel: assessment.gradeLevel,
      questions: questions.map((q, i) => ({
        index: i,
        question: q.question,
        options: q.options,
      })),
    });
  } catch (error) {
    console.error("Soru üretme hatası:", error);
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
    const topicName = (assessment.topic as any)?.name || "Genel";
    const questions = await generateQuestions(
      assessment.gradeLevel,
      assessment.subject,
      topicName
    );

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

    const correct = answers.filter((a) => questions[a.index]?.correct === a.selected).length;

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
