"use client";

import { useState } from "react";

interface Report {
  topicsCovered: string;
  nextSteps: string;
  homework: string | null;
  notes: string | null;
  createdAt: string | Date;
}

export default function LessonReportViewer({ report }: { report: Report }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-caption bg-primary-fixed text-on-primary-fixed px-3 py-1.5 rounded-full font-semibold hover:opacity-90 transition text-center"
      >
        📋 Ders Raporu
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-surface-container-lowest rounded-md p-6 w-full max-w-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-semibold text-on-background text-headline-md">Ders Raporu</h2>
              <button onClick={() => setOpen(false)} className="text-on-surface-variant hover:text-on-background transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-surface-container-low rounded-md p-4">
                <p className="text-label-md text-on-surface-variant mb-1">İşlenen Konular</p>
                <p className="text-on-background text-body-md leading-relaxed">{report.topicsCovered}</p>
              </div>

              <div className="bg-surface-container-low rounded-md p-4">
                <p className="text-label-md text-on-surface-variant mb-1">Sonraki Ders Planı</p>
                <p className="text-on-background text-body-md leading-relaxed">{report.nextSteps}</p>
              </div>

              {report.homework && (
                <div className="bg-secondary-container rounded-md p-4">
                  <p className="text-label-md text-on-secondary-container mb-1">Ödev</p>
                  <p className="text-on-secondary-container text-body-md leading-relaxed">{report.homework}</p>
                </div>
              )}

              {report.notes && (
                <div className="bg-surface-container-low rounded-md p-4">
                  <p className="text-label-md text-on-surface-variant mb-1">Öğretmen Notu</p>
                  <p className="text-on-background text-body-md leading-relaxed">{report.notes}</p>
                </div>
              )}

              <p className="text-caption text-on-surface-variant text-right">
                {new Date(report.createdAt as string).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
