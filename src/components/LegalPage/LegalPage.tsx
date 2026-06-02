import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlockContent } from "@/components/BlockContent/BlockContent";
import {
  getLegalDocumentSeo,
} from "@/sanity/queries/LegalPages/LegalDocument";
import { getDefaultSeo } from "@/sanity/queries/SEO/seoProjection";
import { buildMetadata } from "@/lib/seo/buildMetadata";
import type { AppHref } from "@/i18n/navigation";
import {
  getLocalized,
  getLocalizedPortableText,
} from "@/sanity/queries/GeneralLayout/generalLayoutQuery";
import type { LegalPageData } from "@/sanity/queries/LegalPages/LegalDocument";

interface RenderArgs {
  locale: string;
  documentId: string;
  fetcher: () => Promise<LegalPageData | null>;
  fallbackTitle: { en: string; es: string };
}

export async function renderLegalMetadata(args: {
  locale: string;
  documentId: string;
  fallbackTitle: { en: string; es: string };
  href: AppHref;
}): Promise<Metadata> {
  const [pageSeo, defaultSeo] = await Promise.all([
    getLegalDocumentSeo(args.documentId).catch(() => null),
    getDefaultSeo().catch(() => null),
  ]);
  const title =
    args.locale === "es" ? args.fallbackTitle.es : args.fallbackTitle.en;
  return buildMetadata({
    seo: pageSeo?.seo,
    defaults: defaultSeo?.defaultSeo,
    locale: args.locale as "en" | "es",
    href: args.href,
    fallbackTitle: title,
  });
}

export async function LegalPage({
  locale,
  documentId,
  fetcher,
  fallbackTitle,
}: RenderArgs) {
  const data = await fetcher().catch(() => null);
  const isEs = locale === "es";

  // Show a tasteful placeholder if no Sanity content yet rather than 404.
  const title = data
    ? getLocalized(data.title, locale)
    : isEs
      ? fallbackTitle.es
      : fallbackTitle.en;

  const body = data ? getLocalizedPortableText(data.body, locale) : [];

  if (!data && !title) notFound();

  return (
    <article className="py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-12">
        <p className="text-xs uppercase tracking-[0.22em] text-sunset font-heading font-semibold mb-4">
          {isEs ? "Documento legal" : "Legal document"}
        </p>
        <h1 className="font-heading font-bold text-4xl sm:text-5xl text-slate-dark leading-tight tracking-[-0.015em]">
          {title}
        </h1>
        {data?.lastUpdated && (
          <p className="mt-3 text-sm text-gray-dark italic">
            {isEs ? "Última actualización" : "Last updated"}:{" "}
            {new Date(data.lastUpdated).toLocaleDateString(
              isEs ? "es-ES" : "en-US",
              { year: "numeric", month: "long", day: "numeric" },
            )}
          </p>
        )}

        <div className="mt-12">
          {body.length > 0 ? (
            <BlockContent value={body} />
          ) : (
            <p className="text-gray italic">
              {isEs
                ? "Este documento se publicará pronto en el Studio de Sanity."
                : "This document will be published shortly via Sanity Studio."}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
