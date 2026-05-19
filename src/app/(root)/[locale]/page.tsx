import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/buildMetadata";
import { getDefaultSeo } from "@/sanity/queries/SEO/seoProjection";
import { Hero } from "@/components/HomePage/Hero/Hero";
import { BrandIntro } from "@/components/HomePage/BrandIntro/BrandIntro";
import { FeaturedExcursions } from "@/components/HomePage/FeaturedExcursions/FeaturedExcursions";
import { ExcursionCategories } from "@/components/HomePage/ExcursionCategories/ExcursionCategories";
import { WhyChooseUs } from "@/components/HomePage/WhyChooseUs/WhyChooseUs";
import { HowBookingWorks } from "@/components/HomePage/HowBookingWorks/HowBookingWorks";
import { Reviews } from "@/components/HomePage/Reviews/Reviews";
import { FaqPreview } from "@/components/HomePage/FaqPreview/FaqPreview";
import { CtaBanner } from "@/components/HomePage/CtaBanner/CtaBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { getHomePage, getHomePageSeo } from "@/sanity/queries/HomePage/HomePage";
import { getExcursionCategoryHomePage } from "@/sanity/queries/ExcursionCategory/ExcursionCategory";
import { getFeaturedExcursions } from "@/sanity/queries/IndividualExcursions/Excursionqueries";
import {
  getLocalized,
  type LocalizedField,
} from "@/sanity/queries/GeneralLayout/generalLayoutQuery";

interface HomeProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: HomeProps): Promise<Metadata> {
  const { locale } = await params;
  const [pageSeo, defaultSeo, homePage] = await Promise.all([
    getHomePageSeo().catch(() => null),
    getDefaultSeo().catch(() => null),
    getHomePage().catch(() => null),
  ]);
  const lk = locale as keyof LocalizedField;
  return buildMetadata({
    seo: pageSeo?.seo,
    defaults: defaultSeo?.defaultSeo,
    locale: locale as "en" | "es",
    path: "/",
    fallbackTitle: homePage?.heroHeadline?.[lk],
    fallbackDescription: homePage?.heroSubheadline?.[lk],
    fallbackImage: homePage?.heroImage?.asset?.url
      ? {
          url: homePage.heroImage.asset.url,
          alt: homePage.heroImageAlt?.[lk],
        }
      : undefined,
  });
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  const lk = locale as keyof LocalizedField;

  const [homePage, categories, featured, pageSeo] = await Promise.all([
    getHomePage().catch(() => null),
    getExcursionCategoryHomePage().catch(() => []),
    getFeaturedExcursions().catch(() => []),
    getHomePageSeo().catch(() => null),
  ]);

  const jsonLd =
    locale === "es"
      ? pageSeo?.seo?.structuredDataEs
      : pageSeo?.seo?.structuredDataEn;

