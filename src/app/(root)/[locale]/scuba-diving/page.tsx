import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { BlockContent } from "@/components/BlockContent/BlockContent";
import { CtaBanner } from "@/components/HomePage/CtaBanner/CtaBanner";
import {
  getDivingSnorkelingPage,
  getScubaDivingExcursionsByAudience,
  getDivingSnorkelingPageSeo,
  type DivingExcursionCard,
} from "@/sanity/queries/DivingSnorkelingPage/DivingSnorkelingPage";
import { getDefaultSeo } from "@/sanity/queries/SEO/seoProjection";
import { buildMetadata } from "@/lib/seo/buildMetadata";
import {
  getLocalized,
  getLocalizedPortableText,
  type LocalizedField,
} from "@/sanity/queries/GeneralLayout/generalLayoutQuery";
import { canonicalSlug } from "@/sanity/lib/resolveSlug";
import { hotspotToObjectPosition } from "@/sanity/lib/hotspot";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [pageSeo, defaultSeo, page] = await Promise.all([
    getDivingSnorkelingPageSeo().catch(() => null),
    getDefaultSeo().catch(() => null),
    getDivingSnorkelingPage().catch(() => null),
  ]);
  const lk = locale as keyof LocalizedField;

  return buildMetadata({
    seo: pageSeo?.seo,
    defaults: defaultSeo?.defaultSeo,
    locale: locale as "en" | "es",
    href: "/scuba-diving",
    fallbackTitle: page?.heroHeadline?.[lk] ?? "Private Diving Charters",
    fallbackDescription: page?.heroSubheadline?.[lk],
  });
}

