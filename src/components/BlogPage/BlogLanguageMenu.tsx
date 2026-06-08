"use client";

import { useEffect, useRef, useState } from "react";
import {
  TranslateIcon,
  ChevronDownIcon,
  CheckmarkIcon,
} from "@sanity/icons";
import { Link } from "@/i18n/navigation";
import { LOCALE_LABELS, type BlogLocale } from "@/i18n/blogLocales";

interface BlogLanguageMenuProps {
  languages: string[];
  activeLang: string;
}

/**
 * Compact language picker for the blog index. A single chip (translate icon +
 * current code + chevron) opens a small menu listing every available language
 * by full name — stays compact no matter how many languages exist.
 */
export function BlogLanguageMenu({
  languages,
  activeLang,
}: BlogLanguageMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointer(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const activeLabel = LOCALE_LABELS[activeLang as BlogLocale] ?? activeLang;

  return (
    <div ref={ref} className="relative self-start sm:self-auto">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Article language: ${activeLabel}`}
        className="inline-flex items-center gap-1.5 rounded-full border border-sand-dark bg-white px-3 py-1.5 text-xs font-heading font-semibold uppercase tracking-[0.08em] text-slate-dark transition-colors hover:border-ocean hover:text-ocean"
      >
        <TranslateIcon className="h-4 w-4 text-gray" aria-hidden />
        {activeLang}
        <ChevronDownIcon
          className={`h-4 w-4 text-gray transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Select article language"
          className="absolute right-0 z-30 mt-2 min-w-[11rem] rounded-xl border border-sand-dark bg-white p-1 shadow-card"
        >
          {languages.map((code) => {
            const active = code === activeLang;
            const label = LOCALE_LABELS[code as BlogLocale] ?? code;
            return (
              <Link
                key={code}
                href={{ pathname: "/blog", query: { lang: code } }}
                scroll={false}
                role="menuitem"
                aria-current={active ? "true" : undefined}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "text-ocean font-heading font-semibold"
                    : "text-slate hover:bg-sand"
                }`}
              >
                {label}
                {active && <CheckmarkIcon className="h-4 w-4 flex-none" aria-hidden />}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
