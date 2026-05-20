import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getIndividualDivingExcursion,
  getDivingExcursionSlugs,
} from "@/sanity/queries/DivingSnorkelingPage/IndividualDivingExcursion";
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

export async function generateStaticParams() {
  const slugs = await getDivingExcursionSlugs().catch(() => []);
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const [exc, defaultSeo] = await Promise.all([
    getIndividualDivingExcursion(slug).catch(() => null),
    getDefaultSeo().catch(() => null),
  ]);
  if (!exc) return {};
  const lk = locale as keyof LocalizedField;

  return buildMetadata({
    seo: undefined,
    defaults: defaultSeo?.defaultSeo,
    locale: locale as "en" | "es",
    path: `/scuba-diving/${slug}`,
    fallbackTitle: exc.title?.[lk],
    fallbackDescription: exc.shortSummary?.[lk],
    fallbackImage: exc.heroImage?.asset?.url
      ? { url: exc.heroImage.asset.url, alt: exc.heroImage.alt?.[lk] }
      : undefined,
  });
}

export default async function DivingDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const exc = await getIndividualDivingExcursion(slug).catch(() => null);
  if (!exc) notFound();

  const lk = locale as keyof LocalizedField;
  const typedLocale = locale as "en" | "es";
  const isEs = typedLocale === "es";

  const title = exc.title?.[lk] ?? "";
  const summary = exc.shortSummary?.[lk] ?? "";
  const heroImage = {
    url: exc.heroImage?.asset?.url ?? "",
    alt: exc.heroImage?.alt?.[lk] ?? title,
    lqip: exc.heroImage?.asset?.metadata?.lqip,
    hotspot: exc.heroImage?.hotspot,
  };
  const thumbnails = (exc.gallery ?? []).map((g) => ({
    url: g.asset?.url ?? "",
    alt: g.alt?.[lk] ?? title,
    lqip: g.asset?.metadata?.lqip,
    hotspot: g.hotspot,
  }));

  const highlights = getLocalizedStringArray(exc.highlights, locale);
  const included = getLocalizedStringArray(exc.whatsIncluded, locale);
  const bring = getLocalizedStringArray(exc.whatToBring, locale);
  const restrictions = getLocalizedStringArray(exc.restrictions, locale);
  const marineLife = getLocalizedStringArray(exc.marineLife, locale);
  const equipment = getLocalizedStringArray(exc.equipmentProvided, locale);
  const description = getLocalizedPortableText(exc.fullDescription, locale);
  const vipInclusions = getLocalizedPortableText(exc.vipInclusions, locale);

  return (
    <>
      <section className="pt-14 pb-2">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <p className="text-xs uppercase tracking-[0.18em] text-teal font-heading font-semibold mb-3">
            {isEs ? "Charter privado · Buceo" : "Private charter · Diving"}
          </p>
          <h1 className="font-heading font-bold text-3xl sm:text-5xl lg:text-6xl text-slate-dark tracking-[-0.015em] leading-[1.05] max-w-4xl">
            {title}
          </h1>
          {summary && (
            <p className="mt-5 text-slate text-lg max-w-3xl leading-relaxed">
              {summary}
            </p>
          )}
        </div>
      </section>

      <ImageGallery hero={heroImage} thumbnails={thumbnails} />

      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 grid gap-10 lg:gap-14 lg:grid-cols-[1.7fr_1fr]">
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 mb-12 p-6 bg-sand rounded-2xl">
              <InfoStat label={isEs ? "Duración" : "Duration"} value={exc.duration?.[lk] ?? "—"} />
              <InfoStat label={isEs ? "Nivel" : "Level"} value={exc.experienceLevel ?? "—"} />
              <InfoStat
                label={isEs ? "Profundidad" : "Max depth"}
                value={exc.maxDepth?.[lk] ?? "—"}
              />
              <InfoStat
                label={isEs ? "Inmersiones" : "Dives"}
                value={exc.numberOfDives ? String(exc.numberOfDives) : "—"}
              />
            </div>

            {highlights.length > 0 && (
              <div className="mb-12">
                <SectionEyebrow align="left">
                  {isEs ? "Lo destacado" : "Highlights"}
                </SectionEyebrow>
                <div className="mt-6">
                  <CheckList items={highlights} />
                </div>
              </div>
            )}

            {description.length > 0 && (
              <div className="mb-12">
                <SectionEyebrow align="left">
                  {isEs ? "Sobre el dive" : "About this dive"}
                </SectionEyebrow>
                <BlockContent value={description} className="mt-6" />
              </div>
            )}

            {vipInclusions.length > 0 && (
              <div className="mb-12 p-8 rounded-2xl bg-gradient-to-br from-ocean to-ocean-dark text-white">
                <p className="text-[11px] font-heading font-semibold uppercase tracking-[0.22em] text-sunset mb-3">
                  {isEs ? "Toque VIP" : "VIP Touches"}
                </p>
                <h3 className="font-heading font-bold text-2xl mb-5 tracking-[-0.015em]">
                  {isEs ? "Lo que hace privado este charter" : "What makes this charter private"}
                </h3>
                <div className="[&_p]:text-white/85 [&_p]:!mb-3 [&_li]:!text-white/90 [&_strong]:!text-white">
                  <BlockContent value={vipInclusions} />
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-10 mb-12">
              {marineLife.length > 0 && (
                <div>
                  <SectionEyebrow align="left">
                    {isEs ? "Vida marina" : "Marine life"}
                  </SectionEyebrow>
                  <div className="mt-5">
                    <CheckList items={marineLife} />
                  </div>
                </div>
              )}
              {equipment.length > 0 && (
                <div>
                  <SectionEyebrow align="left">
                    {isEs ? "Equipo" : "Equipment provided"}
                  </SectionEyebrow>
                  <div className="mt-5">
                    <CheckList items={equipment} />
                  </div>
                </div>
              )}
            </div>

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
            price={exc.price}
            deposit={exc.depositAmount}
            priceNote={exc.priceNote?.[lk]}
            duration={exc.duration?.[lk]}
            groupSize={exc.groupSize?.[lk]}
            maxGuests={exc.maxGuests}
            pickupTime={exc.pickupTime?.[lk]}
            excursionTitle={title}
            excursionId={exc._id}
            daysAvailable={[]}
            timeSlots={[]}
            bookingNoticeHours={24}
          />
        </div>
      </section>

      {exc.faq && exc.faq.length > 0 && (
        <FaqPreview
          eyebrow={isEs ? "Preguntas" : "Questions"}
          heading={isEs ? "Antes de bucear." : "Before you dive."}
          faqs={exc.faq.map((f) => ({
            question: f.question?.[lk] ?? "",
            answer: f.answer?.[lk] ?? "",
          }))}
        />
      )}
    </>
  );
}