export default async function ScubaDivingHub({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lk = locale as keyof LocalizedField;
  const isEs = locale === "es";

  const [page, excursionsByAudience] = await Promise.all([
    getDivingSnorkelingPage().catch(() => null),
    getScubaDivingExcursionsByAudience().catch(() => ({
      courses: [],
      certified: [],
    })),
  ]);
  const { courses, certified } = excursionsByAudience;

  return (
    <>
      <PageHero
        eyebrow={isEs ? "Charters privados" : "Private charters"}
        headline={
          page?.heroHeadline?.[lk] ??
          (isEs
            ? "Buceo y snorkel privado."
            : "Private diving and snorkeling.")
        }
        subheadline={page?.heroSubheadline?.[lk]}
        image={
          page?.heroImage?.url
            ? {
                url: page.heroImage.url,
                lqip: page.heroImage.lqip,
                hotspot: page.heroImage.hotspot,
              }
            : null
        }
      />

      {/* Intro */}
      {(page?.introHeadline || page?.introBody) && (
        <section className="section-white py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <RevealOnScroll>
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
                {page?.introImage?.url ? (
                  <Image
                    src={page.introImage.url}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    placeholder={page.introImage.lqip ? "blur" : undefined}
                    blurDataURL={page.introImage.lqip}
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-teal to-ocean" />
                )}
              </div>
            </RevealOnScroll>
            <RevealOnScroll delayMs={120}>
              <div>
                {page?.introTagline?.[lk] && (
                  <SectionEyebrow align="left" className="mb-5">
                    {page.introTagline[lk]}
                  </SectionEyebrow>
                )}
                {page?.introHeadline?.[lk] && (
                  <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-dark leading-tight tracking-[-0.015em]">
                    {page.introHeadline[lk]}
                  </h2>
                )}
                <BlockContent
                  value={getLocalizedPortableText(page?.introBody, locale)}
                  className="mt-6"
                />
                {page?.introStats && page.introStats.length > 0 && (
                  <div className="grid grid-cols-2 gap-6 mt-8">
                    {page.introStats.map((s, i) => (
                      <div key={i}>
                        <p className="font-heading font-bold text-3xl text-ocean tracking-[-0.02em]">
                          {getLocalized(s.value, locale)}
                        </p>
                        <p className="mt-1 text-xs text-gray-dark uppercase tracking-[0.14em] font-heading font-semibold">
                          {getLocalized(s.label, locale)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </RevealOnScroll>
          </div>
        </section>
      )}

      {/* Excursions — Courses + Certified Divers */}
      <section className="section-sand py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          {courses.length === 0 && certified.length === 0 ? (
            <p className="text-center py-12 text-gray italic">
              {isEs
                ? "Pronto publicaremos nuestros charters privados de buceo."
                : "Our private dive charters will appear here soon."}
            </p>
          ) : (
            <>
              <div className="text-center max-w-2xl mx-auto mb-16">
                <SectionEyebrow>
                  {page?.excursionsEyebrow?.[lk] ||
                    (isEs ? "Nuestros charters" : "Our charters")}
                </SectionEyebrow>
                <h2 className="mt-5 font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-dark leading-tight tracking-[-0.015em]">
                  {page?.excursionsHeading?.[lk] ||
                    (isEs
                      ? "Elige tu día bajo el agua."
                      : "Choose your underwater day.")}
                </h2>
              </div>

              {courses.length > 0 && (
                <div>
                  <div className="max-w-2xl mb-10">
                    <h3 className="font-heading font-bold text-2xl sm:text-3xl text-slate-dark tracking-[-0.015em]">
                      {page?.coursesHeading?.[lk] ||
                        (isEs
                          ? "Cursos y certificaciones de buceo"
                          : "Diving courses & certifications")}
                    </h3>
                    {page?.coursesSubheading?.[lk] && (
                      <p className="mt-3 text-slate leading-relaxed">
                        {page.coursesSubheading[lk]}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map((exc, i) => (
                      <RevealOnScroll key={exc._id} delayMs={(i % 3) * 80}>
                        <DivingCard exc={exc} locale={locale} />
                      </RevealOnScroll>
                    ))}
                  </div>
                </div>
              )}

              {certified.length > 0 && (
                <div className={courses.length > 0 ? "mt-20" : undefined}>
                  <div className="max-w-2xl mb-10">
                    <h3 className="font-heading font-bold text-2xl sm:text-3xl text-slate-dark tracking-[-0.015em]">
                      {page?.certifiedHeading?.[lk] ||
                        (isEs
                          ? "Para buzos certificados"
                          : "For certified divers")}
                    </h3>
                    {page?.certifiedSubheading?.[lk] && (
                      <p className="mt-3 text-slate leading-relaxed">
                        {page.certifiedSubheading[lk]}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {certified.map((exc, i) => (
                      <RevealOnScroll key={exc._id} delayMs={(i % 3) * 80}>
                        <DivingCard exc={exc} locale={locale} />
                      </RevealOnScroll>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Why book with us */}
      {page?.trustCards && page.trustCards.length > 0 && (
        <section className="section-white py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <SectionEyebrow>
                {page.trustEyebrow?.[lk] || (isEs ? "Por qué nosotros" : "Why us")}
              </SectionEyebrow>
              <h2 className="mt-5 font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-dark leading-tight tracking-[-0.015em]">
                {page.trustHeadline?.[lk] ||
                  (isEs
                    ? "La diferencia está en los detalles."
                    : "The difference is in the details.")}
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {page.trustCards.map((card, i) => (
                <RevealOnScroll key={i} delayMs={i * 80}>
                  <div className="h-full p-8 rounded-2xl border border-sand-dark bg-sand/50 hover:bg-white hover:shadow-card transition-all">
                    <h3 className="font-heading font-bold text-lg text-slate-dark mb-2 h-12">
                      {getLocalized(card.title, locale)}
                    </h3>
                    <p className="text-slate text-sm leading-relaxed">
                      {getLocalized(card.text, locale)}
                    </p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBanner
        headline={
          page?.ctaHeadline?.[lk] ??
          (isEs
            ? "Diseñemos tu día privado bajo el agua."
            : "Let's design your private day underwater.")
        }
        primaryCtaText={
          page?.ctaButtonText?.[lk] ??
          (isEs ? "Hablar con conserjería" : "Talk to concierge")
        }
        primaryCtaHref="/contact"
      />
    </>
  );
}

function DivingCard({
  exc,
  locale,
}: {
  exc: DivingExcursionCard;
  locale: string;
}) {
  return (
    <Link
      href={{
        pathname: "/scuba-diving/[slug]",
        params: {
          slug: canonicalSlug(exc, locale as "en" | "es"),
        },
      }}
      className="group block card-excursion h-full"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {exc.heroImage?.url ? (
          <Image
            src={exc.heroImage.url}
            alt={getLocalized(exc.heroImage.alt, locale)}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            placeholder={exc.heroImage.lqip ? "blur" : undefined}
            blurDataURL={exc.heroImage.lqip}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            style={{
              objectPosition: hotspotToObjectPosition(exc.heroImage.hotspot),
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-teal to-ocean" />
        )}
      </div>
      <div className="p-6">
        <h3 className="font-heading font-bold text-xl text-slate-dark mb-2 group-hover:text-ocean transition-colors">
          {getLocalized(exc.title, locale)}
        </h3>
        <p className="text-slate text-sm leading-relaxed mb-4 line-clamp-2">
          {getLocalized(exc.shortSummary, locale)}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-sand-dark">
          <span className="text-xs text-gray-dark uppercase tracking-wider">
            {getLocalized(exc.duration, locale)}
          </span>
          <span className="font-heading font-bold text-ocean">
            <span className="text-xs text-gray-dark mr-1 font-body font-normal">
              from
            </span>
            ${exc.price}
          </span>
        </div>
      </div>
    </Link>
  );
}
