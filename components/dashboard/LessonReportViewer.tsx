"use client";

import { useState } from "react";

export interface LessonReportData {
  topics: string[];
  participation: number;
  comprehension: number;
  confidence: number;
  mastery: number;
  highlight: string | null;
  homework: { title: string; source?: string }[] | null;
  parentTip: string | null;
  createdAt: string | Date;
  educatorName?: string;
  studentName?: string;
}

const MASTERY = ["", "Henüz başlıyor", "Gelişiyor", "İyi düzeyde", "Tam hakim"];

function Stars({ n }: { n: number }) {
  return (
    <span className="whitespace-nowrap">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= n ? "text-[#EF9F27]" : "text-outline-variant"} style={{ fontSize: 17 }}>
          {i <= n ? "★" : "☆"}
        </span>
      ))}
    </span>
  );
}

export function LessonReportContent({ data }: { data: LessonReportData }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-label-md font-semibold text-on-background mb-2">Bu ders ne işledik?</p>
        <div className="flex flex-wrap gap-1.5">
          {data.topics.length ? data.topics.map((t, i) => (
            <span key={i} className="text-caption font-semibold px-3 py-1 rounded-full" style={{ background: "#EEEDFE", color: "#26215C" }}>{t}</span>
          )) : <span className="text-caption text-on-surface-variant">—</span>}
        </div>
      </div>

      <div className="border-t border-outline-variant/20 pt-3">
        <p className="text-label-md font-semibold text-on-background mb-2">Bugün nasıldı?</p>
        <div className="space-y-1.5">
          {([["Derse katılım", data.participation], ["Konuyu anlama hızı", data.comprehension], ["Özgüven & isteklilik", data.confidence]] as [string, number][]).map(([label, n]) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-body-md text-on-surface-variant">{label}</span>
              <Stars n={n} />
            </div>
          ))}
          <div className="pt-1">
            <div className="flex items-center justify-between">
              <span className="text-body-md text-on-surface-variant">Konu hakimiyeti</span>
              <span className="text-caption font-bold" style={{ color: "#534AB7" }}>{MASTERY[data.mastery] ?? ""}</span>
            </div>
            <div className="flex gap-1 mt-1.5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-1 h-2 rounded-full" style={{ background: i <= data.mastery ? "#534AB7" : "#e2e1f5" }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {data.highlight && (
        <div className="rounded-lg p-3.5" style={{ background: "#EEEDFE", borderLeft: "3px solid #534AB7" }}>
          <p className="text-caption font-bold mb-0.5" style={{ color: "#26215C" }}>✨ Bugünün en güzel anı</p>
          <p className="text-body-md italic" style={{ color: "#3a3560" }}>{data.highlight}</p>
        </div>
      )}

      {data.homework && data.homework.length > 0 && (
        <div className="rounded-lg p-3.5 bg-surface-container">
          <p className="text-caption font-bold text-on-background mb-1">📚 Eve ödev</p>
          <ul className="list-disc pl-5 space-y-0.5 text-body-md text-on-surface-variant">
            {data.homework.map((h, i) => (
              <li key={i}>{h.title}{h.source ? <span className="text-on-surface-variant/70"> ({h.source})</span> : null}</li>
            ))}
          </ul>
        </div>
      )}

      {data.parentTip && (
        <div className="rounded-lg p-3.5" style={{ background: "#FAEEDA" }}>
          <p className="text-caption font-bold mb-0.5" style={{ color: "#92651b" }}>💡 Veliye tavsiye</p>
          <p className="text-body-md italic" style={{ color: "#6b4e16" }}>{data.parentTip}</p>
        </div>
      )}
    </div>
  );
}

// Modal açan buton (veli paneli + öğretmen okuma modu)
export default function LessonReportViewer({ report, label = "📋 Raporu Gör" }: { report: LessonReportData; label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}
        className="text-caption bg-primary-fixed text-on-primary-fixed px-3 py-1.5 rounded-full font-semibold hover:opacity-90 transition text-center">
        {label}
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-outline-variant/20 sticky top-0 bg-surface-container-lowest">
              <div>
                <h2 className="font-display font-semibold text-on-background text-headline-md">Ders Dönüt Raporu</h2>
                {(report.studentName || report.educatorName) && (
                  <p className="text-caption text-on-surface-variant mt-0.5">
                    {report.studentName}{report.educatorName ? ` · ${report.educatorName}` : ""}
                  </p>
                )}
              </div>
              <button onClick={() => setOpen(false)} className="text-on-surface-variant hover:text-on-background transition p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-5">
              <LessonReportContent data={report} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
