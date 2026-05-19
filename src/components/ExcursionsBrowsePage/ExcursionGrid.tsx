import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { ExcursionListItem } from "@/sanity/queries/IndividualExcursions/Excursionqueries";
import { getLocalized } from "@/sanity/queries/GeneralLayout/generalLayoutQuery";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { hotspotToObjectPosition } from "@/sanity/lib/hotspot";

interface ExcursionGridProps {
  excursions: ExcursionListItem[];
  locale: string;
}

export function ExcursionGrid({ excursions, locale }: ExcursionGridProps) {
  if (excursions.length === 0) {
    return (
      <div className="text-center py-20 text-gray italic">
        Our private catalog is being prepared. Please reach out to our concierge
        to discuss your bespoke experience.
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {excursions.map((exc, i) => {
        const title = getLocalized(exc.title, locale);
        const summary = getLocalized(exc.shortSummary, locale);
        const duration = getLocalized(exc.duration, locale);
        const category = exc.category ? getLocalized(exc.category.title, locale) : "";
        const badge = exc.badge ? getLocalized(exc.badge, locale) : undefined;

        return (
          <RevealOnScroll key={exc._id} delayMs={(i % 3) * 80}>
            <Link
              href={`/excursions/${exc.slug.current}`}
              className="group block card-excursion h-full"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {exc.heroImage?.asset?.url ? (
                  <Image
                    src={exc.heroImage.asset.url}
                    alt={getLocalized(exc.heroImage.alt, locale)}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    placeholder={exc.heroImage.asset.metadata?.lqip ? "blur" : undefined}
                    blurDataURL={exc.heroImage.asset.metadata?.lqip}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{
                      objectPosition: hotspotToObjectPosition(exc.heroImage.hotspot),
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-teal to-ocean" />
                )}
                {badge && (
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-sunset text-white text-xs font-heading font-semibold tracking-wide uppercase">
                    {badge}
                  </span>
                )}
              </div>
              <div className="p-6">
                {category && (
                  <p className="text-xs uppercase tracking-[0.16em] text-teal font-heading font-semibold mb-2">
                    {category}
                  </p>
                )}
                <h3 className="font-heading font-bold text-xl text-slate-dark leading-tight mb-2 group-hover:text-ocean transition-colors">
                  {title}
                </h3>
                <p className="text-slate text-sm leading-relaxed mb-4 line-clamp-2">
                  {summary}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-sand-dark">
                  <span className="text-xs text-gray-dark uppercase tracking-wider">
                    {duration}
                  </span>
                  <span className="font-heading font-bold text-ocean">
                    <span className="text-xs text-gray-dark mr-1 font-body font-normal">
                      from
                    </span>
                    ${exc.price}
                  </span>
                </div>
              </div>
            </Link>
          </RevealOnScroll>
        );
      })}
    </div>
  );
}
