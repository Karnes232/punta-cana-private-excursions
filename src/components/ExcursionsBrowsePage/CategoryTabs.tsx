import { Link } from "@/i18n/navigation";

export interface CategoryTab {
  slug: string;
  title: string;
  count: number;
}

interface CategoryTabsProps {
  categories: CategoryTab[];
  activeSlug: string | null;
  allLabel: string;
  totalCount: number;
}

function pillClasses(active: boolean) {
  return `inline-flex items-center gap-2 px-4 py-2 rounded-full font-heading font-semibold text-sm transition-colors ${
    active
      ? "bg-ocean text-white"
      : "bg-white text-slate-dark border border-sand-dark hover:border-ocean hover:text-ocean"
  }`;
}

function CountChip({ count, active }: { count: number; active: boolean }) {
  return (
    <span
      className={`px-1.5 py-0.5 rounded-full text-[11px] leading-none ${
        active ? "bg-white/20 text-white" : "bg-sand text-slate"
      }`}
    >
      {count}
    </span>
  );
}

export function CategoryTabs({
  categories,
  activeSlug,
  allLabel,
  totalCount,
}: CategoryTabsProps) {
  if (categories.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-12">
      <Link
        href={{ pathname: "/excursions" }}
        scroll={false}
        className={pillClasses(activeSlug === null)}
      >
        {allLabel}
        <CountChip count={totalCount} active={activeSlug === null} />
      </Link>
      {categories.map((cat) => {
        const active = activeSlug === cat.slug;
        return (
          <Link
            key={cat.slug}
            href={{ pathname: "/excursions", query: { category: cat.slug } }}
            scroll={false}
            className={pillClasses(active)}
          >
            {cat.title}
            <CountChip count={cat.count} active={active} />
          </Link>
        );
      })}
    </div>
  );
}
