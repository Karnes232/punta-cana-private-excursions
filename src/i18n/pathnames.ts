import type { Pathnames } from "next-intl/routing";

/**
 * Localized pathname map. The KEY is the internal (English) pathname and must
 * match the `app/(root)/[locale]/...` folder structure. The VALUE is either a
 * single string (same segment for every locale) or a per-locale map.
 *
 * next-intl localizes only the STATIC segments here — the `[slug]` token is a
 * placeholder substituted verbatim, so the translated slug value itself comes
 * from Sanity (see resolveSlug.ts), not from this map.
 *
 * This is the single source of truth for route segments: it is consumed by the
 * routing config, navigation helpers, sitemap, and SEO metadata builders.
 *
 * NOTE: fr/de/pt/it segments below mirror English. Those locales are only
 * routable on /blog and /blog/[slug] — middleware (src/proxy.ts) redirects
 * any other path under those locales back to the unprefixed (English) URL.
 * The segments exist purely to satisfy next-intl's type constraint.
 */
export const pathnames = {
  "/": "/",

  "/excursions": {
    en: "/excursions",
    es: "/excursiones",
    fr: "/excursions",
    de: "/excursions",
    pt: "/excursions",
    it: "/excursions",
  },
  "/excursions/[slug]": {
    en: "/excursions/[slug]",
    es: "/excursiones/[slug]",
    fr: "/excursions/[slug]",
    de: "/excursions/[slug]",
    pt: "/excursions/[slug]",
    it: "/excursions/[slug]",
  },

  "/scuba-diving": {
    en: "/scuba-diving",
    es: "/buceo",
    fr: "/scuba-diving",
    de: "/scuba-diving",
    pt: "/scuba-diving",
    it: "/scuba-diving",
  },
  "/scuba-diving/[slug]": {
    en: "/scuba-diving/[slug]",
    es: "/buceo/[slug]",
    fr: "/scuba-diving/[slug]",
    de: "/scuba-diving/[slug]",
    pt: "/scuba-diving/[slug]",
    it: "/scuba-diving/[slug]",
  },

  "/blog": "/blog",
  "/blog/[slug]": "/blog/[slug]",

  "/about": {
    en: "/about",
    es: "/nosotros",
    fr: "/about",
    de: "/about",
    pt: "/about",
    it: "/about",
  },
  "/contact": {
    en: "/contact",
    es: "/contacto",
    fr: "/contact",
    de: "/contact",
    pt: "/contact",
    it: "/contact",
  },
  "/faq": {
    en: "/faq",
    es: "/preguntas-frecuentes",
    fr: "/faq",
    de: "/faq",
    pt: "/faq",
    it: "/faq",
  },
  "/how-it-works": {
    en: "/how-it-works",
    es: "/como-funciona",
    fr: "/how-it-works",
    de: "/how-it-works",
    pt: "/how-it-works",
    it: "/how-it-works",
  },
  "/cancellation-policy": {
    en: "/cancellation-policy",
    es: "/politica-de-cancelacion",
    fr: "/cancellation-policy",
    de: "/cancellation-policy",
    pt: "/cancellation-policy",
    it: "/cancellation-policy",
  },
  "/privacy-policy": {
    en: "/privacy-policy",
    es: "/politica-de-privacidad",
    fr: "/privacy-policy",
    de: "/privacy-policy",
    pt: "/privacy-policy",
    it: "/privacy-policy",
  },
  "/terms-of-service": {
    en: "/terms-of-service",
    es: "/terminos-de-servicio",
    fr: "/terms-of-service",
    de: "/terms-of-service",
    pt: "/terms-of-service",
    it: "/terms-of-service",
  },
} satisfies Pathnames<readonly ["en", "es", "fr", "de", "pt", "it"]>;
