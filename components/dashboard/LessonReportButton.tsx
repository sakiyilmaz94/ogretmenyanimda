"use client";

import { useState } from "react";

interface Props {
  bookingId: string;
  hasReport: boolean;
}

export default function LessonReportButton({ bookingId, hasReport }: Props) {
  const [open, setOpen] = useState(false);
  const [topicsCovered, setTopicsCovered] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const [homework, setHomework] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(hasReport);
  const [error, setError] = useState("");

  if (done) {
    return (
      <span className="text-caption text-secondary font-medium">✓ Rapor gönderildi</span>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/lesson-reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId, topicsCovered, nextSteps, homework, notes }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error ?? "Hata oluştu."); return; }
    setDone(true); setOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-caption bg-primary text-on-primary px-3 py-1.5 rounded-full font-semibold hover:bg-primary/90 transition-colors"
      >
        Rapor Doldur
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-surface-container-lowest rounded-md p-6 w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-semibold text-on-background text-headline-md">Ders Raporu</h2>
              <button onClick={() => setOpen(false)} className="text-on-surface-variant hover:text-on-background transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-label-md text-on-surface-variant mb-1.5">İşlenen Konular *</label>
                <textarea
                  value={topicsCovered}
                  onChange={(e) => setTopicsCovered(e.target.value)}
                  placeholder="Bu derste hangi konuları işlediniz?"
                  rows={3}
                  required
                  className="w-full px-4 py-2.5 bg-surface-container-low rounded-md border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary text-on-background resize-none"
                />
              </div>

              <div>
                <label className="block text-label-md text-on-surface-variant mb-1.5">Sonraki Ders Planı *</label>
                <textarea
                  value={nextSteps}
                  onChange={(e) => setNextSteps(e.target.value)}
                  placeholder="Bir sonraki derste ne işlenecek? Öğrencinin gelişimi nasıl?"
                  rows={3}
                  required
                  className="w-full px-4 py-2.5 bg-surface-container-low rounded-md border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary text-on-background resize-none"
                />
              </div>

              <div>
                <label className="block text-label-md text-on-surface-variant mb-1.5">Ödev</label>
                <textarea
                  value={homework}
                  onChange={(e) => setHomework(e.target.value)}
                  placeholder="Ödev verdiyseniz belirtin (isteğe bağlı)"
                  rows={2}
                  className="w-full px-4 py-2.5 bg-surface-container-low rounded-md border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary text-on-background resize-none"
                />
              </div>

              <div>
                <label className="block text-label-md text-on-surface-variant mb-1.5">Genel Notlar</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Veliye eklemek istediğiniz başka bilgiler (isteğe bağlı)"
                  rows={2}
                  className="w-full px-4 py-2.5 bg-surface-container-low rounded-md border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary text-on-background resize-none"
                />
              </div>

              {error && <p className="text-sm text-on-error-container bg-error-container px-4 py-2 rounded-md">{error}</p>}

              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary text-on-primary rounded-full py-2.5 font-display font-semibold text-label-md squishy-btn disabled:opacity-50"
                >
                  {loading ? "Gönderiliyor…" : "Raporu Gönder"}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-outline-variant text-on-surface-variant text-label-md hover:bg-surface-container transition-colors"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
