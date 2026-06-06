"use client";

import { useState } from "react";
import { FaqCategorySection } from "./FaqCategorySection";

interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqCategoryContent {
  key: string;
  title: string;
  subtitle?: string | null;
  icon?: string | null;
  items: FaqItem[];
}

interface FaqPageContentProps {
  categories: FaqCategoryContent[];
  allLabel: string;
}

function FilterPill({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-heading font-semibold text-sm transition-colors ${
        active
          ? "bg-ocean text-white"
          : "bg-white text-slate-dark border border-sand-dark hover:border-ocean hover:text-ocean"
      }`}
    >
      {label}
      <span
        className={`px-1.5 py-0.5 rounded-full text-[11px] leading-none ${
          active ? "bg-white/20 text-white" : "bg-sand text-slate"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

export function FaqPageContent({ categories, allLabel }: FaqPageContentProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [openKey, setOpenKey] = useState<string | null>(
    categories[0]?.key ?? null,
  );

  const totalCount = categories.reduce((sum, c) => sum + c.items.length, 0);
  const visible = activeKey
    ? categories.filter((c) => c.key === activeKey)
    : categories;

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2 mb-14">
        <FilterPill
          label={allLabel}
          count={totalCount}
          active={activeKey === null}
          onClick={() => setActiveKey(null)}
        />
        {categories.map((cat) => (
          <FilterPill
            key={cat.key}
            label={cat.title}
            count={cat.items.length}
            active={activeKey === cat.key}
            onClick={() => {
              setActiveKey(cat.key);
              setOpenKey(cat.key);
            }}
          />
        ))}
      </div>

      {visible.map((cat) => (
        <FaqCategorySection
          key={cat.key}
          title={cat.title}
          subtitle={cat.subtitle}
          icon={cat.icon}
          items={cat.items}
          open={openKey === cat.key}
          onToggle={() =>
            setOpenKey(openKey === cat.key ? null : cat.key)
          }
        />
      ))}
    </div>
  );
}
