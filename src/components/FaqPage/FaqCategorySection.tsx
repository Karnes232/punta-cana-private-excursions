"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategorySectionProps {
  title: string;
  icon?: string | null;
  items: FaqItem[];
}

export function FaqCategorySection({ title, icon, items }: FaqCategorySectionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="mb-16 last:mb-0">
      <div className="flex items-center gap-3 mb-6">
        {icon && (
          <span className="w-9 h-9 rounded-full bg-ocean/10 text-ocean flex items-center justify-center text-base">
            {icon}
          </span>
        )}
        <h2 className="font-heading font-bold text-2xl text-slate-dark tracking-[-0.015em]">
          {title}
        </h2>
      </div>
      <div className="divide-y divide-sand-dark border-y border-sand-dark">
        {items.map((f, i) => {
          const open = openIdx === i;
          return (
            <div key={i}>
              <button
                type="button"
                onClick={() => setOpenIdx(open ? null : i)}
                aria-expanded={open}
                className="w-full py-5 flex items-start justify-between gap-6 text-left group"
              >
                <span
                  className={`font-heading font-semibold text-base sm:text-lg leading-snug transition-colors ${
                    open ? "text-ocean" : "text-slate-dark group-hover:text-ocean"
                  }`}
                >
                  {f.question}
                </span>
                <span
                  aria-hidden
                  className={`mt-1 flex-none w-6 h-6 rounded-full border border-slate/30 flex items-center justify-center text-slate transition-transform ${
                    open ? "rotate-45 border-ocean text-ocean" : ""
                  }`}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </span>
              </button>
              <div
                className="grid transition-all duration-300"
                style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="text-slate text-sm sm:text-base leading-relaxed pb-5 max-w-prose whitespace-pre-wrap">
                    {f.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
