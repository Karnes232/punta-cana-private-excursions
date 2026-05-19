import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { CtaBanner } from "@/components/HomePage/CtaBanner/CtaBanner";
import {
  getDivingSnorkelingPage,
  getScubaDivingExcursions,
  getDivingSnorkelingPageSeo,
} from "@/sanity/queries/DivingSnorkelingPage/DivingSnorkelingPage";
import { getDefaultSeo } from "@/sanity/queries/SEO/seoProjection";
import { buildMetadata } from "@/lib/seo/buildMetadata";
import {
  getLocalized,
  type LocalizedField,
} from "@/sanity/queries/GeneralLayout/generalLayoutQuery";
import { hotspotToObjectPosition } from "@/sanity/lib/hotspot";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [pageSeo, defaultSeo, page] = await Promise.all([
    getDivingSnorkelingPageSeo().catch(() => null),
    getDefaultSeo().catch(() => null),
    getDivingSnorkelingPage().catch(() => null),
  ]);
  const lk = locale as keyof LocalizedField;

  return buildMetadata({
    seo: pageSeo?.seo,
    defaults: defaultSeo?.defaultSeo,
    locale: locale as "en" | "es",
    path: "/scuba-diving",
    fallbackTitle: page?.heroHeadline?.[lk] ?? "Private Diving Charters",
    fallbackDescription: page?.heroSubheadline?.[lk],
  });
}

export default async function ScubaDivingHub({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lk = locale as keyof LocalizedField;
  const isEs = locale === "es";

  const [page, excursions] = await Promise.all([
    getDivingSnorkelingPage().catch(() => null),
    getScubaDivingExcursions().catch(() => []),
  ]);

  return (
    <>
      <PageHero
        eyebrow={isEs ? "Charters privados" : "Private charters"}
        headline={
          page?.heroHeadline?.[lk] ??
          (isEs
            ? "Buceo y snorkel privado."
            : "Private diving and snorkeling.")
        }
        subheadline={page?.heroSubheadline?.[lk]}
        image={
          page?.heroImage?.url
            ? {
                url: page.heroImage.url,
                lqip: page.heroImage.lqip,
                hotspot: page.heroImage.hotspot,
              }
            : null
        }
      />

      <section className="section-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          {excursions.length === 0 ? (
            <p className="text-center py-12 text-gray italic">
              {isEs
                ? "Pronto publicaremos nuestros charters privados de buceo."
                : "Our private dive charters will appear here soon."}
            </p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {excursions.map((exc, i) => (
                <RevealOnScroll key={exc._id} delayMs={(i % 3) * 80}>
                  <Link
                    href={`/scuba-diving/${exc.slug.current}`}
                    className="group block card-excursion h-full"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {exc.heroImage?.url ? (
                        <Image
                          src={exc.heroImage.url}
                          alt={getLocalized(exc.heroImage.alt, locale)}
                          fill
                          sizes="(min-width: 1024px) 33vw, 100vw"
                          placeholder={exc.heroImage.lqip ? "blur" : undefined}
                          blurDataURL={exc.heroImage.lqip}
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          style={{
                            objectPosition: hotspotToObjectPosition(exc.heroImage.hotspot),
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-teal to-ocean" />
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-heading font-bold text-xl text-slate-dark mb-2 group-hover:text-ocean transition-colors">
                        {getLocalized(exc.title, locale)}
                      </h3>
                      <p className="text-slate text-sm leading-relaxed mb-4 line-clamp-2">
                        {getLocalized(exc.shortSummary, locale)}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-sand-dark">
                        <span className="text-xs text-gray-dark uppercase tracking-wider">
                          {getLocalized(exc.duration, locale)}
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
        </div>
      </section>

      <CtaBanner
        headline={
          isEs
            ? "Diseñemos tu día privado bajo el agua."
            : "Let's design your private day underwater."
        }
        primaryCtaText={isEs ? "Hablar con conserjería" : "Talk to concierge"}
        primaryCtaHref="/contact"
      />
    </>
  );
}
