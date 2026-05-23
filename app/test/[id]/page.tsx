"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { SUBJECT_LABELS, GRADE_LABELS } from "@/lib/utils";

interface Question {
  index: number;
  question: string;
  options: [string, string, string, string];
}

interface AssessmentData {
  id: string;
  subject: string;
  gradeLevel: string;
  questions: Question[];
}

export default function TestPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<AssessmentData | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [step, setStep] = useState<"loading" | "test" | "done" | "error" | "already_done">("loading");
  const [score, setScore] = useState<{ correct: number; total: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/assessments/${id}`)
      .then(async (r) => {
        if (r.status === 409) { setStep("already_done"); return; }
        if (!r.ok) { const d = await r.json(); setErrorMsg(d.error ?? "Hata"); setStep("error"); return; }
        const d = await r.json();
        setData(d);
        setStep("test");
      })
      .catch(() => { setErrorMsg("Bağlantı hatası."); setStep("error"); });
  }, [id]);

  async function handleSubmit() {
    if (!data) return;
    const answered = Object.keys(answers).length;
    if (answered < data.questions.length) {
      alert("Lütfen tüm soruları yanıtlayın.");
      return;
    }
    setSubmitting(true);
    const res = await fetch(`/api/assessments/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        answers: Object.entries(answers).map(([index, selected]) => ({
          index: Number(index),
          selected,
        })),
      }),
    });
    setSubmitting(false);
    if (res.ok) {
      const result = await res.json();
      setScore(result);
      setStep("done");
    } else {
      const d = await res.json();
      alert(d.error ?? "Gönderim başarısız");
    }
  }

  if (step === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-on-surface-variant">Yükleniyor…</p>
      </div>
    );
  }

  if (step === "already_done") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-surface-container-lowest rounded-md p-8 soft-card-static max-w-sm w-full text-center">
          <p className="text-4xl mb-4">✅</p>
          <h2 className="font-display text-headline-md text-on-background mb-2">Test Tamamlandı</h2>
          <p className="text-on-surface-variant text-body-md">Bu test daha önce yanıtlanmış. Teşekkürler!</p>
        </div>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-surface-container-lowest rounded-md p-8 soft-card-static max-w-sm w-full text-center">
          <p className="text-4xl mb-4">❌</p>
          <h2 className="font-display text-headline-md text-on-background mb-2">Bir hata oluştu</h2>
          <p className="text-on-surface-variant text-body-md">{errorMsg}</p>
        </div>
      </div>
    );
  }

  if (step === "done" && score) {
    const pct = Math.round((score.correct / score.total) * 100);
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-surface-container-lowest rounded-md p-8 soft-card-static max-w-sm w-full text-center">
          <p className="text-5xl mb-4">🎉</p>
          <h2 className="font-display text-headline-lg text-on-background mb-2">Harika!</h2>
          <p className="text-on-surface-variant text-body-md mb-6">Testi tamamladın.</p>
          <div className="bg-primary-fixed rounded-md p-6 mb-4">
            <p className="font-display text-5xl font-bold text-primary mb-1">{pct}%</p>
            <p className="text-on-surface-variant text-body-md">{score.correct} / {score.total} doğru</p>
          </div>
          <p className="text-on-surface-variant text-sm">
            Sonuçların öğretmenine iletildi. İlk derste sana özel bir program hazırlanacak!
          </p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const answered = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary-fixed text-on-primary-fixed rounded-full px-4 py-1.5 text-label-md mb-4">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
            </svg>
            Seviye Belirleme Testi
          </div>
          <h1 className="font-display text-headline-lg text-on-background mb-2">
            {SUBJECT_LABELS[data.subject] ?? data.subject}
          </h1>
          <p className="text-on-surface-variant text-body-md">
            {GRADE_LABELS[data.gradeLevel] ?? data.gradeLevel} · {data.questions.length} soru
          </p>
          <div className="mt-3 h-2 bg-surface-container-low rounded-full overflow-hidden max-w-xs mx-auto">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${(answered / data.questions.length) * 100}%` }}
            />
          </div>
          <p className="text-caption text-on-surface-variant mt-1">{answered}/{data.questions.length} yanıtlandı</p>
        </div>

        {/* Sorular */}
        <div className="space-y-6">
          {data.questions.map((q, qi) => (
            <div key={qi} className="bg-surface-container-lowest rounded-md p-6 soft-card-static border border-outline-variant/30">
              <p className="font-display font-semibold text-on-background mb-4">
                <span className="text-primary mr-2">{qi + 1}.</span>{q.question}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {q.options.map((opt, oi) => (
                  <button
                    key={oi}
                    onClick={() => setAnswers((prev) => ({ ...prev, [q.index]: oi }))}
                    className={`text-left px-4 py-3 rounded-md border-2 text-body-md transition-all duration-150 ${
                      answers[q.index] === oi
                        ? "border-primary bg-primary-fixed text-on-primary-fixed font-semibold"
                        : "border-outline-variant bg-surface-container-low text-on-background hover:border-primary/50"
                    }`}
                  >
                    <span className="font-bold mr-2 text-primary/70">
                      {["A", "B", "C", "D"][oi]})
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleSubmit}
            disabled={submitting || answered < data.questions.length}
            className="bg-primary text-on-primary rounded-full px-8 py-4 font-display font-bold text-body-md squishy-btn disabled:opacity-50 transition-opacity"
          >
            {submitting ? "Gönderiliyor…" : "Testi Tamamla"}
          </button>
          {answered < data.questions.length && (
            <p className="text-caption text-on-surface-variant mt-2">
              Tüm soruları yanıtladıktan sonra gönderebilirsiniz.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
