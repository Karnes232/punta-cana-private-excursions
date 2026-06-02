import type { MetadataRoute } from "next";
import { localizedUrl } from "@/i18n/hreflang";
import type { AppHref } from "@/i18n/navigation";
import { getExcursionSlugs } from "@/sanity/queries/IndividualExcursions/Excursionqueries";
import { getDivingExcursionSlugs } from "@/sanity/queries/DivingSnorkelingPage/IndividualDivingExcursion";
import { getBlogArticleSitemapEntries } from "@/sanity/queries/Blog/Blog";

const LOCALES = ["en", "es"] as const;

// Static route keys (internal pathnames). Localized segments + prefixes are
// resolved per-locale by getPathname via localizedUrl.
const STATIC_HREFS = [
  "/",
  "/excursions",
  "/scuba-diving",
  "/about",
  "/blog",
  "/contact",
  "/faq",
  "/how-it-works",
  "/privacy-policy",
  "/terms-of-service",
  "/cancellation-policy",
] as const;

/** hreflang alternates map for a single href (same href in both locales). */
function altFor(href: AppHref) {
  return {
    languages: {
      en: localizedUrl(href, "en"),
      es: localizedUrl(href, "es"),
    } as Record<string, string>,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [excursionSlugs, divingSlugs, blogEntries] = await Promise.all([
    getExcursionSlugs().catch(() => []),
    getDivingExcursionSlugs().catch(() => []),
    getBlogArticleSitemapEntries().catch(() => []),
  ]);

  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  // Static routes × locales
  for (const href of STATIC_HREFS) {
    for (const locale of LOCALES) {
      entries.push({
        url: localizedUrl(href, locale),
        lastModified: now,
        changeFrequency: href === "/" ? "weekly" : "monthly",
        priority: href === "/" ? 1.0 : 0.7,
        alternates: altFor(href),
      });
    }
  }

  // Excursions & diving: one document with a localized slug per locale.
  const slugPairs: Array<{
    pathname: "/excursions/[slug]" | "/scuba-diving/[slug]";
    en: string;
    es: string;
  }> = [
    ...excursionSlugs.map((s) => ({
      pathname: "/excursions/[slug]" as const,
      en: s.en,
      es: s.es,
    })),
    ...divingSlugs.map((s) => ({
      pathname: "/scuba-diving/[slug]" as const,
      en: s.en,
      es: s.es,
    })),
  ];

  for (const { pathname, en, es } of slugPairs) {
    const enHref: AppHref = { pathname, params: { slug: en } };
    const esHref: AppHref = { pathname, params: { slug: es } };
    const languages = {
      en: localizedUrl(enHref, "en"),
      es: localizedUrl(esHref, "es"),
    } as Record<string, string>;

    entries.push({
      url: localizedUrl(enHref, "en"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: { languages },
    });
    entries.push({
      url: localizedUrl(esHref, "es"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: { languages },
    });
  }

  // Blog: one document per language, paired by translationGroup for alternates.
  const blogByGroup = new Map<string, Map<string, string>>();
  for (const a of blogEntries) {
    const key = a.translationGroup ?? a.slug;
    if (!blogByGroup.has(key)) blogByGroup.set(key, new Map());
    blogByGroup.get(key)!.set(a.language, a.slug);
  }

  for (const a of blogEntries) {
    const group = blogByGroup.get(a.translationGroup ?? a.slug)!;
    const languages: Record<string, string> = {};
    for (const [lang, slug] of group) {
      languages[lang] = localizedUrl(
        { pathname: "/blog/[slug]", params: { slug } },
        lang as "en" | "es",
      );
    }
    entries.push({
      url: localizedUrl(
        { pathname: "/blog/[slug]", params: { slug: a.slug } },
        a.language,
      ),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: { languages },
    });
  }

  return entries;
}
