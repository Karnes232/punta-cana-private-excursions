import { getPathname, type AppHref } from "@/i18n/navigation";
import { SITE_URL } from "@/lib/seo/constants";

/**
 * Build an absolute URL for a route in a given locale, using the localized
 * pathname map (translated segments) and `as-needed` prefixing. `href` is a
 * route key (e.g. "/excursions") or an object `{ pathname, params }` for
 * `[slug]` routes.
 */
export function localizedUrl(
  href: AppHref,
  locale: "en" | "es",
  baseUrl: string = SITE_URL,
): string {
  const path = getPathname({ href, locale });
  return path === "/" ? baseUrl : `${baseUrl}${path}`;
}

/**
 * hreflang alternates for a route across both locales, with `x-default` → en.
 * Plug straight into Next.js `Metadata.alternates`.
 */
export function generateHreflangAlternates(
  href: AppHref,
  baseUrl: string = SITE_URL,
) {
  const en = localizedUrl(href, "en", baseUrl);
  const es = localizedUrl(href, "es", baseUrl);
  return {
    languages: {
      en,
      es,
      "x-default": en,
    },
  };
}
