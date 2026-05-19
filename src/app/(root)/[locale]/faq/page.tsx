import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { FaqCategorySection } from "@/components/FaqPage/FaqCategorySection";
import { CtaBanner } from "@/components/HomePage/CtaBanner/CtaBanner";
import { getFaqPage, getFaqPageSeo } from "@/sanity/queries/FaqPage/FaqPage";
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
    getFaqPageSeo().catch(() => null),
    getDefaultSeo().catch(() => null),
    getFaqPage().catch(() => null),
  ]);
  const lk = locale as keyof LocalizedField;

  return buildMetadata({
    seo: pageSeo?.seo,
    defaults: defaultSeo?.defaultSeo,
    locale: locale as "en" | "es",
    path: "/faq",
    fallbackTitle: page?.heroHeadline?.[lk] ?? "FAQ",
    fallbackDescription: page?.heroSubheadline?.[lk],
  });
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const page = await getFaqPage().catch(() => null);
  const lk = locale as keyof LocalizedField;
  const isEs = locale === "es";

  return (
    <>
      <PageHero
        eyebrow={isEs ? "Preguntas frecuentes" : "Frequently asked"}
        headline={
          page?.heroHeadline?.[lk] ??
          (isEs
            ? "Lo que nuestros huéspedes preguntan."
            : "What our guests ask.")
        }
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
        size="compact"
      />

      <section className="section-white py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-12">
          {page?.categories && page.categories.length > 0 ? (
            page.categories.map((cat) => (
              <FaqCategorySection
                key={cat._key}
                title={cat.categoryName?.[lk] ?? ""}
                icon={cat.icon}
                items={cat.items.map((it) => ({
                  question: it.question?.[lk] ?? "",
                  answer: it.answer?.[lk] ?? "",
                }))}
              />
            ))
          ) : (
            <p className="text-center text-gray italic">
              {isEs
                ? "Las preguntas aparecerán aquí cuando se publiquen."
                : "Questions will appear here once published."}
            </p>
          )}
        </div>
      </section>

      <CtaBanner
        headline={isEs ? "¿No encontraste tu respuesta?" : "Didn't find your answer?"}
        subheadline={
          isEs
            ? "Nuestra conserjería responde dentro de 24 horas."
            : "Our concierge replies within 24 hours."
        }
        primaryCtaText={isEs ? "Hablar con conserjería" : "Talk to concierge"}
        primaryCtaHref="/contact"
      />
    </>
  );
}
