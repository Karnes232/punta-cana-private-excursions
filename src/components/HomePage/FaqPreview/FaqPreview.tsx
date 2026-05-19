"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqPreviewProps {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  faqs: FaqItem[];
  ctaText?: string;
  ctaHref?: string;
}

export function FaqPreview({
  eyebrow = "Frequently asked",
  heading,
  subheading,
  faqs,
  ctaText,
  ctaHref = "/faq",
}: FaqPreviewProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="section-sand py-24 sm:py-32">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-center mb-12">
          <SectionEyebrow>{eyebrow}</SectionEyebrow>
          <h2 className="mt-5 font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-dark leading-tight tracking-[-0.015em]">
            {heading || "Good questions, clear answers."}
          </h2>
          {subheading && (
            <p className="mt-5 text-slate text-base sm:text-lg leading-relaxed">
              {subheading}
            </p>
          )}
        </div>

        <div className="divide-y divide-sand-dark border-y border-sand-dark">
          {faqs.map((f, i) => {
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
                    <p className="text-slate text-sm sm:text-base leading-relaxed pb-5 max-w-prose">
                      {f.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {ctaText && (
          <div className="mt-10 text-center">
            <Link href={ctaHref} className="btn-secondary">
              {ctaText}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
