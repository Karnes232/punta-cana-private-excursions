"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname, staticHref } from "@/i18n/navigation";
import { useLocaleSwitch } from "@/components/Layout/LocaleSwitchContext";
import { getLocalized } from "@/sanity/queries/GeneralLayout/generalLayoutQuery";
import type {
  Logo as LogoType,
  NavLink as NavLinkType,
  LocalizedField,
} from "@/sanity/queries/GeneralLayout/generalLayoutQuery";

export interface NavCtaButtonType {
  label: LocalizedField;
  href: string;
}

interface NavbarProps {
  locale: "en" | "es";
  logo?: LogoType | null;
  navLinks?: NavLinkType[];
  navCtaButton?: NavCtaButtonType | null;
}

const DEFAULT_NAV_KEYS = [
  { key: "excursions", href: "/excursions" },
  { key: "scubaDiving", href: "/scuba-diving" },
  { key: "about", href: "/about" },
  { key: "blog", href: "/blog" },
  { key: "faq", href: "/faq" },
  { key: "contact", href: "/contact" },
] as const;

export function Navbar({ locale, logo, navLinks, navCtaButton }: NavbarProps) {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const switchAlternates = useLocaleSwitch();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastYRef = useRef(0);

  useEffect(() => {
    // Threshold past which we start hiding (roughly the navbar height)
    const HIDE_THRESHOLD = 80;
    // Ignore tiny scroll jitter
    const DELTA = 6;

    const onScroll = () => {
      const y = window.scrollY;
      const last = lastYRef.current;

      setScrolled(y > 12);

      if (Math.abs(y - last) > DELTA) {
        if (y > last && y > HIDE_THRESHOLD) {
          // scrolling down past threshold → hide
          setHidden(true);
        } else {
          // scrolling up → show
          setHidden(false);
        }
        lastYRef.current = y;
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Always show the navbar when the mobile menu is open
  useEffect(() => {
    if (mobileOpen) setHidden(false);
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const links =
    navLinks && navLinks.length > 0
      ? navLinks.map((l) => ({ label: getLocalized(l.label, locale), href: l.href }))
      : DEFAULT_NAV_KEYS.map(({ key, href }) => ({
          label: t(key),
          href,
        }));

  const cta = navCtaButton
    ? { label: getLocalized(navCtaButton.label, locale), href: navCtaButton.href }
    : { label: t("bookNow"), href: "/excursions" };

  const otherLocale = locale === "en" ? "es" : "en";

  // On slug pages the switcher must target the OTHER locale's translated slug
  // (registered via LocaleSwitchContext); elsewhere it reuses the pathname,
  // which next-intl re-localizes for the target locale.
  const switchHref = switchAlternates
    ? {
        pathname: switchAlternates.pathname,
        params: { slug: switchAlternates.slugs[otherLocale] },
      }
    : staticHref(pathname);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 will-change-transform ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-sand-dark"
          : "bg-white/70 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 h-20 flex items-center justify-between gap-6">
        <Link
          href="/"
          className="flex items-center gap-3 group"
          aria-label="Punta Cana Private Excursions home"
        >
          {logo?.asset?.url ? (
            <Image
              src={logo.asset.url}
              alt="Punta Cana Private Excursions"
              width={logo.asset.metadata?.dimensions?.width ?? 240}
              height={logo.asset.metadata?.dimensions?.height ?? 64}
              priority
              className="h-14 sm:h-16 w-auto"
            />
          ) : (
            <span className="flex flex-col leading-none">
              <span className="text-xs uppercase tracking-[0.22em] text-sunset font-heading font-semibold">
                VIP · Punta Cana
              </span>
              <span className="font-heading font-bold text-ocean text-xl sm:text-2xl mt-1.5 tracking-[-0.01em]">
                Private Excursions
              </span>
            </span>
          )}
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={staticHref(link.href)}
                className={`text-sm font-heading font-medium transition-colors ${
                  active
                    ? "text-ocean"
                    : "text-slate hover:text-ocean"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Link
            href={switchHref}
            locale={otherLocale}
            className="text-xs font-heading font-semibold tracking-[0.18em] uppercase text-slate hover:text-ocean transition-colors"
            aria-label={`Switch to ${otherLocale.toUpperCase()}`}
          >
            {otherLocale}
          </Link>
          <Link href={staticHref(cta.href)} className="btn-primary text-sm">
            {cta.label}
          </Link>
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="lg:hidden p-2 -mr-2 text-slate hover:text-ocean transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {mobileOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-sand-dark bg-white">
          <nav className="max-w-7xl mx-auto px-5 sm:px-8 py-6 flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={staticHref(link.href)}
                className="font-heading font-medium text-slate hover:text-ocean py-3 border-b border-sand-dark/60 last:border-b-0"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center justify-between gap-4 mt-6">
              <Link
                href={switchHref}
                locale={otherLocale}
                className="text-xs font-heading font-semibold tracking-[0.18em] uppercase text-slate"
              >
                {otherLocale}
              </Link>
              <Link
                href={staticHref(cta.href)}
                className="btn-primary text-sm flex-1 text-center"
              >
                {cta.label}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
