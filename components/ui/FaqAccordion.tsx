"use client";

import { useState } from "react";

interface FaqItem {
  q: string;
  a: string;
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-slate-200">
      {items.map((item, i) => (
        <div key={i} className="py-4">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between text-left gap-4 cursor-pointer group"
          >
            <span className="text-base font-medium text-navy-900 group-hover:text-gold-600 transition-colors duration-200">
              {item.q}
            </span>
            <svg
              className={`w-5 h-5 text-gold-500 shrink-0 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          {open === i && (
            <p className="mt-3 text-on-surface-variant text-sm leading-relaxed">
              {item.a}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
