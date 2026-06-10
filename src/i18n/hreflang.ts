import { getPathname, type AppHref } from "@/i18n/navigation";
import { SITE_URL } from "@/lib/seo/constants";

export type Locale = "en" | "es" | "fr" | "de" | "pt" | "it";

const DEFAULT_HREFLANG_LOCALES = ["en", "es"] as const satisfies readonly Locale[];

/**
 * Build an absolute URL for a route in a given locale, using the localized
 * pathname map (translated segments) and `as-needed` prefixing. `href` is a
 * route key (e.g. "/excursions") or an object `{ pathname, params }` for
 * `[slug]` routes.
 */
export function localizedUrl(
  href: AppHref,
  locale: Locale,
  baseUrl: string = SITE_URL,
): string {
  const path = getPathname({ href, locale });
  return path === "/" ? baseUrl : `${baseUrl}${path}`;
}

export interface HreflangOptions {
  /** Locales to emit hreflang for. Defaults to ["en", "es"] for back-compat. */
  locales?: readonly Locale[];
  /**
   * For slug routes, per-locale slug overrides. When set, locales missing from
   * the map are skipped (we don't emit hreflang for pages that don't exist).
   */
  slugsByLocale?: Partial<Record<Locale, string>>;
  /** Which locale's URL is `x-default`. Defaults to "en". */
  xDefaultLocale?: Locale;
}

function hasSlugParam(
  href: AppHref,
): href is AppHref & { pathname: string; params: { slug: string } } {
  return (
    typeof href === "object" &&
    href !== null &&
    "params" in href &&
    !!href.params &&
    typeof href.params === "object" &&
    "slug" in href.params
  );
}

/**
 * hreflang alternates for a route across one or more locales. Plug straight
 * into Next.js `Metadata.alternates`.
 *
 * - With no options: emits en + es + x-default (backwards compatible).
 * - With `locales`: emits an entry per locale (static-route URLs).
 * - With `slugsByLocale`: emits one entry per locale that has a slug; the
 *   slug in `href` is replaced per locale. Locales with no slug are dropped.
 */
export function generateHreflangAlternates(
  href: AppHref,
  options: HreflangOptions = {},
  baseUrl: string = SITE_URL,
): { languages: Record<string, string> } {
  const locales = options.locales ?? DEFAULT_HREFLANG_LOCALES;
  const { slugsByLocale, xDefaultLocale = "en" } = options;

  const languages: Record<string, string> = {};

  for (const locale of locales) {
    let urlHref: AppHref = href;
    if (slugsByLocale) {
      const slug = slugsByLocale[locale];
      if (!slug) continue;
      if (hasSlugParam(href)) {
        const obj = href as { pathname: string; params: Record<string, string> };
        urlHref = {
          ...obj,
          params: { ...obj.params, slug },
        } as AppHref;
      }
    }
    languages[locale] = localizedUrl(urlHref, locale, baseUrl);
  }

  if (Object.keys(languages).length > 0) {
    languages["x-default"] =
      languages[xDefaultLocale] ?? Object.values(languages)[0];
  }

  return { languages };
}
