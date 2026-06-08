import { Link } from "@/i18n/navigation";
import { BlogLanguageMenu } from "./BlogLanguageMenu";

export interface BlogCategoryTab {
  slug: string;
  title: string;
  count: number;
}

interface BlogFilterBarProps {
  categories: BlogCategoryTab[];
  activeCategory: string | null;
  totalCount: number;
  allLabel: string;
  languages: string[];
  activeLang: string;
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

export function BlogFilterBar({
  categories,
  activeCategory,
  totalCount,
  allLabel,
  languages,
  activeLang,
}: BlogFilterBarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-12">
      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        <Link
          href={{ pathname: "/blog", query: { lang: activeLang } }}
          scroll={false}
          className={pillClasses(activeCategory === null)}
        >
          {allLabel}
          <CountChip count={totalCount} active={activeCategory === null} />
        </Link>
        {categories.map((cat) => {
          const active = activeCategory === cat.slug;
          return (
            <Link
              key={cat.slug}
              href={{
                pathname: "/blog",
                query: { lang: activeLang, category: cat.slug },
              }}
              scroll={false}
              className={pillClasses(active)}
            >
              {cat.title}
              <CountChip count={cat.count} active={active} />
            </Link>
          );
        })}
      </div>

      {/* Blog-language switcher */}
      {languages.length > 1 && (
        <BlogLanguageMenu languages={languages} activeLang={activeLang} />
      )}
    </div>
  );
}
