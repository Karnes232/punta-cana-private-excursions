"use client";

import { useRef } from "react";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

interface Review {
  name: string;
  country?: string;
  text: string;
  rating: number;
  excursionTitle?: string;
}

interface ReviewsProps {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  reviews: Review[];
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-warm" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i < rating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="m12 2 3 7h7l-5.5 4.5L18 22l-6-4-6 4 1.5-8.5L2 9h7l3-7Z" />
        </svg>
      ))}
    </div>
  );
}

export function Reviews({
  eyebrow = "Guest stories",
  heading,
  subheading,
  reviews,
}: ReviewsProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="section-white py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <SectionEyebrow>{eyebrow}</SectionEyebrow>
          <h2 className="mt-5 font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-dark leading-tight tracking-[-0.015em]">
            {heading || "What our guests say."}
          </h2>
          {subheading && (
            <p className="mt-5 text-slate text-base sm:text-lg leading-relaxed">
              {subheading}
            </p>
          )}
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0 -mx-5 px-5 lg:mx-0 lg:px-0 scroll-pl-5"
        >
          {reviews.map((r, i) => (
            <RevealOnScroll key={i} delayMs={i * 60}>
              <article className="snap-start shrink-0 w-[85%] sm:w-[60%] lg:w-auto p-8 rounded-2xl border border-sand-dark bg-sand/40 h-full flex flex-col">
                <Stars rating={r.rating} />
                <p className="mt-5 text-slate text-base leading-relaxed italic flex-1">
                  &ldquo;{r.text}&rdquo;
                </p>
                <div className="mt-6 pt-5 border-t border-sand-dark">
                  <p className="font-heading font-semibold text-slate-dark">
                    {r.name}
                  </p>
                  <p className="text-xs text-gray-dark uppercase tracking-wider mt-1">
                    {[r.country, r.excursionTitle].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
