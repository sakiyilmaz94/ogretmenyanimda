"use client";

import { useState, useEffect } from "react";

interface Topic {
  id: string;
  name: string;
  description?: string;
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

    fetch(`/api/curriculum/topics?subject=${encodeURIComponent(subject)}&gradeLevel=${gradeLevel}`)
      .then((res) => {
        if (!res.ok) throw new Error("Konular yüklenemedi");
        return res.json();
      })
      .then(setTopics)
      .catch((e) => {
        console.error("Topic fetch error:", e);
        setError("Konular yüklenirken hata oluştu");
      })
      .finally(() => setLoading(false));
  }, [subject, gradeLevel]);

  if (!subject || gradeLevel === undefined) return null;

  return (
    <div className="space-y-2">
      <label className="text-label-sm font-medium text-on-surface-variant">
        📚 Seçilen Konu *
      </label>

      {loading && (
        <p className="text-caption text-on-surface-variant">Konular yükleniyor...</p>
      )}

      {error && <p className="text-caption text-error">{error}</p>}

      {topics.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => onSelect(topic.id, topic.name)}
                title={topic.description || topic.name}
                className={`px-3 py-2.5 rounded-lg font-medium text-caption transition text-center ${
                  selected === topic.id
                    ? "bg-primary text-on-primary shadow-md scale-105"
                    : "bg-surface-container border border-outline-variant text-on-surface-variant hover:border-primary/50 hover:bg-surface-container-high hover:scale-105"
                }`}
              >
                {topic.name}
              </button>
            ))}
          </div>
          {selected && (
            <div className="mt-3 p-3 bg-primary-fixed rounded-lg text-on-primary-fixed text-body-sm flex items-center gap-2">
              <span className="text-lg">✓</span>
              <div>
                <span className="block font-semibold">Seçilen konu:</span>
                <span className="block">{topics.find((t) => t.id === selected)?.name}</span>
              </div>
            </div>
          )}
        </>
      )}

      {!loading && topics.length === 0 && !error && (
        <p className="text-caption text-on-surface-variant">Bu dersin konuları bulunamadı.</p>
      )}
    </div>
  );
}
