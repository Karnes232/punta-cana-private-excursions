"use client";

import { useEffect, useRef, useState } from "react";
import {
  TranslateIcon,
  ChevronDownIcon,
  CheckmarkIcon,
} from "@sanity/icons";
import { Link } from "@/i18n/navigation";
import { LOCALE_LABELS, type BlogLocale } from "@/i18n/blogLocales";

interface BlogArticleLanguageMenuProps {
  items: { code: BlogLocale; slug: string }[];
  activeLang: string;
}

/**
 * In-article language picker. Same dropdown shell as `BlogLanguageMenu`, but
 * each item links directly to the translated article's slug instead of toggling
 * a ?lang= query on the index. Renders nothing when the article has no
 * translations to offer.
 */
export function BlogArticleLanguageMenu({
  items,
  activeLang,
}: BlogArticleLanguageMenuProps) {
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

  if (items.length <= 1) return null;

  const activeLabel = LOCALE_LABELS[activeLang as BlogLocale] ?? activeLang;

  return (
    <div ref={ref} className="relative">
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
          {items.map((item) => {
            const active = item.code === activeLang;
            const label = LOCALE_LABELS[item.code] ?? item.code;
            const rowClass = `flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
              active
                ? "text-ocean font-heading font-semibold"
                : "text-slate hover:bg-sand"
            }`;
            if (active) {
              return (
                <span
                  key={item.code}
                  role="menuitem"
                  aria-current="true"
                  className={rowClass}
                >
                  {label}
                  <CheckmarkIcon className="h-4 w-4 flex-none" aria-hidden />
                </span>
              );
            }
            return (
              <Link
                key={item.code}
                href={{
                  pathname: "/blog/[slug]",
                  params: { slug: item.slug },
                }}
                locale={item.code}
                role="menuitem"
                onClick={() => setOpen(false)}
                className={rowClass}
              >
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
