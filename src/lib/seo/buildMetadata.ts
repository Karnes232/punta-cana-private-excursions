import type { Metadata } from "next";
import {
  generateHreflangAlternates,
  localizedUrl,
  type Locale,
} from "@/i18n/hreflang";
import type { AppHref } from "@/i18n/navigation";
import { getLocalized } from "@/sanity/queries/GeneralLayout/generalLayoutQuery";
import type {
  SeoData,
  SeoImageAsset,
  SeoSingleLanguageData,
} from "@/sanity/queries/SEO/seoProjection";

type ChromeLocale = "en" | "es";

const OG_LOCALES: Record<Locale, string> = {
  en: "en_US",
  es: "es_ES",
  fr: "fr_FR",
  de: "de_DE",
  pt: "pt_BR",
  it: "it_IT",
};

interface FallbackImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface BuildMetadataArgs {
  seo: SeoData | null | undefined;
  defaults: SeoData | null | undefined;
  locale: Locale;
  /**
   * Localized-navigation href for this page: a route key like "/excursions",
   * or `{ pathname: "/excursions/[slug]", params: { slug } }` for slug routes.
   * Used to build the canonical + hreflang URLs with localized segments/slugs.
   */
  href: AppHref;
  fallbackTitle?: string;
  fallbackDescription?: string;
  fallbackImage?: FallbackImage | null;
  /** Locales to emit hreflang for. Defaults to en + es. */
  hreflangLocales?: readonly Locale[];
  /** For slug routes: per-locale slug overrides for hreflang. */
  hreflangSlugsByLocale?: Partial<Record<Locale, string>>;
}

interface BuildSingleLanguageMetadataArgs {
  seo: SeoSingleLanguageData | null | undefined;
  defaults: SeoData | null | undefined;
  locale: Locale;
  href: AppHref;
  fallbackTitle?: string;
  fallbackDescription?: string;
  fallbackImage?: FallbackImage | null;
  hreflangLocales?: readonly Locale[];
  hreflangSlugsByLocale?: Partial<Record<Locale, string>>;
}

const firstNonEmpty = (...values: Array<string | undefined | null>): string | undefined => {
  for (const v of values) {
    if (typeof v === "string" && v.trim() !== "") return v;
  }
  return undefined;
};

const seoImageToFallback = (img: SeoImageAsset | null | undefined): FallbackImage | undefined => {
  if (!img?.asset?.url) return undefined;
  return {
    url: img.asset.url,
    alt: img.alt,
    width: img.asset.metadata?.dimensions?.width,
    height: img.asset.metadata?.dimensions?.height,
  };
};

const robotsFromSeo = (
  noIndex?: boolean,
  noFollow?: boolean,
): Metadata["robots"] => {
  // If neither flag is set, omit the robots field — let crawlers default to index/follow.
  if (!noIndex && !noFollow) return undefined;
  return {
    index: !noIndex,
    follow: !noFollow,
  };
};

/**
 * Build a Next.js Metadata object from a bilingual `seo` Sanity object,
 * with fallbacks to defaultSeo (generalLayout) and per-page hardcoded fallbacks.
 */