  return (
    <>
      <JsonLd data={jsonLd} />

      <Hero
        backgroundImage={
          homePage?.heroImage?.asset?.url
            ? {
                url: homePage.heroImage.asset.url,
                alt: homePage.heroImageAlt?.[lk] ?? "",
                lqip: homePage.heroImage.asset.metadata?.lqip,
                hotspot: homePage.heroImage.hotspot,
              }
            : undefined
        }
        headline={homePage?.heroHeadline?.[lk]}
        subheadline={homePage?.heroSubheadline?.[lk]}
        primaryCTA={
          homePage?.heroPrimaryCta
            ? {
                text: homePage.heroPrimaryCta.text?.[lk] ?? "",
                href: homePage.heroPrimaryCta.href ?? "#",
              }
            : { text: locale === "es" ? "Ver experiencias" : "View experiences", href: "/excursions" }
        }
        secondaryCTA={
          homePage?.heroSecondaryCta
            ? {
                text: homePage.heroSecondaryCta.text?.[lk] ?? "",
                href: homePage.heroSecondaryCta.href ?? "#",
              }
            : { text: locale === "es" ? "Hablar con conserjería" : "Talk to concierge", href: "/contact" }
        }
      />

      <BrandIntro
        image={
          homePage?.brandIntroImage?.asset?.url
            ? {
                url: homePage.brandIntroImage.asset.url,
                alt: homePage.brandIntroImageAlt?.[lk] ?? "",
                lqip: homePage.brandIntroImage.asset.metadata?.lqip,
                hotspot: homePage.brandIntroImage.hotspot,
              }
            : undefined
        }
        tagline={homePage?.brandIntroTagline?.[lk]}
        heading={homePage?.brandIntroHeading?.[lk]}
        body={homePage?.brandIntroBody?.[lk]}
      />

      <FeaturedExcursions
        heading={homePage?.featuredHeading?.[lk]}
        subheading={homePage?.featuredSubheading?.[lk]}
        viewAllText={homePage?.featuredViewAllText?.[lk]}
        excursions={featured.map((exc) => ({
          slug: exc.slug.current,
          title: getLocalized(exc.title, locale),
          summary: getLocalized(exc.shortSummary, locale),
          image: {
            url: exc.heroImage?.asset?.url ?? "",
            alt: getLocalized(exc.heroImage?.alt, locale),
            lqip: exc.heroImage?.asset?.metadata?.lqip,
            hotspot: exc.heroImage?.hotspot,
          },
          price: exc.price,
          duration: getLocalized(exc.duration, locale),
          category: getLocalized(exc.category?.title, locale),
          badge: exc.badge ? getLocalized(exc.badge, locale) : undefined,
        }))}
      />

      <ExcursionCategories
        heading={homePage?.categoriesHeading?.[lk]}
        subheading={homePage?.categoriesSubheading?.[lk]}
        categories={categories.map((cat) => ({
          slug: cat.slug,
          title: getLocalized(cat.title, locale),
          image: {
            url: cat.image?.asset?.url ?? "",
            alt: getLocalized(cat.title, locale),
            lqip: cat.image?.asset?.metadata?.lqip,
            hotspot: cat.image?.hotspot,
          },
        }))}
      />

      <WhyChooseUs
        heading={homePage?.whyChooseUsHeading?.[lk]}
        subheading={homePage?.whyChooseUsSubheading?.[lk]}
        pillars={
          homePage?.trustPillars?.map((p) => ({
            icon: p.icon,
            title: getLocalized(p.title, locale),
            description: getLocalized(p.description, locale),
          })) ?? []
        }
      />

      <HowBookingWorks
        heading={homePage?.howBookingWorksHeading?.[lk]}
        subheading={homePage?.howBookingWorksSubheading?.[lk]}
        steps={
          homePage?.bookingSteps?.map((s) => ({
            stepNumber: s.stepNumber,
            icon: s.icon,
            title: getLocalized(s.title, locale),
            description: getLocalized(s.description, locale),
          })) ?? []
        }
      />

      <Reviews
        heading={homePage?.reviewsHeading?.[lk]}
        subheading={homePage?.reviewsSubheading?.[lk]}
        reviews={
          homePage?.reviews?.map((r) => ({
            name: r.name,
            country: r.country,
            text: getLocalized(r.text, locale),
            rating: r.rating,
            excursionTitle: r.excursionTitle,
          })) ?? []
        }
      />

      <FaqPreview
        heading={homePage?.faqPreviewHeading?.[lk]}
        subheading={homePage?.faqPreviewSubheading?.[lk]}
        faqs={
          homePage?.faqPreviewItems?.map((f) => ({
            question: getLocalized(f.question, locale),
            answer: getLocalized(f.answer, locale),
          })) ?? []
        }
        ctaText={homePage?.faqPreviewCtaText?.[lk]}
      />

      <CtaBanner
        headline={homePage?.ctaBannerHeadline?.[lk]}
        subheadline={homePage?.ctaBannerSubheadline?.[lk]}
        primaryCtaText={homePage?.ctaBannerButtonText?.[lk]}
        primaryCtaHref={homePage?.ctaBannerButtonHref}
        whatsappLabel={homePage?.ctaBannerWhatsappLabel?.[lk]}
      />
    </>
  );
}
