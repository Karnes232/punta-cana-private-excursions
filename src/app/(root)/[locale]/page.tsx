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
import { CompassIntro } from "@/components/HomePage/CompassIntro/CompassIntro";
import { JsonLd } from "@/components/seo/JsonLd";
import { getHomePage, getHomePageSeo } from "@/sanity/queries/HomePage/HomePage";
import { getExcursionCategoryHomePage } from "@/sanity/queries/ExcursionCategory/ExcursionCategory";
import { getFeaturedExcursions } from "@/sanity/queries/IndividualExcursions/Excursionqueries";
import { canonicalSlug } from "@/sanity/lib/resolveSlug";
import {
  getGeneralLayout,
  getLocalized,
  getLocalizedPortableText,
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
    href: "/",
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
  const typedLocale = locale as "en" | "es";

  const [homePage, categories, featured, pageSeo, generalLayout] = await Promise.all([
    getHomePage().catch(() => null),
    getExcursionCategoryHomePage().catch(() => []),
    getFeaturedExcursions().catch(() => []),
    getHomePageSeo().catch(() => null),
    getGeneralLayout().catch(() => null),
  ]);

  const jsonLd =
    locale === "es"
      ? pageSeo?.seo?.structuredDataEs
      : pageSeo?.seo?.structuredDataEn;

  return (
    <>
      <CompassIntro
        locale={typedLocale}
        logoUrl={generalLayout?.logo?.asset?.url}
      />

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
        video={
          homePage?.heroVideoPublicId
            ? (() => {
                const rawPoster =
                  homePage.heroVideoPoster?.asset?.url ??
                  homePage.heroImage?.asset?.url;
                return {
                  publicId: homePage.heroVideoPublicId,
                  posterUrl: rawPoster
                    ? `${rawPoster}?w=750&fm=webp&q=80`
                    : undefined,
                };
              })()
            : undefined
        }
        eyebrow={homePage?.heroEyebrow?.[lk] || undefined}
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
        body={getLocalizedPortableText(homePage?.brandIntroBody, locale)}
      />

      <FeaturedExcursions
        eyebrow={homePage?.featuredEyebrow?.[lk] || undefined}
        heading={homePage?.featuredHeading?.[lk]}
        subheading={homePage?.featuredSubheading?.[lk]}
        viewAllText={homePage?.featuredViewAllText?.[lk]}
        excursions={featured.map((exc) => ({
          slug: canonicalSlug(exc, locale as "en" | "es"),
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
        eyebrow={homePage?.categoriesEyebrow?.[lk] || undefined}
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
        eyebrow={homePage?.whyChooseUsEyebrow?.[lk] || undefined}
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
        eyebrow={homePage?.howBookingWorksEyebrow?.[lk] || undefined}
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
        eyebrow={homePage?.reviewsEyebrow?.[lk] || undefined}
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
        eyebrow={homePage?.faqPreviewEyebrow?.[lk] || undefined}
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
        eyebrow={homePage?.ctaBannerEyebrow?.[lk] || undefined}
        headline={homePage?.ctaBannerHeadline?.[lk]}
        subheadline={homePage?.ctaBannerSubheadline?.[lk]}
        primaryCtaText={homePage?.ctaBannerButtonText?.[lk]}
        primaryCtaHref={homePage?.ctaBannerButtonHref}
        secondaryCtaText={homePage?.ctaBannerSecondaryButtonText?.[lk]}
        secondaryCtaHref={homePage?.ctaBannerSecondaryButtonHref}
      />
    </>
  );
}
