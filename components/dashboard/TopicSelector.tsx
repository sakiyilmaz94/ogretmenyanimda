"use client";

import { useState, useEffect } from "react";

interface Topic {
  id: string;
  name: string;
  description?: string | null;
  coveredTopics: string[]; // kapsadığı konular
  questionCount: number;
}

interface TopicSelectorProps {
  subject: string;
  gradeLevel: number;
  onSelect: (topicId: string, topicName: string) => void;
  selected?: string;
}

export default function TopicSelector({
  subject,
  gradeLevel,
  onSelect,
  selected,
}: TopicSelectorProps) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!subject || gradeLevel === undefined) return;

    setLoading(true);
    setError(null);

    const url = `/api/curriculum/topics?subject=${encodeURIComponent(subject)}&gradeLevel=${gradeLevel}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Konular yüklenemedi");
        return res.json();
      })
      .then((data) => setTopics(data))
      .catch((e) => {
        console.error("Topic fetch error:", e);
        setError("Konular yüklenirken hata oluştu");
      })
      .finally(() => setLoading(false));
  }, [subject, gradeLevel]);

  if (!subject || gradeLevel === undefined) return null;

  return (
    <div className="space-y-3">
      <div>
        <label className="text-label-md font-semibold text-on-background flex items-center gap-2">
          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.247m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.247" />
          </svg>
          Ünite / Tema Seçimi *
        </label>
        <p className="text-caption text-on-surface-variant mt-1">
          Sınav, seçtiğiniz ünitenin sorularından oluşur. Kart üzerinde o ünitede
          ele alınan konuları görebilirsiniz.
        </p>
      </div>

      {loading && (
        <p className="text-caption text-on-surface-variant">Üniteler yükleniyor...</p>
      )}

      {error && <p className="text-caption text-error">{error}</p>}

      {topics.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {topics.map((topic) => {
            const isSelected = selected === topic.id;
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => onSelect(topic.id, topic.name)}
                aria-pressed={isSelected}
                className={`text-left rounded-xl border-2 p-4 transition-all ${
                  isSelected
                    ? "border-primary bg-primary-fixed shadow-md"
                    : "border-outline-variant bg-surface-container-lowest hover:border-primary/50 hover:bg-surface-container"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span
                    className={`font-display font-semibold text-body-md leading-snug ${
                      isSelected ? "text-on-primary-fixed" : "text-on-background"
                    }`}
                  >
                    {topic.name}
                  </span>
                  <span
                    className={`shrink-0 text-caption font-semibold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container-high text-on-surface-variant"
                    }`}
                  >
                    {topic.questionCount} soru
                  </span>
                </div>

                {topic.coveredTopics.length > 0 && (
                  <ul className="space-y-1">
                    {topic.coveredTopics.map((konu, i) => (
                      <li
                        key={i}
                        className={`flex items-start gap-1.5 text-caption ${
                          isSelected ? "text-on-primary-fixed/80" : "text-on-surface-variant"
                        }`}
                      >
                        <span className={isSelected ? "text-primary" : "text-primary/60"}>•</span>
                        <span>{konu}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {isSelected && (
                  <div className="mt-3 flex items-center gap-1.5 text-caption font-semibold text-primary">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Bu ünite seçildi
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {!loading && topics.length === 0 && !error && (
        <p className="text-caption text-on-surface-variant">
          Bu ders için bu sınıfta henüz ünite/soru tanımlı değil.
        </p>
      )}
    </div>
  );
}
