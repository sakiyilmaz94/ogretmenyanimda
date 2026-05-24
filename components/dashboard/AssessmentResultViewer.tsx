"use client";

import { useState } from "react";
import { SUBJECT_LABELS, GRADE_LABELS } from "@/lib/utils";

interface QuestionResult {
  index: number;
  question: string;
  options: [string, string, string, string];
  correct: number;
  selected: number | null;
}

interface AssessmentResult {
  subject: string;
  gradeLevel: string;
  studentName: string;
  topic?: string | null;
  completedAt: string | null;
  results: QuestionResult[];
  correctCount: number;
  total: number;
}

export default function AssessmentResultViewer({ assessmentId }: { assessmentId: string }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleOpen() {
    setOpen(true);
    if (data) return;
    setLoading(true);
    const res = await fetch(`/api/assessments/${assessmentId}/results`);
    if (res.ok) setData(await res.json());
    setLoading(false);
  }

  const LABELS = ["A", "B", "C", "D"];

  return (
    <>
      <button
        onClick={handleOpen}
        className="text-caption bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-full font-medium hover:opacity-90 transition"
      >
        📊 Seviye testi tamamlandı
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-surface-container-lowest rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Başlık */}
            <div className="flex items-center justify-between p-6 border-b border-outline-variant/20 sticky top-0 bg-surface-container-lowest z-10">
              <div>
                <h2 className="font-display font-semibold text-on-background text-headline-md">
                  Seviye Testi Sonuçları
                </h2>
                {data && (
                  <p className="text-caption text-on-surface-variant mt-0.5">
                    {data.studentName} · {SUBJECT_LABELS[data.subject] ?? data.subject} · {GRADE_LABELS[data.gradeLevel] ?? data.gradeLevel}
                    {data.topic && ` · 📚 ${data.topic}`}
                  </p>
                )}
              </div>
              <button onClick={() => setOpen(false)} className="text-on-surface-variant hover:text-on-background transition-colors p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {loading && (
                <div className="py-12 text-center text-on-surface-variant">Yükleniyor…</div>
              )}

              {data && (
                <>
                  {/* Özet */}
                  <div className="bg-secondary-container rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-label-md text-on-secondary-container">Toplam Puan</p>
                      <p className="font-display text-headline-lg font-bold text-on-secondary-container">
                        {data.correctCount} / {data.total} doğru
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-display-sm font-bold text-on-secondary-container">
                        {Math.round((data.correctCount / data.total) * 100)}%
                      </p>
                    </div>
                  </div>

                  {/* Sorular */}
                  {data.results.map((r) => {
                    const isCorrect = r.selected === r.correct;
                    const isUnanswered = r.selected === null;
                    return (
                      <div
                        key={r.index}
                        className={`rounded-xl border p-4 ${
                          isUnanswered
                            ? "border-outline-variant/30 bg-surface-container-low"
                            : isCorrect
                            ? "border-secondary-container bg-secondary-container/20"
                            : "border-error-container bg-error-container/20"
                        }`}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                            isUnanswered ? "bg-outline-variant/30 text-on-surface-variant"
                            : isCorrect ? "bg-secondary-container text-on-secondary-container"
                            : "bg-error-container text-on-error-container"
                          }`}>
                            {r.index + 1}
                          </span>
                          <p className="text-body-md text-on-background font-medium leading-snug">{r.question}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-9">
                          {r.options.map((opt, oi) => {
                            const isSelected = r.selected === oi;
                            const isCorrectOption = r.correct === oi;
                            let style = "border-outline-variant/30 text-on-surface-variant bg-surface-container-low";
                            if (isCorrectOption) style = "border-secondary-container bg-secondary-container text-on-secondary-container font-semibold";
                            if (isSelected && !isCorrectOption) style = "border-error-container bg-error-container text-on-error-container font-semibold";
                            return (
                              <div key={oi} className={`text-body-sm px-3 py-2 rounded-lg border-2 flex items-center gap-2 ${style}`}>
                                <span className="font-bold shrink-0">{LABELS[oi]})</span>
                                <span>{opt}</span>
                                {isCorrectOption && <span className="ml-auto">✓</span>}
                                {isSelected && !isCorrectOption && <span className="ml-auto">✗</span>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
