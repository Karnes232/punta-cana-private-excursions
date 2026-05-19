import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/constants";
import { getExcursionSlugs } from "@/sanity/queries/IndividualExcursions/Excursionqueries";
import { getDivingExcursionSlugs } from "@/sanity/queries/DivingSnorkelingPage/IndividualDivingExcursion";
import { getBlogArticleSlugs } from "@/sanity/queries/Blog/Blog";

const LOCALES = ["en", "es"] as const;
const STATIC_PATHS = [
  "",
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
];

function url(locale: string, path: string) {
  const prefix = locale === "en" ? "" : `/${locale}`;
  return `${SITE_URL}${prefix}${path}`;
}

function alternates(path: string) {
  return {
    languages: Object.fromEntries(
      LOCALES.map((l) => [l, url(l, path)]),
    ) as Record<string, string>,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [excursionSlugs, divingSlugs, blogSlugs] = await Promise.all([
    getExcursionSlugs().catch(() => []),
    getDivingExcursionSlugs().catch(() => []),
    getBlogArticleSlugs().catch(() => []),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  // Static routes × locales
  for (const path of STATIC_PATHS) {
    for (const locale of LOCALES) {
      entries.push({
        url: url(locale, path),
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1.0 : 0.7,
        alternates: alternates(path),
      });
    }
  }

  // Dynamic routes
  for (const { slug } of excursionSlugs) {
    const p = `/excursions/${slug}`;
    for (const locale of LOCALES) {
      entries.push({
        url: url(locale, p),
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: alternates(p),
      });
    }
  }

  for (const { slug } of divingSlugs) {
    const p = `/scuba-diving/${slug}`;
    for (const locale of LOCALES) {
      entries.push({
        url: url(locale, p),
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: alternates(p),
      });
    }
  }

  for (const { slug } of blogSlugs) {
    const p = `/blog/${slug}`;
    for (const locale of LOCALES) {
      entries.push({
        url: url(locale, p),
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: alternates(p),
      });
    }
  }

  return entries;
}
