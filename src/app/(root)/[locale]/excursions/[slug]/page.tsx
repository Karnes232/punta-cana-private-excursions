import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getIndividualExcursion,
  getExcursionSlugs,
} from "@/sanity/queries/IndividualExcursions/Excursionqueries";
import {
  getLocalized,
  getLocalizedStringArray,
  getLocalizedPortableText,
  type LocalizedField,
} from "@/sanity/queries/GeneralLayout/generalLayoutQuery";
import { getDefaultSeo } from "@/sanity/queries/SEO/seoProjection";
import { buildMetadata } from "@/lib/seo/buildMetadata";
import { ImageGallery } from "@/components/IndividualExcursionPage/ImageGallery";
import { InfoStat } from "@/components/IndividualExcursionPage/InfoStat";
import { CheckList } from "@/components/IndividualExcursionPage/CheckList";
import { BookingPanel } from "@/components/IndividualExcursionPage/BookingPanel";
import { BlockContent } from "@/components/BlockContent/BlockContent";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { FaqPreview } from "@/components/HomePage/FaqPreview/FaqPreview";
import { FeaturedExcursions } from "@/components/HomePage/FeaturedExcursions/FeaturedExcursions";

export async function generateStaticParams() {
  const slugs = await getExcursionSlugs().catch(() => []);
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const [excursion, defaultSeo] = await Promise.all([
    getIndividualExcursion(slug).catch(() => null),
    getDefaultSeo().catch(() => null),
  ]);
  if (!excursion) return {};
  const lk = locale as keyof LocalizedField;

  return buildMetadata({
    seo: undefined,
    defaults: defaultSeo?.defaultSeo,
    locale: locale as "en" | "es",
    path: `/excursions/${slug}`,
    fallbackTitle: excursion.title?.[lk],
    fallbackDescription: excursion.shortSummary?.[lk],
    fallbackImage: excursion.heroImage?.asset?.url
      ? {
          url: excursion.heroImage.asset.url,
          alt: excursion.heroImage.alt?.[lk],
        }
      : undefined,
  });
}

