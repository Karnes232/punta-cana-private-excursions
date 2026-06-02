import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getBlogArticle,
  getBlogArticleSlugsByLanguage,
  getBlogArticleTranslations,
} from "@/sanity/queries/Blog/Blog";
import { SetLocaleAlternates } from "@/components/Layout/LocaleSwitchContext";
import { getDefaultSeo } from "@/sanity/queries/SEO/seoProjection";
import { buildSingleLanguageMetadata } from "@/lib/seo/buildMetadata";
import { BlockContent } from "@/components/BlockContent/BlockContent";
import { Link } from "@/i18n/navigation";
import { hotspotToObjectPosition } from "@/sanity/lib/hotspot";

export async function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  const slugs = await getBlogArticleSlugsByLanguage(params.locale).catch(
    () => [],
  );
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const [article, defaultSeo] = await Promise.all([
    getBlogArticle(slug).catch(() => null),
    getDefaultSeo().catch(() => null),
  ]);
  if (!article) return {};

  return buildSingleLanguageMetadata({
    seo: {
      metaTitle: article.seoTitle ?? article.title,
      metaDescription: article.seoDescription ?? article.excerpt,
      keywords: undefined,
      ogTitle: article.title,
      ogDescription: article.excerpt,
      ogImage: article.ogImage ?? (article.featuredImage as any),
      twitterCard: "summary_large_image",
      noIndex: false,
      noFollow: false,
      structuredData: undefined,
    },
    defaults: defaultSeo?.defaultSeo,
    locale: locale as "en" | "es",
    href: { pathname: "/blog/[slug]", params: { slug } },
    fallbackTitle: article.title,
    fallbackDescription: article.excerpt,
  });
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = await getBlogArticle(slug).catch(() => null);
  if (!article) notFound();

  // Build per-locale slugs for the language switcher from the translation group.
  // Falls back to the current slug when a translation is missing (renders the
  // original-language article rather than 404ing).
  const translations = article.translationGroup
    ? await getBlogArticleTranslations(article.translationGroup, slug).catch(
        () => [],
      )
    : [];
  const slugByLang: Record<string, string> = { [article.language]: article.slug };
  for (const tr of translations) slugByLang[tr.language] = tr.slug;
  const blogSlugs = {
    en: slugByLang.en ?? article.slug,
    es: slugByLang.es ?? article.slug,
  };

  const isEs = locale === "es";
  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString(
        isEs ? "es-ES" : "en-US",
        { year: "numeric", month: "long", day: "numeric" },
      )
    : "";
  const categoryLabel = article.category
    ? article.category.title?.[locale as "en" | "es"] ??
      article.category.title?.en
    : "";

  return (
    <article>
      <SetLocaleAlternates pathname="/blog/[slug]" slugs={blogSlugs} />
      <header className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-12 pt-16 pb-10 text-center">
        {categoryLabel && (
          <p className="text-xs uppercase tracking-[0.18em] text-teal font-heading font-semibold mb-4">
            {categoryLabel}
          </p>
        )}
        <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-slate-dark leading-[1.1] tracking-[-0.015em]">
          {article.title}
        </h1>
        {article.excerpt && (
          <p className="mt-5 text-slate text-lg leading-relaxed">
            {article.excerpt}
          </p>
        )}
        <p className="mt-6 text-xs text-gray-dark uppercase tracking-wider">
          {date}
          {article.readingTime ? ` · ${article.readingTime} ${isEs ? "min de lectura" : "min read"}` : ""}
        </p>
      </header>

      {article.featuredImage?.asset?.url && (
        <div className="relative aspect-[16/9] max-w-5xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-card">
            <Image
              src={article.featuredImage.asset.url}
              alt={article.featuredImage.alt ?? article.title}
              fill
              priority
              sizes="(min-width: 1024px) 60vw, 100vw"
              placeholder={article.featuredImage.asset.metadata?.lqip ? "blur" : undefined}
              blurDataURL={article.featuredImage.asset.metadata?.lqip}
              className="object-cover"
              style={{ objectPosition: hotspotToObjectPosition(article.featuredImage.hotspot) }}
            />
          </div>
        </div>
      )}

      <section className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-12 py-16">
        <BlockContent value={article.body} />
      </section>

      <section className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-12 pb-20 text-center">
        <Link href="/blog" className="btn-secondary">
          {isEs ? "← Volver al Journal" : "← Back to Journal"}
        </Link>
      </section>
    </article>
  );
}
