"use client";

import { useState } from "react";
import {
  CalendarCheck,
  RotateCcw,
  Bus,
  ShieldCheck,
  Sun,
  Waves,
  Map,
  Users,
  HelpCircle,
  Compass,
  type LucideIcon,
} from "lucide-react";

/** Maps the schema's FAQ category icon keys to Lucide icons. */
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  booking: CalendarCheck,
  cancellation: RotateCcw,
  transport: Bus,
  safety: ShieldCheck,
  day: Sun,
  diving: Waves,
  planning: Map,
  company: Users,
  excursion: Compass,
  general: HelpCircle,
};

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategorySectionProps {
  title: string;
  subtitle?: string | null;
  icon?: string | null;
  items: FaqItem[];
  open: boolean;
  onToggle: () => void;
}

export function FaqCategorySection({
  title,
  subtitle,
  icon,
  items,
  open,
  onToggle,
}: FaqCategorySectionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const Icon = (icon && CATEGORY_ICONS[icon]) || HelpCircle;

  return (
    <div className="mb-8 last:mb-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-start gap-3 text-left group"
      >
        <span className="w-9 h-9 flex-none rounded-full bg-ocean/10 text-ocean flex items-center justify-center">
          <Icon size={18} strokeWidth={1.75} aria-hidden />
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2
              className={`font-heading font-bold text-2xl tracking-[-0.015em] transition-colors ${
                open ? "text-ocean" : "text-slate-dark group-hover:text-ocean"
              }`}
            >
              {title}
            </h2>
            <span className="flex-none px-2.5 py-0.5 rounded-full bg-sand text-xs font-heading font-semibold text-slate">
              {items.length}
            </span>
          </div>
          {subtitle && (
            <p className="mt-1 text-sm text-slate leading-relaxed">{subtitle}</p>
          )}
        </div>
        <span
          aria-hidden
          className={`mt-1.5 flex-none w-6 h-6 rounded-full border flex items-center justify-center transition-transform ${
            open
              ? "rotate-180 border-ocean text-ocean"
              : "border-slate/30 text-slate"
          }`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>
      <div
        className="grid transition-all duration-300"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="mt-6 divide-y divide-sand-dark border-y border-sand-dark">
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
      </div>
    </div>
  );
}
