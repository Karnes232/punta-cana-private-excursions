import { Link, staticHref } from "@/i18n/navigation";

interface CtaBannerProps {
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  whatsappNumber?: string;
  whatsappLabel?: string;
  whatsappText?: string;
}

/** Renders an internal locale-aware link or an external anchor based on the href. */
function CtaLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={staticHref(href)} className={className}>
      {children}
    </Link>
  );
}

export function CtaBanner({
  eyebrow = "Ready when you are",
  headline,
  subheadline,
  primaryCtaText,
  primaryCtaHref = "/contact",
  secondaryCtaText,
  secondaryCtaHref,
  whatsappNumber,
  whatsappLabel,
  whatsappText,
}: CtaBannerProps) {
  const cleanedPhone = whatsappNumber?.replace(/[^0-9]/g, "");
  const waUrl = cleanedPhone
    ? `https://wa.me/${cleanedPhone}${
        whatsappText ? `?text=${encodeURIComponent(whatsappText)}` : ""
      }`
    : null;

  return (
    <section className="relative isolate overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-ocean-dark via-ocean to-slate-dark" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 70% 30%, rgba(14,165,183,0.35), transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(244,161,26,0.25), transparent 55%)",
        }}
      />

      <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-12 py-24 sm:py-32 text-center">
        <p className="text-sunset font-heading font-semibold uppercase tracking-[0.22em] text-xs sm:text-sm mb-5">
          {eyebrow}
        </p>
        <h2 className="font-heading font-bold text-white text-3xl sm:text-5xl lg:text-6xl leading-tight tracking-[-0.015em]">
          {headline || "Let's plan your private day."}
        </h2>
        {subheadline && (
          <p className="mt-6 text-white/85 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {subheadline}
          </p>
        )}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {primaryCtaText && (
            <CtaLink href={primaryCtaHref} className="btn-accent">
              {primaryCtaText}
            </CtaLink>
          )}
          {secondaryCtaText && secondaryCtaHref && (
            <CtaLink href={secondaryCtaHref} className="btn-secondary">
              {secondaryCtaText}
            </CtaLink>
          )}
          {waUrl && whatsappLabel && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-whatsapp text-white font-heading font-semibold text-sm shadow-sm hover:bg-whatsapp-dark hover:-translate-y-0.5 transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.52 3.48A11.85 11.85 0 0 0 12.06 0C5.5 0 .17 5.32.17 11.86c0 2.09.55 4.13 1.6 5.93L0 24l6.4-1.68a11.83 11.83 0 0 0 5.66 1.44h.01c6.55 0 11.88-5.32 11.88-11.86a11.8 11.8 0 0 0-3.43-8.42Zm-8.46 18.24h-.01a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-3.8 1 1.02-3.7-.24-.38a9.84 9.84 0 0 1-1.51-5.23c0-5.44 4.43-9.86 9.88-9.86 2.64 0 5.12 1.03 6.99 2.9a9.8 9.8 0 0 1 2.89 6.97c0 5.44-4.43 9.86-9.83 9.89Z" />
              </svg>
              {whatsappLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
