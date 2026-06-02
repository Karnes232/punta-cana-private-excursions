import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { CtaBanner } from "@/components/HomePage/CtaBanner/CtaBanner";
import {
  getAboutPage,
  getAboutPageSeo,
} from "@/sanity/queries/AboutPage/AboutPage";
import { hotspotToObjectPosition } from "@/sanity/lib/hotspot";
import { getDefaultSeo } from "@/sanity/queries/SEO/seoProjection";
import { buildMetadata } from "@/lib/seo/buildMetadata";

interface LocalizedAny {
  en?: string;
  es?: string;
}
const loc = (f: LocalizedAny | undefined | null, l: string) =>
  (l === "es" ? f?.es : f?.en) || f?.en || "";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [pageSeo, defaultSeo, page] = await Promise.all([
    getAboutPageSeo().catch(() => null),
    getDefaultSeo().catch(() => null),
    getAboutPage().catch(() => null),
  ]);

  return buildMetadata({
    seo: pageSeo?.seo,
    defaults: defaultSeo?.defaultSeo,
    locale: locale as "en" | "es",
    href: "/about",
    fallbackTitle: loc(page?.heroHeadline, locale) || "About",
    fallbackDescription: loc(page?.heroSubheadline, locale),
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const page = await getAboutPage().catch(() => null);
  const isEs = locale === "es";

  return (
    <>
      <PageHero
        eyebrow={loc(page?.heroBadge, locale) || "Our story"}
        headline={
          loc(page?.heroHeadline, locale) ||
          (isEs
            ? "Conserjería privada, hecha con corazón local."
            : "Private concierge, run with a local heart.")
        }
        subheadline={loc(page?.heroSubheadline, locale)}
        image={page?.heroImage}
      />

      {/* Story */}
      <section className="section-white py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <RevealOnScroll>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
              {page?.storyImage?.url ? (
                <Image
                  src={page.storyImage.url}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  placeholder={page.storyImage.lqip ? "blur" : undefined}
                  blurDataURL={page.storyImage.lqip}
                  className="object-cover"
                  style={{
                    objectPosition: hotspotToObjectPosition(page.storyImage.hotspot),
                  }}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-teal to-ocean" />
              )}
            </div>
          </RevealOnScroll>
          <RevealOnScroll delayMs={120}>
            <div>
              {loc(page?.storyTagline, locale) && (
                <SectionEyebrow align="left" className="mb-5">
                  {loc(page?.storyTagline, locale)}
                </SectionEyebrow>
              )}
              <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-dark leading-tight tracking-[-0.015em]">
                {loc(page?.storyHeadline, locale) ||
                  (isEs
                    ? "Una pequeña casa de conserjería con grandes estándares."
                    : "A small concierge house with very large standards.")}
              </h2>
              {loc(page?.storyBody, locale) && (
                <p className="mt-6 text-slate text-lg leading-relaxed whitespace-pre-wrap">
                  {loc(page?.storyBody, locale)}
                </p>
              )}
              {page?.foundedYear && (
                <p className="mt-6 text-xs uppercase tracking-[0.18em] text-teal font-heading font-semibold">
                  {isEs ? "Fundado en" : "Founded in"} {page.foundedYear}
                </p>
              )}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Stats */}
      {page?.stats && page.stats.length > 0 && (
        <section className="section-sand py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            {loc(page.statsHeadline, locale) && (
              <h3 className="text-center font-heading font-bold text-2xl sm:text-3xl text-slate-dark mb-10 tracking-[-0.015em]">
                {loc(page.statsHeadline, locale)}
              </h3>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {page.stats.map((s, i) => (
                <RevealOnScroll key={i} delayMs={i * 80}>
                  <div className="text-center">
                    <p className="font-heading font-bold text-4xl sm:text-5xl text-ocean tracking-[-0.02em]">
                      {loc(s.value, locale)}
                    </p>
                    <p className="mt-2 text-sm text-gray-dark uppercase tracking-[0.14em] font-heading font-semibold">
                      {loc(s.label, locale)}
                    </p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Values */}
      {page?.values && page.values.length > 0 && (
        <section className="section-white py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <SectionEyebrow>{isEs ? "Lo que valoramos" : "What we value"}</SectionEyebrow>
              <h2 className="mt-5 font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-dark leading-tight tracking-[-0.015em]">
                {loc(page.valuesHeadline, locale) || (isEs ? "Lo que nos guía." : "What guides us.")}
              </h2>
              {loc(page.valuesSubheading, locale) && (
                <p className="mt-5 text-slate text-base sm:text-lg leading-relaxed">
                  {loc(page.valuesSubheading, locale)}
                </p>
              )}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {page.values.map((v, i) => (
                <RevealOnScroll key={i} delayMs={i * 80}>
                  <div className="p-8 rounded-2xl border border-sand-dark bg-sand/40 h-full">
                    <p className="text-xs uppercase tracking-[0.18em] text-teal font-heading font-semibold mb-3">
                      {v.icon}
                    </p>
                    <h3 className="font-heading font-bold text-lg text-slate-dark mb-3">
                      {loc(v.title, locale)}
                    </h3>
                    <p className="text-slate leading-relaxed">
                      {loc(v.description, locale)}
                    </p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team */}
      {page?.teamMembers && page.teamMembers.length > 0 && (
        <section className="section-sand py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <SectionEyebrow>{isEs ? "El equipo" : "The team"}</SectionEyebrow>
              <h2 className="mt-5 font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-dark leading-tight tracking-[-0.015em]">
                {loc(page.teamHeadline, locale) || (isEs ? "La gente detrás del viaje." : "The people behind the journey.")}
              </h2>
              {loc(page.teamSubheading, locale) && (
                <p className="mt-5 text-slate text-base sm:text-lg leading-relaxed">
                  {loc(page.teamSubheading, locale)}
                </p>
              )}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {page.teamMembers.map((m, i) => (
                <RevealOnScroll key={i} delayMs={i * 80}>
                  <div className="text-center">
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-5 bg-sand-dark">
                      {m.photo?.url && (
                        <Image
                          src={m.photo.url}
                          alt={m.name}
                          fill
                          sizes="(min-width: 1024px) 33vw, 50vw"
                          placeholder={m.photo.lqip ? "blur" : undefined}
                          blurDataURL={m.photo.lqip}
                          className="object-cover"
                          style={{
                            objectPosition: hotspotToObjectPosition(m.photo.hotspot),
                          }}
                        />
                      )}
                    </div>
                    <p className="font-heading font-bold text-xl text-slate-dark">
                      {m.name}
                    </p>
                    <p className="text-xs uppercase tracking-[0.16em] text-teal font-heading font-semibold mt-1 mb-3">
                      {loc(m.role, locale)}
                    </p>
                    <p className="text-sm text-slate leading-relaxed">
                      {loc(m.bio, locale)}
                    </p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBanner
        headline={loc(page?.ctaHeadline, locale)}
        subheadline={loc(page?.ctaSubheadline, locale)}
        primaryCtaText={loc(page?.ctaButtonText, locale) || (isEs ? "Hablar con conserjería" : "Talk to concierge")}
        primaryCtaHref="/contact"
        whatsappNumber={page?.ctaWhatsappNumber}
        whatsappLabel={loc(page?.ctaContactText, locale)}
      />
    </>
  );
}
