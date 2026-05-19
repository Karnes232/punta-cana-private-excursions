export const SITE_NAME = "Punta Cana Private Excursions";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://www.puntacanaprivateexcursions.com";

export const DEFAULT_OG_IMAGE = "/og-default.jpg";

export const BRAND_TAGLINE_EN = "Bespoke private excursions in Punta Cana.";
export const BRAND_TAGLINE_ES = "Excursiones privadas a medida en Punta Cana.";

/** Used as the `[VIP]` subject prefix on operator notification emails so the
 *  shared booking inbox can prioritize private-site bookings. */
export const OPERATOR_EMAIL_SUBJECT_PREFIX = "[VIP]";
