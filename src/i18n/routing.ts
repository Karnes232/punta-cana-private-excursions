import { defineRouting } from "next-intl/routing";

import { pathnames } from "./pathnames";

export const routing = defineRouting({
  locales: ["en", "es", "fr", "de", "pt", "it"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: false,
  pathnames,
});
