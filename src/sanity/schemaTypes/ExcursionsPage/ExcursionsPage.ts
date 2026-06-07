import { defineType, defineField } from "sanity";
import { SearchIcon } from "@sanity/icons";

export const excursionsPage = defineType({
  name: "excursionsPage",
  title: "Excursions Page",
  type: "document",
  icon: SearchIcon,
  // Singleton — enforced via desk structure (structure.ts)

  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "intro", title: "Intro Section" },
    { name: "outro", title: "Outro Section" },
    { name: "cta", title: "CTA" },
    { name: "seo", title: "SEO" },
  ],

  fields: [
    // =========================================================================
    // HERO SECTION
    // =========================================================================

    defineField({
      name: "heroImage",
      title: "Hero Background Image",
      type: "image",
      description:
        "Full-width background image for the browse page hero. Landscape orientation, min 1920×800px. An underwater scene, catamaran, or aerial beach shot works well.",
      options: { hotspot: true },
      group: "hero",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "heroEyebrow",
      title: "Hero Eyebrow / Kicker",
      type: "localizedString",
      description:
        'Small uppercase label above the headline. e.g. "Private catalog"',
      group: "hero",
    }),

    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "localizedString",
      description:
        'Main heading displayed over the hero image. Keep it short and action-oriented. e.g. "Explore Our Excursions" or "Find Your Perfect Adventure".',
      group: "hero",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "heroSubheadline",
      title: "Hero Subheadline",
      type: "localizedText",
      description:
        'Supporting text below the headline. 1–2 sentences. e.g. "Discover top-rated tours, island adventures, and unforgettable experiences — all with local support and easy booking."',
      group: "hero",
    }),

    // =========================================================================
    // INTRO SECTION
    // =========================================================================

    defineField({
      name: "introEyebrow",
      title: "Intro Eyebrow / Kicker",
      type: "localizedString",
      description:
        'Small uppercase kicker above the heading. e.g. "Hand-curated"',
      group: "intro",
    }),

    defineField({
      name: "introHeadline",
      title: "Intro Headline",
      type: "localizedString",
      description: 'e.g. "Every excursion, vetted by us first."',
      group: "intro",
    }),

    defineField({
      name: "introBody",
      title: "Intro Body",
      type: "localizedBlockContent",
      description: "Rich text introducing the private catalog.",
      group: "intro",
    }),

    defineField({
      name: "introImage",
      title: "Intro Image",
      type: "image",
      description: "Supporting image shown beside the intro text.",
      options: { hotspot: true, metadata: ["lqip"] },
      group: "intro",
    }),

    // =========================================================================
    // OUTRO SECTION — text block between the grid and the CTA
    // =========================================================================

    defineField({
      name: "outroHeading",
      title: "Outro Heading",
      type: "localizedString",
      description: "Heading for the text section below the excursion grid.",
      group: "outro",
    }),

    defineField({
      name: "outroBody",
      title: "Outro Body",
      type: "localizedBlockContent",
      description: "Rich text shown below the heading.",
      group: "outro",
    }),

    // =========================================================================
    // CTA
    // =========================================================================

    defineField({
      name: "ctaEyebrow",
      title: "CTA Eyebrow / Kicker",
      type: "localizedString",
      description:
        'Small uppercase label above the headline. e.g. "Ready when you are"',
      group: "cta",
    }),

    defineField({
      name: "ctaHeadline",
      title: "CTA Headline",
      type: "localizedString",
      description:
        'Headline for the CTA banner below the excursion grid. e.g. "Need help choosing?"',
      group: "cta",
    }),

    defineField({
      name: "ctaSubheadline",
      title: "CTA Subheadline",
      type: "localizedText",
      description:
        'Supporting text below the headline. e.g. "Our local team is here to help you find the perfect excursion."',
      group: "cta",
    }),

    defineField({
      name: "ctaButtonText",
      title: "Button Text",
      type: "localizedString",
      description: 'e.g. "Talk to concierge" / "Hablar con conserjería"',
      group: "cta",
    }),

    defineField({
      name: "ctaButtonHref",
      title: "Button Link",
      type: "string",
      description:
        'Internal path (e.g. "/contact") or full URL (e.g. "https://wa.me/18091234567")',
      group: "cta",
      initialValue: "/contact",
    }),

    // =========================================================================
    // SEO
    // =========================================================================

    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],

  preview: {
    select: {
      title: "heroHeadline.en",
      media: "heroImage",
    },
    prepare({ title, media }) {
      return {
        title: title || "Excursions Page",
        subtitle: "Browse page content",
        media,
      };
    },
  },
});