export function buildMetadata(args: BuildMetadataArgs): Metadata {
  const {
    seo,
    defaults,
    locale,
    href,
    fallbackTitle,
    fallbackDescription,
    fallbackImage,
    hreflangLocales,
    hreflangSlugsByLocale,
  } = args;

  // Sanity LocalizedField has only en/es slots; fr/de/pt/it fall back to en.
  const chromeLocale: ChromeLocale = locale === "es" ? "es" : "en";

  const title = firstNonEmpty(
    getLocalized(seo?.metaTitle, chromeLocale),
    fallbackTitle,
    getLocalized(defaults?.metaTitle, chromeLocale),
  );

  const description = firstNonEmpty(
    getLocalized(seo?.metaDescription, chromeLocale),
    fallbackDescription,
    getLocalized(defaults?.metaDescription, chromeLocale),
  );

  const keywordsArr =
    (chromeLocale === "es" ? seo?.keywords?.es : seo?.keywords?.en) ??
    (chromeLocale === "es" ? defaults?.keywords?.es : defaults?.keywords?.en) ??
    [];

  const ogTitle = firstNonEmpty(getLocalized(seo?.ogTitle, chromeLocale), title);

  const ogDescription = firstNonEmpty(
    getLocalized(seo?.ogDescription, chromeLocale),
    description,
  );

  const image =
    seoImageToFallback(seo?.ogImage) ??
    (fallbackImage ?? undefined) ??
    seoImageToFallback(defaults?.ogImage);

  const alternates = generateHreflangAlternates(href, {
    locales: hreflangLocales,
    slugsByLocale: hreflangSlugsByLocale,
  });
  const canonical = localizedUrl(href, locale);

  const twitterCard = seo?.twitterCard ?? defaults?.twitterCard ?? "summary_large_image";

  return {
    title,
    description,
    keywords: keywordsArr.length > 0 ? keywordsArr : undefined,
    alternates: {
      canonical,
      ...alternates,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      locale: OG_LOCALES[locale],
      type: "website",
      images: image
        ? [
            {
              url: image.url,
              alt: image.alt,
              width: image.width,
              height: image.height,
            },
          ]
        : undefined,
    },
    twitter: {
      card: twitterCard,
      title: ogTitle,
      description: ogDescription,
      images: image ? [image.url] : undefined,
    },
    robots: robotsFromSeo(seo?.noIndex, seo?.noFollow),
  };
}

/**
 * Build Metadata from a single-language `seoSingleLanguage` Sanity object
 * (used for blog articles where each document represents one locale).
 */
export function buildSingleLanguageMetadata(
  args: BuildSingleLanguageMetadataArgs,
): Metadata {
  const {
    seo,
    defaults,
    locale,
    href,
    fallbackTitle,
    fallbackDescription,
    fallbackImage,
    hreflangLocales,
    hreflangSlugsByLocale,
  } = args;

  const chromeLocale: ChromeLocale = locale === "es" ? "es" : "en";

  const title = firstNonEmpty(
    seo?.metaTitle,
    fallbackTitle,
    getLocalized(defaults?.metaTitle, chromeLocale),
  );

  const description = firstNonEmpty(
    seo?.metaDescription,
    fallbackDescription,
    getLocalized(defaults?.metaDescription, chromeLocale),
  );

  const keywordsArr =
    seo?.keywords ??
    (chromeLocale === "es" ? defaults?.keywords?.es : defaults?.keywords?.en) ??
    [];

  const ogTitle = firstNonEmpty(seo?.ogTitle, title);
  const ogDescription = firstNonEmpty(seo?.ogDescription, description);

  const image =
    seoImageToFallback(seo?.ogImage) ??
    (fallbackImage ?? undefined) ??
    seoImageToFallback(defaults?.ogImage);

  const alternates = generateHreflangAlternates(href, {
    locales: hreflangLocales,
    slugsByLocale: hreflangSlugsByLocale,
  });
  const canonical = localizedUrl(href, locale);

  const twitterCard = seo?.twitterCard ?? defaults?.twitterCard ?? "summary_large_image";

  return {
    title,
    description,
    keywords: keywordsArr.length > 0 ? keywordsArr : undefined,
    alternates: {
      canonical,
      ...alternates,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      locale: OG_LOCALES[locale],
      type: "article",
      images: image
        ? [
            {
              url: image.url,
              alt: image.alt,
              width: image.width,
              height: image.height,
            },
          ]
        : undefined,
    },
    twitter: {
      card: twitterCard,
      title: ogTitle,
      description: ogDescription,
      images: image ? [image.url] : undefined,
    },
    robots: robotsFromSeo(seo?.noIndex, seo?.noFollow),
  };
}
