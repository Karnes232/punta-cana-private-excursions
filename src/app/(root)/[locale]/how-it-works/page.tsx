import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { HowBookingWorks } from "@/components/HomePage/HowBookingWorks/HowBookingWorks";
import { FaqPreview } from "@/components/HomePage/FaqPreview/FaqPreview";
import { CtaBanner } from "@/components/HomePage/CtaBanner/CtaBanner";
import {
  getHowItWorksPage,
  getHowItWorksPageSeo,
} from "@/sanity/queries/HowItWorksPage/HowItWorksPage";
import { getDefaultSeo } from "@/sanity/queries/SEO/seoProjection";
import { buildMetadata } from "@/lib/seo/buildMetadata";
import {
  getLocalized,
  type LocalizedField,
} from "@/sanity/queries/GeneralLayout/generalLayoutQuery";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [pageSeo, defaultSeo, page] = await Promise.all([
    getHowItWorksPageSeo().catch(() => null),
    getDefaultSeo().catch(() => null),
    getHowItWorksPage().catch(() => null),
  ]);
  const lk = locale as keyof LocalizedField;

  return buildMetadata({
    seo: pageSeo?.seo,
    defaults: defaultSeo?.defaultSeo,
    locale: locale as "en" | "es",
    href: "/how-it-works",
    fallbackTitle: page?.heroHeadline?.[lk] ?? "How it works",
    fallbackDescription: page?.heroSubheadline?.[lk],
  });
}

export default async function HowItWorksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const page = await getHowItWorksPage().catch(() => null);
  const lk = locale as keyof LocalizedField;
  const isEs = locale === "es";

  return (
    <>
      <PageHero
        eyebrow={isEs ? "Cómo funciona" : "How it works"}
        headline={
          page?.heroHeadline?.[lk] ??
          (isEs ? "Reservar es sencillo." : "Booking is simple.")
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

      <HowBookingWorks
        eyebrow={isEs ? "Tres pasos" : "Three steps"}
        heading={page?.stepsHeading?.[lk]}
        subheading={page?.stepsSubheading?.[lk]}
        steps={
          page?.steps?.map((s) => ({
            stepNumber: s.stepNumber,
            icon: s.icon,
            title: getLocalized(s.title, locale),
            description: getLocalized(s.description, locale),
          })) ?? []
        }
      />

      {page?.faqItems && page.faqItems.length > 0 && (
        <FaqPreview
          eyebrow={isEs ? "Preguntas frecuentes" : "Frequently asked"}
          heading={page?.faqHeading?.[lk]}
          subheading={page?.faqSubheading?.[lk]}
          faqs={page.faqItems.map((f) => ({
            question: getLocalized(f.question, locale),
            answer: getLocalized(f.answer, locale),
          }))}
        />
      )}

      <CtaBanner
        headline={page?.ctaHeadline?.[lk]}
        subheadline={page?.ctaSubheadline?.[lk]}
        primaryCtaText={page?.ctaButtonText?.[lk] ?? (isEs ? "Empezar" : "Get started")}
        primaryCtaHref={page?.ctaButtonHref ?? "/contact"}
        whatsappLabel={page?.ctaWhatsappLabel?.[lk]}
      />
    </>
  );
}