export default async function ExcursionDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const excursion = await getIndividualExcursion(slug).catch(() => null);
  if (!excursion) notFound();

  const lk = locale as keyof LocalizedField;
  const typedLocale = locale as "en" | "es";
  const isEs = typedLocale === "es";
  const title = excursion.title?.[lk] ?? "";
  const summary = excursion.shortSummary?.[lk] ?? "";
  const badge = excursion.badge?.[lk];
  const category = excursion.category ? getLocalized(excursion.category.title, locale) : "";

  const heroImage = {
    url: excursion.heroImage?.asset?.url ?? "",
    alt: excursion.heroImage?.alt?.[lk] ?? title,
    lqip: excursion.heroImage?.asset?.metadata?.lqip,
    hotspot: excursion.heroImage?.hotspot,
  };
  const thumbnails = (excursion.gallery ?? []).map((g) => ({
    url: g.asset?.url ?? "",
    alt: g.alt?.[lk] ?? title,
    lqip: g.asset?.metadata?.lqip,
    hotspot: g.hotspot,
  }));

  const highlights = getLocalizedStringArray(excursion.highlights, locale);
  const included = getLocalizedStringArray(excursion.whatsIncluded, locale);
  const bring = getLocalizedStringArray(excursion.whatToBring, locale);
  const restrictions = getLocalizedStringArray(excursion.restrictions, locale);
  const description = getLocalizedPortableText(excursion.fullDescription, locale);
  const vipInclusions = getLocalizedPortableText(excursion.vipInclusions, locale);

  return (
    <>
      {/* Title + summary band */}
      <section className="pt-14 pb-2">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          {category && (
            <p className="text-xs uppercase tracking-[0.18em] text-teal font-heading font-semibold mb-3">
              {category}
            </p>
          )}
          <div className="flex flex-wrap items-baseline gap-4">
            <h1 className="font-heading font-bold text-3xl sm:text-5xl lg:text-6xl text-slate-dark tracking-[-0.015em] leading-[1.05] max-w-4xl">
              {title}
            </h1>
            {badge && (
              <span className="px-3 py-1 rounded-full bg-sunset text-white text-xs font-heading font-semibold tracking-wide uppercase">
                {badge}
              </span>
            )}
          </div>
          {summary && (
            <p className="mt-5 text-slate text-lg max-w-3xl leading-relaxed">
              {summary}
            </p>
          )}
        </div>
      </section>

      <ImageGallery hero={heroImage} thumbnails={thumbnails} />

      {/* Content + sticky booking panel */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 grid gap-10 lg:gap-14 lg:grid-cols-[1.7fr_1fr]">
          <div>
            {/* Key info row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 mb-12 p-6 bg-sand rounded-2xl">
              <InfoStat
                label={isEs ? "Duración" : "Duration"}
                value={excursion.duration?.[lk] ?? "—"}
              />
              <InfoStat
                label={isEs ? "Grupo privado" : "Private group"}
                value={
                  excursion.maxGuests
                    ? `${isEs ? "Hasta" : "Up to"} ${excursion.maxGuests}`
                    : excursion.groupSize?.[lk] ?? "—"
                }
              />
              <InfoStat
                label={isEs ? "Recogida" : "Pickup"}
                value={excursion.pickupTime?.[lk] ?? "—"}
              />
              <InfoStat
                label={isEs ? "Nivel" : "Activity"}
                value={excursion.activityLevel ?? "—"}
              />
            </div>

            {/* Highlights */}
            {highlights.length > 0 && (
              <div className="mb-12">
                <SectionEyebrow align="left">
                  {isEs ? "Lo destacado" : "Highlights"}
                </SectionEyebrow>
                <h2 className="mt-4 mb-6 font-heading font-bold text-2xl sm:text-3xl text-slate-dark tracking-[-0.015em]">
                  {isEs ? "Lo que vas a vivir" : "What you'll experience"}
                </h2>
                <CheckList items={highlights} />
              </div>
            )}

            {/* Description */}
            {description.length > 0 && (
              <div className="mb-12">
                <SectionEyebrow align="left">
                  {isEs ? "Detalles" : "About this experience"}
                </SectionEyebrow>
                <BlockContent value={description} className="mt-6" />
              </div>
            )}

            {/* VIP Inclusions — the private-site differentiator */}
            {vipInclusions.length > 0 && (
              <div className="mb-12 p-8 rounded-2xl bg-gradient-to-br from-ocean to-ocean-dark text-white">
                <p className="text-[11px] font-heading font-semibold uppercase tracking-[0.22em] text-sunset mb-3">
                  {isEs ? "Toque VIP" : "VIP Touches"}
                </p>
                <h3 className="font-heading font-bold text-2xl mb-5 tracking-[-0.015em]">
                  {isEs ? "Lo que hace privada esta experiencia" : "What makes this private"}
                </h3>
                <div className="[&_p]:text-white/85 [&_p]:!mb-3 [&_li]:!text-white/90 [&_strong]:!text-white">
                  <BlockContent value={vipInclusions} />
                </div>
              </div>
            )}

            {/* What's included */}
            {included.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-10 mb-12">
                <div>
                  <SectionEyebrow align="left">
                    {isEs ? "Incluido" : "What's included"}
                  </SectionEyebrow>
                  <div className="mt-5">
                    <CheckList items={included} />
                  </div>
                </div>
                {bring.length > 0 && (
                  <div>
                    <SectionEyebrow align="left">
                      {isEs ? "Lleva contigo" : "What to bring"}
                    </SectionEyebrow>
                    <div className="mt-5">
                      <CheckList items={bring} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Restrictions */}
            {restrictions.length > 0 && (
              <div className="mb-12 p-6 rounded-2xl border border-sand-dark bg-sand/50">
                <SectionEyebrow align="left">
                  {isEs ? "Importante" : "Good to know"}
                </SectionEyebrow>
                <div className="mt-5">
                  <CheckList items={restrictions} variant="x" />
                </div>
              </div>
            )}
          </div>

          <BookingPanel
            locale={typedLocale}
            price={excursion.price}
            deposit={excursion.depositAmount}
            priceNote={excursion.priceNote?.[lk]}
            duration={excursion.duration?.[lk]}
            groupSize={excursion.groupSize?.[lk]}
            maxGuests={excursion.maxGuests}
            pickupTime={excursion.pickupTime?.[lk]}
            excursionTitle={title}
            excursionId={excursion._id}
            daysAvailable={excursion.daysAvailable ?? []}
            timeSlots={excursion.timeSlots ?? []}
            bookingNoticeHours={excursion.bookingNoticeHours ?? 24}
            childPrice={excursion.childPrice}
            childAgeRange={excursion.childAgeRange?.[lk]}
          />
        </div>
      </section>

      {/* FAQ */}
      {excursion.faq && excursion.faq.length > 0 && (
        <FaqPreview
          eyebrow={isEs ? "Preguntas" : "Questions"}
          heading={isEs ? "Lo que suelen preguntar." : "Common questions."}
          faqs={excursion.faq.map((f) => ({
            question: f.question?.[lk] ?? "",
            answer: f.answer?.[lk] ?? "",
          }))}
        />
      )}

      {/* Related */}
      {excursion.relatedExcursions && excursion.relatedExcursions.length > 0 && (
        <FeaturedExcursions
          eyebrow={isEs ? "Más experiencias" : "More experiences"}
          heading={isEs ? "También podrían interesarte." : "You may also like."}
          excursions={excursion.relatedExcursions.map((r) => ({
            slug: r.slug.current,
            title: getLocalized(r.title, locale),
            summary: getLocalized(r.shortSummary, locale),
            image: {
              url: r.heroImage?.asset?.url ?? "",
              alt: getLocalized(r.heroImage?.alt, locale),
              lqip: r.heroImage?.asset?.metadata?.lqip,
              hotspot: r.heroImage?.hotspot,
            },
            price: r.price,
            duration: getLocalized(r.duration, locale),
            category: r.category ? getLocalized(r.category.title, locale) : undefined,
            badge: r.badge ? getLocalized(r.badge, locale) : undefined,
          }))}
        />
      )}
    </>
  );
}
