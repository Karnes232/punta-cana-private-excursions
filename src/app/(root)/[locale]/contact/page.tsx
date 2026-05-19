import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ContactForm } from "@/components/ContactPage/ContactForm";
import {
  getContactPage,
  getContactPageSeo,
} from "@/sanity/queries/ContactPage/ContactPage";
import { getGeneralLayout } from "@/sanity/queries/GeneralLayout/generalLayoutQuery";
import { getDefaultSeo } from "@/sanity/queries/SEO/seoProjection";
import { buildMetadata } from "@/lib/seo/buildMetadata";
import {
  getLocalized,
  type LocalizedField,
} from "@/sanity/queries/GeneralLayout/generalLayoutQuery";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [pageSeo, defaultSeo, page] = await Promise.all([
    getContactPageSeo().catch(() => null),
    getDefaultSeo().catch(() => null),
    getContactPage().catch(() => null),
  ]);
  const lk = locale as keyof LocalizedField;

  return buildMetadata({
    seo: pageSeo?.seo,
    defaults: defaultSeo?.defaultSeo,
    locale: locale as "en" | "es",
    path: "/contact",
    fallbackTitle: page?.heroHeadline?.[lk] ?? "Concierge",
    fallbackDescription: page?.heroSubheadline?.[lk],
  });
}

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ excursion?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const [page, layout] = await Promise.all([
    getContactPage().catch(() => null),
    getGeneralLayout().catch(() => null),
  ]);
  const lk = locale as keyof LocalizedField;
  const typedLocale = locale as "en" | "es";
  const isEs = typedLocale === "es";

  return (
    <>
      <PageHero
        eyebrow={isEs ? "Conserjería privada" : "Private concierge"}
        headline={
          page?.heroHeadline?.[lk] ??
          (isEs
            ? "Diseñemos tu día juntos."
            : "Let's design your day together.")
        }
        subheadline={page?.heroSubheadline?.[lk]}
        image={
          page?.heroImage?.asset?.url
            ? {
                url: page.heroImage.asset.url,
                lqip: page.heroImage.asset.metadata?.lqip,
                hotspot: page.heroImage.hotspot,
              }
            : null
        }
        size="compact"
      />

      <section className="section-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 grid lg:grid-cols-[1.4fr_1fr] gap-12">
          <div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-slate-dark mb-8 tracking-[-0.015em]">
              {page?.formHeadline?.[lk] ?? (isEs ? "Cuéntanos sobre tu viaje" : "Tell us about your trip")}
            </h2>
            <ContactForm locale={typedLocale} defaultExcursion={sp.excursion} />
          </div>

          <aside className="lg:pl-8 lg:border-l border-sand-dark">
            <h3 className="font-heading font-bold text-xl text-slate-dark mb-6 tracking-[-0.015em]">
              {page?.infoHeadline?.[lk] ?? (isEs ? "Otras formas de contactarnos" : "Other ways to reach us")}
            </h3>
            <dl className="space-y-6 text-sm">
              {layout?.email && (
                <div>
                  <dt className="text-xs uppercase tracking-[0.16em] text-gray-dark font-heading font-semibold mb-1">
                    {isEs ? "Correo" : "Email"}
                  </dt>
                  <dd>
                    <a href={`mailto:${layout.email}`} className="text-ocean hover:underline">
                      {layout.email}
                    </a>
                  </dd>
                </div>
              )}
              {layout?.phone && (
                <div>
                  <dt className="text-xs uppercase tracking-[0.16em] text-gray-dark font-heading font-semibold mb-1">
                    WhatsApp
                  </dt>
                  <dd>
                    <a
                      href={`https://wa.me/${layout.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ocean hover:underline"
                    >
                      {layout.phone}
                    </a>
                  </dd>
                </div>
              )}
              {layout?.serviceArea && (
                <div>
                  <dt className="text-xs uppercase tracking-[0.16em] text-gray-dark font-heading font-semibold mb-1">
                    {isEs ? "Zona de servicio" : "Service area"}
                  </dt>
                  <dd className="text-slate">{getLocalized(layout.serviceArea, locale)}</dd>
                </div>
              )}
              {layout?.responseTime && (
                <div>
                  <dt className="text-xs uppercase tracking-[0.16em] text-gray-dark font-heading font-semibold mb-1">
                    {isEs ? "Respuesta" : "Response time"}
                  </dt>
                  <dd className="text-slate">{getLocalized(layout.responseTime, locale)}</dd>
                </div>
              )}
            </dl>
          </aside>
        </div>
      </section>
    </>
  );
}
