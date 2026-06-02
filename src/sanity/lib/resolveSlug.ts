/**
 * Helpers for resolving localized content slugs.
 *
 * Documents (excursion, divingExcursion) carry a per-language `localizedSlug`
 * plus a deprecated single `slug`. URLs may arrive bearing the slug for either
 * language (e.g. an old English slug under `/es`), so lookups match ANY of the
 * three; the page then computes the canonical slug for the active locale and
 * 308-redirects if the requested slug isn't canonical.
 */

export type Locale = "en" | "es";

export interface LocalizedSlug {
  en?: { current?: string } | null;
  es?: { current?: string } | null;
}

export interface SluggedDoc {
  localizedSlug?: LocalizedSlug | null;
  slug?: { current?: string } | null;
}

/**
 * GROQ filter fragment that matches a document by its localized slug in either
 * language, or its legacy slug. Expects a `$slug` param in the query.
 */
export const SLUG_MATCH =
  "(localizedSlug.en.current == $slug || localizedSlug.es.current == $slug || slug.current == $slug)";

/**
 * GROQ projection fragment to include both the localized and legacy slug on a
 * document/reference so the frontend can build localized hrefs and redirects.
 */
export const SLUG_PROJECTION = "slug, localizedSlug";

/**
 * The canonical slug for a document in a given locale: the localized slug for
 * that locale, falling back to English, then the legacy slug.
 */
export function canonicalSlug(doc: SluggedDoc, locale: Locale): string {
  return (
    doc.localizedSlug?.[locale]?.current ??
    doc.localizedSlug?.en?.current ??
    doc.slug?.current ??
    ""
  );
}
