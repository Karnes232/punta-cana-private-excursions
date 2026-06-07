import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { BlockContent } from "@/components/BlockContent/BlockContent";
import { ExcursionGrid } from "@/components/ExcursionsBrowsePage/ExcursionGrid";
import { CategoryTabs } from "@/components/ExcursionsBrowsePage/CategoryTabs";
import { CtaBanner } from "@/components/HomePage/CtaBanner/CtaBanner";
import {
  getExcursionsPage,
  getExcursionsPageSeo,
} from "@/sanity/queries/ExcursionsPage/ExcursionsPage";
import { getExcursionList } from "@/sanity/queries/IndividualExcursions/Excursionqueries";
import { getExcursionCategoryPage } from "@/sanity/queries/ExcursionCategory/ExcursionCategory";
import { getDefaultSeo } from "@/sanity/queries/SEO/seoProjection";
import { buildMetadata } from "@/lib/seo/buildMetadata";
import {
  getLocalized,
  getLocalizedPortableText,
  type LocalizedField,
} from "@/sanity/queries/GeneralLayout/generalLayoutQuery";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [pageSeo, defaultSeo, page] = await Promise.all([
    getExcursionsPageSeo().catch(() => null),
    getDefaultSeo().catch(() => null),
    getExcursionsPage().catch(() => null),
  ]);
  const lk = locale as keyof LocalizedField;

  return buildMetadata({
    seo: pageSeo?.seo,
    defaults: defaultSeo?.defaultSeo,
    locale: locale as "en" | "es",
    href: "/excursions",
    fallbackTitle: page?.heroHeadline?.[lk] ?? "Private Excursions",
    fallbackDescription: page?.heroSubheadline?.[lk],
  });
}

export default async function ExcursionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const lk = locale as keyof LocalizedField;

  const [page, excursions, allCategories] = await Promise.all([
    getExcursionsPage().catch(() => null),
    getExcursionList().catch(() => []),
    getExcursionCategoryPage().catch(() => []),
  ]);

  // Tab data — only categories that actually contain excursions
  const categoryTabs = allCategories
    .map((cat) => ({
      slug: cat.slug,
      title: getLocalized(cat.title, locale),
      count: excursions.filter((e) => e.category?.slug?.current === cat.slug)
        .length,
    }))
    .filter((cat) => cat.count > 0);

  const activeSlug = categoryTabs.some((c) => c.slug === sp.category)
    ? (sp.category as string)
    : null;
  const filteredExcursions = activeSlug
    ? excursions.filter((e) => e.category?.slug?.current === activeSlug)
    : excursions;

  return (
    <>
      <PageHero
        eyebrow={
          page?.heroEyebrow?.[lk] ||
          (locale === "es" ? "Catálogo privado" : "Private catalog")
        }
        headline={page?.heroHeadline?.[lk] ?? (locale === "es" ? "Experiencias privadas a medida." : "Private experiences, hand-curated.")}
        subheadline={page?.heroSubheadline?.[lk]}
        image={
          page?.heroImage?.asset?.url
            ? {
                url: page.heroImage.asset.url,
                lqip: page.heroImage.asset.metadata?.lqip,
                hotspot: page.heroImage.hotspot,
              }
            : null
        }
      />

      {/* Intro */}
      {(page?.introHeadline || page?.introBody) && (
        <section className="section-sand py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <RevealOnScroll>
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
                {page?.introImage?.asset?.url ? (
                  <Image
                    src={page.introImage.asset.url}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    placeholder={
                      page.introImage.asset.metadata?.lqip ? "blur" : undefined
                    }
                    blurDataURL={page.introImage.asset.metadata?.lqip}
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-teal to-ocean" />
                )}
              </div>
            </RevealOnScroll>
            <RevealOnScroll delayMs={120}>
              <div>
                {page?.introEyebrow?.[lk] && (
                  <SectionEyebrow align="left" className="mb-5">
                    {page.introEyebrow[lk]}
                  </SectionEyebrow>
                )}
                {page?.introHeadline?.[lk] && (
                  <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-dark leading-tight tracking-[-0.015em]">
                    {page.introHeadline[lk]}
                  </h2>
                )}
                <BlockContent
                  value={getLocalizedPortableText(page?.introBody, locale)}
                  className="mt-6"
                />
              </div>
            </RevealOnScroll>
          </div>
        </section>
      )}

      <section className="section-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          {excursions.length > 0 && (
            <CategoryTabs
              categories={categoryTabs}
              activeSlug={activeSlug}
              allLabel={locale === "es" ? "Todas" : "All"}
              totalCount={excursions.length}
            />
          )}
          <ExcursionGrid excursions={filteredExcursions} locale={locale} />
        </div>
      </section>

      {/* Outro */}
      {(page?.outroHeading?.[lk] || page?.outroBody) && (
        <section className="section-sand py-20 sm:py-28">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-12">
            {page?.outroHeading?.[lk] && (
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-slate-dark leading-tight tracking-[-0.015em]">
                {page.outroHeading[lk]}
              </h2>
            )}
            <BlockContent
              value={getLocalizedPortableText(page?.outroBody, locale)}
              className="mt-6"
            />
          </div>
        </section>
      )}

      <CtaBanner
        eyebrow={page?.ctaEyebrow?.[lk] || undefined}
        headline={page?.ctaHeadline?.[lk]}
        subheadline={page?.ctaSubheadline?.[lk]}
        primaryCtaText={
          page?.ctaButtonText?.[lk] ??
          (locale === "es" ? "Hablar con conserjería" : "Talk to concierge")
        }
        primaryCtaHref={page?.ctaButtonHref ?? "/contact"}
      />
    </>
  );
}
