import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // Only en/es have message bundles; fr/de/pt/it fall back to en for chrome
  // strings while keeping the real locale for date/number formatting.
  const messageLocale: "en" | "es" = locale === "es" ? "es" : "en";

  return {
    locale,
    messages: (await import(`../../messages/${messageLocale}.json`)).default,
  };
});
