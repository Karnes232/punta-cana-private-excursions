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
 */
export const pathnames = {
  "/": "/",

  "/excursions": {
    en: "/excursions",
    es: "/excursiones",
  },
  "/excursions/[slug]": {
    en: "/excursions/[slug]",
    es: "/excursiones/[slug]",
  },

  "/scuba-diving": {
    en: "/scuba-diving",
    es: "/buceo",
  },
  "/scuba-diving/[slug]": {
    en: "/scuba-diving/[slug]",
    es: "/buceo/[slug]",
  },

  "/blog": "/blog",
  "/blog/[slug]": "/blog/[slug]",

  "/about": {
    en: "/about",
    es: "/nosotros",
  },
  "/contact": {
    en: "/contact",
    es: "/contacto",
  },
  "/faq": {
    en: "/faq",
    es: "/preguntas-frecuentes",
  },
  "/how-it-works": {
    en: "/how-it-works",
    es: "/como-funciona",
  },
  "/cancellation-policy": {
    en: "/cancellation-policy",
    es: "/politica-de-cancelacion",
  },
  "/privacy-policy": {
    en: "/privacy-policy",
    es: "/politica-de-privacidad",
  },
  "/terms-of-service": {
    en: "/terms-of-service",
    es: "/terminos-de-servicio",
  },
} satisfies Pathnames<readonly ["en", "es"]>;
