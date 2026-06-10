import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Montserrat, DM_Sans, Inter } from "next/font/google";
import { routing } from "@/i18n/routing";
import { SITE_NAME, SITE_URL } from "@/lib/seo/constants";
import { Navbar } from "@/components/Layout/Navbar/Navbar";
import { Footer } from "@/components/Layout/Footer/Footer";
import { LocaleSwitchProvider } from "@/components/Layout/LocaleSwitchContext";
import { getGeneralLayout } from "@/sanity/queries/GeneralLayout/generalLayoutQuery";
import { urlFor } from "@/sanity/lib/image";
import "../../globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const layout = await getGeneralLayout().catch(() => null);

  // Prefer the dedicated favicon field; fall back to the main logo.
  const iconSource = layout?.favicon ?? layout?.logo ?? null;
  const icons: Metadata["icons"] | undefined = iconSource?.asset?.url
    ? {
        icon: [
          {
            url: urlFor(iconSource)
              .width(32)
              .height(32)
              .fit("crop")
              .auto("format")
              .url(),
            sizes: "32x32",
            type: "image/png",
          },
          {
            url: urlFor(iconSource)
              .width(192)
              .height(192)
              .fit("crop")
              .auto("format")
              .url(),
            sizes: "192x192",
            type: "image/png",
          },
        ],
        apple: [
          {
            url: urlFor(iconSource)
              .width(180)
              .height(180)
              .fit("crop")
              .auto("format")
              .url(),
            sizes: "180x180",
            type: "image/png",
          },
        ],
      }
    : undefined;

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
    description:
      "Private, VIP excursions in Punta Cana — bespoke charters, private guides, and the most exclusive experiences on the Dominican coast.",
    ...(icons ? { icons } : {}),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const generalLayout = await getGeneralLayout().catch(() => null);
  // Site chrome (Navbar/Footer) only ships en/es content; non-chrome locales
  // fall back to English. The blog routes are the only ones that ever receive
  // fr/de/pt/it (middleware redirects everything else away).
  const chromeLocale: "en" | "es" = locale === "es" ? "es" : "en";

  return (
    <html
      lang={locale}
      className={`${montserrat.variable} ${dmSans.variable} ${inter.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="antialiased min-h-screen flex flex-col bg-white">
        <NextIntlClientProvider locale={locale}>
          <LocaleSwitchProvider>
            <Navbar
              locale={chromeLocale}
              logo={generalLayout?.logo}
              navLinks={generalLayout?.navLinks}
              navCtaButton={generalLayout?.navCtaButton}
            />
            <main className="flex-1">{children}</main>
          </LocaleSwitchProvider>
          <Footer
            locale={chromeLocale}
            logo={generalLayout?.logoAlt ?? generalLayout?.logo}
            companyName={generalLayout?.companyName}
            tagline={generalLayout?.tagline}
            footerDescription={generalLayout?.footerDescription}
            socialLinks={generalLayout?.socialLinks}
            footerQuickLinks={generalLayout?.footerQuickLinks}
            email={generalLayout?.email}
            phone={generalLayout?.phone}
            serviceArea={generalLayout?.serviceArea}
            responseTime={generalLayout?.responseTime}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
