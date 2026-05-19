import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import {
  hotspotToObjectPosition,
  type SanityHotspot,
} from "@/sanity/lib/hotspot";

interface CategoryItem {
  slug: string;
  title: string;
  image: {
    url: string;
    alt: string;
    lqip?: string;
    hotspot?: SanityHotspot | null;
  };
}

interface ExcursionCategoriesProps {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  categories: CategoryItem[];
}

export function ExcursionCategories({
  eyebrow = "Explore",
  heading,
  subheading,
  categories,
}: ExcursionCategoriesProps) {
  return (
    <section className="section-sand py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <SectionEyebrow>{eyebrow}</SectionEyebrow>
          <h2 className="mt-5 font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-dark leading-tight tracking-[-0.015em]">
            {heading || "Categories of private experience."}
          </h2>
          {subheading && (
            <p className="mt-5 text-slate text-base sm:text-lg leading-relaxed">
              {subheading}
            </p>
          )}
        </div>

        {categories.length === 0 ? (
          <p className="text-center text-gray text-sm italic">
            Categories will appear here once published in Sanity.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, i) => (
              <RevealOnScroll key={cat.slug} delayMs={i * 60}>
                <Link
                  href={`/excursions?category=${cat.slug}`}
                  className="group block relative aspect-[4/5] rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow"
                >
                  {cat.image.url ? (
                    <Image
                      src={cat.image.url}
                      alt={cat.image.alt}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      placeholder={cat.image.lqip ? "blur" : undefined}
                      blurDataURL={cat.image.lqip}
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      style={{
                        objectPosition: hotspotToObjectPosition(cat.image.hotspot),
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-ocean to-teal" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-dark/85 via-slate-dark/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-heading font-bold text-white text-2xl leading-tight">
                      {cat.title}
                    </h3>
                    <p className="mt-2 text-sunset text-xs font-heading font-semibold uppercase tracking-[0.18em] opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore →
                    </p>
                  </div>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
