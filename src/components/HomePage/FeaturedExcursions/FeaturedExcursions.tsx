import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import {
  hotspotToObjectPosition,
  type SanityHotspot,
} from "@/sanity/lib/hotspot";

interface FeaturedExcursionItem {
  slug: string;
  title: string;
  summary: string;
  image: {
    url: string;
    alt: string;
    lqip?: string;
    hotspot?: SanityHotspot | null;
  };
  price: number;
  duration: string;
  category?: string;
  badge?: string;
}

interface FeaturedExcursionsProps {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  excursions: FeaturedExcursionItem[];
  viewAllText?: string;
  viewAllHref?: string;
}

export function FeaturedExcursions({
  eyebrow = "Hand-picked",
  heading,
  subheading,
  excursions,
  viewAllText,
  viewAllHref = "/excursions",
}: FeaturedExcursionsProps) {
  return (
    <section className="section-white py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <SectionEyebrow>{eyebrow}</SectionEyebrow>
          <h2 className="mt-5 font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-dark leading-tight tracking-[-0.015em]">
            {heading || "Featured private experiences."}
          </h2>
          {subheading && (
            <p className="mt-5 text-slate text-base sm:text-lg leading-relaxed">
              {subheading}
            </p>
          )}
        </div>

        {excursions.length === 0 ? (
          <p className="text-center text-gray text-sm italic">
            Featured experiences will appear here once the catalog is published.
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {excursions.map((exc, i) => (
              <RevealOnScroll key={exc.slug} delayMs={i * 80}>
                <Link
                  href={`/excursions/${exc.slug}`}
                  className="group block card-excursion h-full"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {exc.image.url ? (
                      <Image
                        src={exc.image.url}
                        alt={exc.image.alt}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        placeholder={exc.image.lqip ? "blur" : undefined}
                        blurDataURL={exc.image.lqip}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        style={{
                          objectPosition: hotspotToObjectPosition(exc.image.hotspot),
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-teal to-ocean" />
                    )}
                    {exc.badge && (
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-sunset text-white text-xs font-heading font-semibold tracking-wide uppercase">
                        {exc.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    {exc.category && (
                      <p className="text-xs uppercase tracking-[0.16em] text-teal font-heading font-semibold mb-2">
                        {exc.category}
                      </p>
                    )}
                    <h3 className="font-heading font-bold text-xl text-slate-dark leading-tight mb-2 group-hover:text-ocean transition-colors">
                      {exc.title}
                    </h3>
                    <p className="text-slate text-sm leading-relaxed mb-4 line-clamp-2">
                      {exc.summary}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-sand-dark">
                      <span className="text-xs text-gray-dark uppercase tracking-wider">
                        {exc.duration}
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
            ))}
          </div>
        )}

        {viewAllText && excursions.length > 0 && (
          <div className="mt-14 text-center">
            <Link href={viewAllHref} className="btn-secondary">
              {viewAllText}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
