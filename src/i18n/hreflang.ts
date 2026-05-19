import { SITE_URL } from "@/lib/seo/constants";

export function generateHreflangUrls(
  path: string,
  baseUrl: string = SITE_URL,
): { en: string; es: string } {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  const enPath = cleanPath;
  const esPath = cleanPath ? `es/${cleanPath}` : "es";

  return {
    en: enPath ? `${baseUrl}/${enPath}` : baseUrl,
    es: `${baseUrl}/${esPath}`,
  };
}

export function generateHreflangAlternates(
  _currentLocale: "en" | "es",
  path: string,
  baseUrl: string = SITE_URL,
) {
  const urls = generateHreflangUrls(path, baseUrl);

  return {
    languages: {
      en: urls.en,
      es: urls.es,
      "x-default": urls.en,
    },
  };
}
