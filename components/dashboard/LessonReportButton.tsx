"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LessonReportViewer, { type LessonReportData } from "@/components/dashboard/LessonReportViewer";

interface Props {
  bookingId: string;
  studentName: string;
  report: LessonReportData | null;
}

const MASTERY_LABELS = ["Henüz başlıyor", "Gelişiyor", "İyi düzeyde", "Tam hakim"];

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} type="button" onClick={() => onChange(i)}
          className={`text-xl leading-none transition ${i <= value ? "text-[#EF9F27]" : "text-outline-variant hover:text-[#EF9F27]/50"}`}>
          {i <= value ? "★" : "☆"}
        </button>
      ))}
    </div>
  );
}

export default function LessonReportButton({ bookingId, studentName, report }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [topics, setTopics] = useState<string[]>([]);
  const [topicInput, setTopicInput] = useState("");
  const [participation, setParticipation] = useState(0);
  const [comprehension, setComprehension] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [mastery, setMastery] = useState(0); // 1-4
  const [highlight, setHighlight] = useState("");
  const [homework, setHomework] = useState<{ title: string; source: string }[]>([]);
  const [parentTip, setParentTip] = useState("");

  // Rapor zaten gönderilmişse: yeşil rozet + görüntüle
  if (report) {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 text-caption font-semibold text-on-secondary-container bg-secondary-container px-2.5 py-1 rounded-full">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 011.4-1.4L8 12.6l7.3-7.3a1 1 0 011.4 0z" clipRule="evenodd" /></svg>
          Rapor gönderildi
        </span>
        <LessonReportViewer report={report} label="Görüntüle" />
      </div>
    );
  }

  function addTopic() {
    const t = topicInput.trim();
    if (t && topics.length < 5 && !topics.includes(t)) setTopics([...topics, t]);
    setTopicInput("");
  }
  const valid = topics.length > 0 && participation > 0 && comprehension > 0 && confidence > 0 && mastery > 0;

  async function submit() {
    if (!valid) { setError("İşlenen konu ve 4 değerlendirme alanı zorunlu."); return; }
    setLoading(true); setError("");
    const res = await fetch("/api/teacher/lesson-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingId, topics, participation, comprehension, confidence, mastery,
        highlight: highlight.trim() || undefined,
        homework: homework.filter((h) => h.title.trim()),
        parentTip: parentTip.trim() || undefined,
      }),
    });
    setLoading(false);
    if (!res.ok) { const d = await res.json().catch(() => ({})); setError(d.error ?? "Gönderilemedi."); return; }
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <span className="text-caption font-semibold text-on-tertiary-fixed bg-tertiary-fixed px-2.5 py-1 rounded-full">Rapor bekliyor</span>
        <button onClick={() => setOpen(true)} className="text-caption bg-primary text-on-primary px-3 py-1.5 rounded-full font-semibold hover:opacity-90 transition">
          Rapor Gönder
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-lg max-h-[88vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-outline-variant/20 sticky top-0 bg-surface-container-lowest z-10">
              <h2 className="font-display font-semibold text-on-background text-headline-md">Ders Dönüt Raporu</h2>
              <button onClick={() => setOpen(false)} className="text-on-surface-variant hover:text-on-background p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Konular */}
              <div>
                <label className="block text-label-md font-semibold text-on-background mb-1.5">Bu ders ne işlendi? <span className="text-error">*</span></label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {topics.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 text-caption font-semibold px-2.5 py-1 rounded-full" style={{ background: "#EEEDFE", color: "#26215C" }}>
                      {t}
                      <button type="button" onClick={() => setTopics(topics.filter((x) => x !== t))} className="hover:opacity-70">✕</button>
                    </span>
                  ))}
                </div>
                {topics.length < 5 && (
                  <input value={topicInput} onChange={(e) => setTopicInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTopic(); } }}
                    onBlur={addTopic}
                    placeholder="Konu yaz + Enter (en fazla 5)"
                    className="w-full px-4 py-2.5 bg-surface-container rounded-lg border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/40 text-on-background text-body-md" />
                )}
              </div>

              {/* Değerlendirme */}
              <div className="space-y-3">
                <label className="block text-label-md font-semibold text-on-background">{studentName} bugün nasıldı? <span className="text-error">*</span></label>
                {([["Derse katılım", participation, setParticipation], ["Konuyu anlama hızı", comprehension, setComprehension], ["Özgüven & isteklilik", confidence, setConfidence]] as [string, number, (n: number) => void][]).map(([label, val, setter]) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-body-md text-on-surface-variant">{label}</span>
                    <StarPicker value={val} onChange={setter} />
                  </div>
                ))}
                <div>
                  <span className="text-body-md text-on-surface-variant">Konu hakimiyeti</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mt-1.5">
                    {MASTERY_LABELS.map((label, i) => (
                      <button key={label} type="button" onClick={() => setMastery(i + 1)}
                        className={`px-2 py-1.5 rounded-lg text-caption font-semibold border transition ${mastery === i + 1 ? "text-on-primary" : "border-outline-variant text-on-surface-variant hover:bg-surface-container"}`}
                        style={mastery === i + 1 ? { background: "#534AB7", borderColor: "#534AB7" } : {}}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* En güzel an */}
              <div>
                <label className="block text-label-md font-semibold text-on-background mb-1.5">Bugünün en güzel anı <span className="text-on-surface-variant font-normal">(opsiyonel)</span></label>
                <input value={highlight} maxLength={200} onChange={(e) => setHighlight(e.target.value)}
                  placeholder="Örn: Konuyu kendi kendine fark ettiği an..."
                  className="w-full px-4 py-2.5 bg-surface-container rounded-lg border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/40 text-on-background text-body-md" />
              </div>

              {/* Ödev */}
              <div>
                <label className="block text-label-md font-semibold text-on-background mb-1.5">Eve ödev <span className="text-on-surface-variant font-normal">(opsiyonel)</span></label>
                <div className="space-y-2">
                  {homework.map((h, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={h.title} onChange={(e) => setHomework(homework.map((x, j) => j === i ? { ...x, title: e.target.value } : x))}
                        placeholder="Ödev açıklaması"
                        className="flex-1 px-3 py-2 bg-surface-container rounded-lg border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/40 text-on-background text-body-md" />
                      <input value={h.source} onChange={(e) => setHomework(homework.map((x, j) => j === i ? { ...x, source: e.target.value } : x))}
                        placeholder="Kaynak"
                        className="w-28 px-3 py-2 bg-surface-container rounded-lg border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/40 text-on-background text-body-md" />
                      <button type="button" onClick={() => setHomework(homework.filter((_, j) => j !== i))} className="text-on-surface-variant hover:text-error px-1">✕</button>
                    </div>
                  ))}
                  {homework.length < 3 && (
                    <button type="button" onClick={() => setHomework([...homework, { title: "", source: "" }])}
                      className="text-caption text-primary font-semibold hover:underline">+ Ödev ekle</button>
                  )}
                </div>
              </div>

              {/* Veliye tavsiye */}
              <div>
                <label className="block text-label-md font-semibold text-on-background mb-1.5">Veliye tavsiye <span className="text-on-surface-variant font-normal">(opsiyonel)</span></label>
                <textarea value={parentTip} maxLength={300} rows={3} onChange={(e) => setParentTip(e.target.value)}
                  placeholder="Evde nasıl destek olabilirler?"
                  className="w-full px-4 py-2.5 bg-surface-container rounded-lg border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/40 text-on-background text-body-md resize-none" />
              </div>

              {error && <p className="text-caption text-on-error-container bg-error-container px-3 py-2 rounded-lg">{error}</p>}

              <div className="flex flex-col gap-2 pt-1">
                <button onClick={submit} disabled={loading || !valid}
                  className="w-full bg-primary text-on-primary rounded-full py-3 font-display font-semibold text-label-md squishy-btn disabled:opacity-50">
                  {loading ? "Gönderiliyor…" : "Raporu Gönder"}
                </button>
                <button onClick={() => setOpen(false)} className="text-caption text-on-surface-variant hover:text-on-background transition text-center">
                  Şimdi değil, sonra gönder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
