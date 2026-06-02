import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ExcursionGrid } from "@/components/ExcursionsBrowsePage/ExcursionGrid";
import { CtaBanner } from "@/components/HomePage/CtaBanner/CtaBanner";
import {
  getExcursionsPage,
  getExcursionsPageSeo,
} from "@/sanity/queries/ExcursionsPage/ExcursionsPage";
import { getExcursionList } from "@/sanity/queries/IndividualExcursions/Excursionqueries";
import { getDefaultSeo } from "@/sanity/queries/SEO/seoProjection";
import { buildMetadata } from "@/lib/seo/buildMetadata";
import type { LocalizedField } from "@/sanity/queries/GeneralLayout/generalLayoutQuery";

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
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lk = locale as keyof LocalizedField;

  const [page, excursions] = await Promise.all([
    getExcursionsPage().catch(() => null),
    getExcursionList().catch(() => []),
  ]);

  return (
    <>
      <PageHero
        eyebrow={locale === "es" ? "Catálogo privado" : "Private catalog"}
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

      <section className="section-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <ExcursionGrid excursions={excursions} locale={locale} />
        </div>
      </section>

      <CtaBanner
        headline={page?.ctaHeadline?.[lk]}
        subheadline={page?.ctaDescription?.[lk]}
        primaryCtaText={page?.ctaContactButtonText?.[lk] ?? (locale === "es" ? "Hablar con conserjería" : "Talk to concierge")}
        primaryCtaHref="/contact"
        whatsappLabel={page?.ctaWhatsappButtonText?.[lk]}
      />
    </>
  );
}
