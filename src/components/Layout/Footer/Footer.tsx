import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link, staticHref } from "@/i18n/navigation";
import type {
  SocialLink,
  FooterQuickLink,
  LocalizedField,
} from "@/sanity/queries/GeneralLayout/generalLayoutQuery";
import { getLocalized } from "@/sanity/queries/GeneralLayout/generalLayoutQuery";
import { SocialIcon } from "./SocialIcon";

interface LogoLike {
  asset?: {
    url?: string;
    metadata?: { dimensions?: { width?: number; height?: number } };
  };
}

interface FooterProps {
  locale: "en" | "es";
  logo?: LogoLike | null;
  companyName?: LocalizedField | null;
  tagline?: LocalizedField | null;
  footerDescription?: LocalizedField | null;
  socialLinks?: SocialLink[];
  footerQuickLinks?: FooterQuickLink[];
  email?: string;
  phone?: string;
  serviceArea?: LocalizedField | null;
  responseTime?: LocalizedField | null;
}

const FALLBACK_QUICK_LINKS_EN = [
  { label: "Private Excursions", href: "/excursions" },
  { label: "Diving & Snorkeling", href: "/scuba-diving" },
  { label: "Concierge", href: "/contact" },
  { label: "About", href: "/about" },
  { label: "Journal", href: "/blog" },
];

const FALLBACK_QUICK_LINKS_ES = [
  { label: "Excursiones Privadas", href: "/excursions" },
  { label: "Buceo y Snorkel", href: "/scuba-diving" },
  { label: "Conserjería", href: "/contact" },
  { label: "Sobre Nosotros", href: "/about" },
  { label: "Revista", href: "/blog" },
];

export async function Footer({
  locale,
  logo,
  companyName,
  tagline,
  footerDescription,
  socialLinks,
  footerQuickLinks,
  email,
  phone,
  serviceArea,
  responseTime,
}: FooterProps) {
  const t = await getTranslations({ locale, namespace: "Footer" });
  const company = getLocalized(companyName, locale) || "Punta Cana Private Excursions";
  const tag = getLocalized(tagline, locale) ||
    (locale === "es"
      ? "Excursiones privadas a medida en Punta Cana."
      : "Bespoke private excursions in Punta Cana.");
  const description =
    getLocalized(footerDescription, locale) ||
    (locale === "es"
      ? "Servicio de conserjería y charters privados para huéspedes que buscan lo mejor de la costa Caribe."
      : "Concierge service and private charters for guests who want the very best of the Caribbean coast.");

  const quickLinks =
    footerQuickLinks && footerQuickLinks.length > 0
      ? footerQuickLinks.map((q) => ({
          label: getLocalized(q.label, locale),
          href: q.href,
        }))
      : locale === "es"
        ? FALLBACK_QUICK_LINKS_ES
        : FALLBACK_QUICK_LINKS_EN;

  return (
    <footer className="bg-slate-dark text-white pt-20 pb-10">
      {/* Brand accent bar */}
      <div className="h-px max-w-7xl mx-auto bg-gradient-to-r from-ocean via-teal to-sunset opacity-70 mb-16" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 grid gap-12 lg:gap-16 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        {/* Brand */}
        <div>
          {logo?.asset?.url ? (
            <Image
              src={logo.asset.url}
              alt={company}
              width={logo.asset.metadata?.dimensions?.width ?? 280}
              height={logo.asset.metadata?.dimensions?.height ?? 72}
              className="h-20 w-auto mb-7"
            />
          ) : (
            <div className="mb-7">
              <p className="text-xs uppercase tracking-[0.22em] text-sunset font-heading font-semibold mb-2">
                VIP · Punta Cana
              </p>
              <p className="font-heading font-bold text-2xl sm:text-3xl tracking-[-0.01em]">
                {company}
              </p>
            </div>
          )}
          <p className="text-sand-dark/80 text-sm leading-relaxed mb-4 max-w-sm">
            {description}
          </p>
          <p className="text-sand-dark/60 text-xs italic">{tag}</p>

          {socialLinks && socialLinks.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-6">
              {socialLinks.map((s) => (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.platform}
                  title={s.platform}
                  className="w-10 h-10 rounded-full border border-sand-dark/30 text-sand-dark/80 hover:border-sunset hover:text-sunset flex items-center justify-center transition-colors"
                >
                  <SocialIcon platform={s.platform} className="w-[18px] h-[18px]" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div>
          <h4 className="font-heading font-semibold text-sm uppercase tracking-[0.16em] text-sand-dark mb-5">
            {t("excursions")}
          </h4>
          <ul className="space-y-3">
            {quickLinks.map((q) => (
              <li key={q.href}>
                <Link
                  href={staticHref(q.href)}
                  className="text-sand-dark/80 hover:text-sunset text-sm transition-colors"
                >
                  {q.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-heading font-semibold text-sm uppercase tracking-[0.16em] text-sand-dark mb-5">
            {t("company")}
          </h4>
          <ul className="space-y-3">
            <li>
              <Link href="/privacy-policy" className="text-sand-dark/80 hover:text-sunset text-sm transition-colors">
                {t("privacyPolicy")}
              </Link>
            </li>
            <li>
              <Link href="/terms-of-service" className="text-sand-dark/80 hover:text-sunset text-sm transition-colors">
                {t("termsOfService")}
              </Link>
            </li>
            <li>
              <Link href="/cancellation-policy" className="text-sand-dark/80 hover:text-sunset text-sm transition-colors">
                {t("cancellationPolicy")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-heading font-semibold text-sm uppercase tracking-[0.16em] text-sand-dark mb-5">
            {t("contact")}
          </h4>
          <ul className="space-y-3 text-sm text-sand-dark/80">
            {email && (
              <li>
                <a href={`mailto:${email}`} className="hover:text-sunset transition-colors">
                  {email}
                </a>
              </li>
            )}
            {phone && (
              <li>
                <a
                  href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-sunset transition-colors"
                >
                  {phone}
                </a>
              </li>
            )}
            {serviceArea && (
              <li className="text-sand-dark/60">{getLocalized(serviceArea, locale)}</li>
            )}
            {responseTime && (
              <li className="text-sand-dark/60 text-xs italic">
                {getLocalized(responseTime, locale)}
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between text-xs text-sand-dark/50">
        <p>
          © {new Date().getFullYear()} {company}. All rights reserved.
        </p>
        <p className="italic">{tag}</p>
      </div>
    </footer>
  );
}
