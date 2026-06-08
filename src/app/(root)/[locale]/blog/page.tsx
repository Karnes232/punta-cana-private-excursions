import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { CtaBanner } from "@/components/HomePage/CtaBanner/CtaBanner";
import { BlogFilterBar } from "@/components/BlogPage/BlogFilterBar";
import {
  getBlogPage,
  getBlogArticles,
  getBlogCategories,
  getBlogLanguages,
  getBlogPageSeo,
} from "@/sanity/queries/Blog/Blog";
import { getDefaultSeo } from "@/sanity/queries/SEO/seoProjection";
import { buildMetadata } from "@/lib/seo/buildMetadata";
import type { LocalizedField } from "@/sanity/queries/GeneralLayout/generalLayoutQuery";
import { hotspotToObjectPosition } from "@/sanity/lib/hotspot";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [pageSeo, defaultSeo, page] = await Promise.all([
    getBlogPageSeo().catch(() => null),
    getDefaultSeo().catch(() => null),
    getBlogPage().catch(() => null),
  ]);
  const lk = locale as keyof LocalizedField;

  return buildMetadata({
    seo: pageSeo?.seo,
    defaults: defaultSeo?.defaultSeo,
    locale: locale as "en" | "es",
    href: "/blog",
    fallbackTitle: page?.heroHeadline?.[lk] ?? "Journal",
    fallbackDescription: page?.heroSubheadline?.[lk],
  });
}

export default async function BlogIndex({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ lang?: string; category?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const lk = locale as keyof LocalizedField;
  const isEs = locale === "es";

  const [page, languages, allCategories] = await Promise.all([
    getBlogPage().catch(() => null),
    getBlogLanguages().catch(() => [] as string[]),
    getBlogCategories().catch(() => []),
  ]);

  // Which language's posts to show: ?lang if valid, else the site locale,
  // else the first available language.
  const activeLang =
    sp.lang && languages.includes(sp.lang)
      ? sp.lang
      : languages.includes(locale)
        ? locale
        : (languages[0] ?? locale);

  const articles = await getBlogArticles(activeLang).catch(() => []);

  // Category tabs — only categories with posts in the active language.
  const categoryTabs = allCategories
    .map((cat) => ({
      slug: cat.slug,
      title: cat.title?.[lk] ?? cat.title?.en ?? "",
      count: articles.filter((a) => a.category?.slug === cat.slug).length,
    }))
    .filter((cat) => cat.count > 0);

  const activeCategory = categoryTabs.some((c) => c.slug === sp.category)
    ? (sp.category as string)
    : null;
  const visibleArticles = activeCategory
    ? articles.filter((a) => a.category?.slug === activeCategory)
    : articles;

  return (
    <>
      <PageHero
        eyebrow={page?.heroEyebrow?.[lk] || (isEs ? "Revista" : "Journal")}
        headline={
          page?.heroHeadline?.[lk] ??
          (isEs
            ? "Historias, guías y consejos de Punta Cana."
            : "Stories, guides, and tips from Punta Cana.")
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
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          {articles.length > 0 && (
            <BlogFilterBar
              categories={categoryTabs}
              activeCategory={activeCategory}
              totalCount={articles.length}
              allLabel={isEs ? "Todas" : "All"}
              languages={languages}
              activeLang={activeLang}
            />
          )}
          {visibleArticles.length === 0 ? (
            <p className="text-center text-gray italic">
              {isEs ? "Próximos artículos en camino." : "Articles coming soon."}
            </p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {visibleArticles.map((a, i) => {
                const date = a.publishedAt
                  ? new Date(a.publishedAt).toLocaleDateString(
                      locale === "es" ? "es-ES" : "en-US",
                      { year: "numeric", month: "long", day: "numeric" },
                    )
                  : "";
                return (
                  <RevealOnScroll key={a._id} delayMs={(i % 3) * 80}>
                    <Link
                      href={{ pathname: "/blog/[slug]", params: { slug: a.slug } }}
                      className="group block card-excursion h-full"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        {a.featuredImage?.asset?.url ? (
                          <Image
                            src={a.featuredImage.asset.url}
                            alt={a.featuredImage.alt ?? a.title}
                            fill
                            sizes="(min-width: 1024px) 33vw, 50vw"
                            placeholder={
                              a.featuredImage.asset.metadata?.lqip ? "blur" : undefined
                            }
                            blurDataURL={a.featuredImage.asset.metadata?.lqip}
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            style={{
                              objectPosition: hotspotToObjectPosition(a.featuredImage.hotspot),
                            }}
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-teal to-ocean" />
                        )}
                      </div>
                      <div className="p-6">
                        {a.category && (
                          <p className="text-xs uppercase tracking-[0.16em] text-teal font-heading font-semibold mb-2">
                            {a.category.title?.[lk] ?? a.category.title?.en}
                          </p>
                        )}
                        <h3 className="font-heading font-bold text-xl text-slate-dark leading-tight mb-2 group-hover:text-ocean transition-colors">
                          {a.title}
                        </h3>
                        {a.excerpt && (
                          <p className="text-slate text-sm leading-relaxed mb-4 line-clamp-3">
                            {a.excerpt}
                          </p>
                        )}
                        <p className="text-xs text-gray-dark uppercase tracking-wider">
                          {date}{a.readingTime ? ` · ${a.readingTime} ${isEs ? "min de lectura" : "min read"}` : ""}
                        </p>
                      </div>
                    </Link>
                  </RevealOnScroll>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <CtaBanner
        eyebrow={page?.ctaEyebrow?.[lk] || undefined}
        headline={
          page?.ctaHeadline?.[lk] ??
          (isEs
            ? "¿Listo para vivirlo en persona?"
            : "Done reading? Let's plan the real thing.")
        }
        subheadline={page?.ctaSubheadline?.[lk]}
        primaryCtaText={
          page?.ctaButtonText?.[lk] ??
          (isEs ? "Hablar con conserjería" : "Talk to concierge")
        }
        primaryCtaHref={page?.ctaButtonHref ?? "/contact"}
        secondaryCtaText={page?.ctaSecondaryButtonText?.[lk]}
        secondaryCtaHref={page?.ctaSecondaryButtonHref}
      />
    </>
  );
}
