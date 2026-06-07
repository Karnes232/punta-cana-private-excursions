import { defineType, defineField } from "sanity";
import { DropIcon } from "@sanity/icons";

/* ---------------------------------------------------------------------------
   divingSnorkelingPage — Singleton page schema
   
   CMS fields for the Diving & Snorkeling page hero + page-level content.
   Excursion cards are pulled dynamically via GROQ (filtering by category),
   so they're not stored on this document.
   --------------------------------------------------------------------------- */

export const divingSnorkelingPage = defineType({
  name: "divingSnorkelingPage",
  title: "Scuba Diving Page",
  type: "document",
  icon: DropIcon,

  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "intro", title: "Intro Section" },
    { name: "excursionSections", title: "Excursion Sections" },
    { name: "trust", title: "Why Book With Us" },
    { name: "faq", title: "FAQ" },
    { name: "cta", title: "CTA Section" },
    { name: "seo", title: "SEO" },
  ],

  fields: [
    // =========================================================================
    // HERO
    // =========================================================================

    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      description:
        "Full-width underwater/diving hero image. Recommended: 1920×1080 or larger.",
      options: {
        hotspot: true,
        metadata: ["lqip", "palette"],
      },
      group: "hero",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "heroBadge",
      title: "Hero Badge",
      type: "localizedString",
      description:
        'Small credibility badge above the headline, e.g. "Grand Bay Diving Expertise"',
      group: "hero",
    }),

    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "localizedString",
      description:
        'Main heading, e.g. "Dive Into the Caribbean\'s Best Underwater Experiences"',
      group: "hero",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "heroSubheadline",
      title: "Hero Subheadline",
      type: "localizedString",
      description:
        "Supporting text under the headline. 1-2 sentences about diving/snorkeling expertise.",
      group: "hero",
    }),

    defineField({
      name: "heroPrimaryCTA",
      title: "Primary CTA",
      type: "object",
      group: "hero",
      fields: [
        defineField({
          name: "text",
          title: "Button Text",
          type: "localizedString",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "href",
          title: "Link",
          type: "string",
          description: 'URL or anchor, e.g. "/scuba-diving"',
          validation: (rule) => rule.required(),
        }),
      ],
    }),

    defineField({
      name: "heroSecondaryCTA",
      title: "Secondary CTA",
      type: "object",
      group: "hero",
      fields: [
        defineField({
          name: "text",
          title: "Button Text",
          type: "localizedString",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "href",
          title: "Link",
          type: "string",
          description:
            'URL or anchor, e.g. "/scuba-diving" or "/contact"',
          validation: (rule) => rule.required(),
        }),
      ],
    }),

    // =========================================================================
    // INTRO SECTION
    // =========================================================================

    defineField({
      name: "introTagline",
      title: "Intro Tagline",
      type: "localizedString",
      description:
        'Small uppercase kicker above the heading, e.g. "Our Diving Heritage"',
      group: "intro",
    }),

    defineField({
      name: "introHeadline",
      title: "Intro Headline",
      type: "localizedString",
      description:
        'Heading for the diving expertise intro, e.g. "Punta Cana\'s Trusted Dive Team"',
      group: "intro",
    }),

    defineField({
      name: "introBody",
      title: "Intro Body",
      type: "localizedBlockContent",
      description:
        "Rich text introducing Grand Bay's diving expertise and experience.",
      group: "intro",
    }),

    defineField({
      name: "introImage",
      title: "Intro Image",
      type: "image",
      description:
        "Supporting image for the intro section (team photo, underwater shot, etc.)",
      options: { hotspot: true, metadata: ["lqip"] },
      group: "intro",
    }),

    defineField({
      name: "introStats",
      title: "Intro Stats",
      type: "array",
      description:
        "3-4 credential stats shown below the intro text (e.g. years of experience, dives completed).",
      group: "intro",
      of: [
        {
          type: "object",
          name: "introStat",
          title: "Stat",
          fields: [
            defineField({
              name: "value",
              title: "Value",
              type: "localizedString",
              description: 'The number or value, e.g. "10+", "5,000+", "PADI"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "localizedString",
              description:
                'What the value represents, e.g. "Years Experience", "Dives Completed"',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "value.en", subtitle: "label.en" },
          },
        },
      ],
      validation: (rule) => rule.max(4),
    }),

    // =========================================================================
    // EXCURSION SECTIONS — Headings for Courses + Certified Divers lists
    // =========================================================================

    defineField({
      name: "excursionsEyebrow",
      title: "Excursions Eyebrow / Kicker",
      type: "localizedString",
      description:
        'Small uppercase label above the main excursions heading. e.g. "Our charters"',
      group: "excursionSections",
    }),

    defineField({
      name: "excursionsHeading",
      title: "Excursions Main Heading",
      type: "localizedString",
      description:
        'Main heading shown above both the Courses and Certified Divers groups. e.g. "Choose your underwater day"',
      group: "excursionSections",
    }),

    defineField({
      name: "coursesHeading",
      title: "Courses Section Heading",
      type: "localizedString",
      description:
        'Heading for the courses/certification section, e.g. "Diving Courses & Certifications"',
      group: "excursionSections",
    }),

    defineField({
      name: "coursesSubheading",
      title: "Courses Section Subheading",
      type: "localizedText",
      description: "Optional supporting copy under the courses heading.",
      group: "excursionSections",
    }),

    defineField({
      name: "certifiedHeading",
      title: "Certified Divers Section Heading",
      type: "localizedString",
      description:
        'Heading for the certified-divers section, e.g. "Excursions for Certified Divers"',
      group: "excursionSections",
    }),

    defineField({
      name: "certifiedSubheading",
      title: "Certified Divers Section Subheading",
      type: "localizedText",
      description: "Optional supporting copy under the certified-divers heading.",
      group: "excursionSections",
    }),

    // =========================================================================
    // TRUST BLOCK — "Why Book Water Activities With Us"
    // =========================================================================

    defineField({
      name: "trustEyebrow",
      title: "Trust Section Eyebrow / Kicker",
      type: "localizedString",
      description: 'Small uppercase label above the heading. e.g. "Why us"',
      group: "trust",
    }),

    defineField({
      name: "trustHeadline",
      title: "Trust Section Heading",
      type: "localizedString",
      description: 'e.g. "Why Book Your Water Adventures With Grand Bay"',
      group: "trust",
    }),

    defineField({
      name: "trustCards",
      title: "Trust Cards",
      type: "array",
      description: "Four cards, each with a title and text.",
      group: "trust",
      of: [
        {
          type: "object",
          name: "trustCard",
          title: "Card",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "localizedString",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "text",
              title: "Text",
              type: "localizedText",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "title.en", subtitle: "text.en" },
          },
        },
      ],
      validation: (rule) => rule.max(4),
    }),

    // =========================================================================
    // FAQ
    // =========================================================================

    defineField({
      name: "faqEyebrow",
      title: "FAQ Eyebrow / Kicker",
      type: "localizedString",
      description:
        'Small uppercase label above the heading. e.g. "Frequently asked"',
      group: "faq",
    }),

    defineField({
      name: "faqHeading",
      title: "FAQ Heading",
      type: "localizedString",
      description: 'e.g. "Diving questions, answered."',
      group: "faq",
    }),

    defineField({
      name: "faqItems",
      title: "FAQ Items",
      type: "array",
      description: "Diving-specific questions shown as an accordion.",
      group: "faq",
      of: [
        {
          type: "object",
          name: "faqItem",
          title: "FAQ Item",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "localizedString",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: "localizedText",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "question.en" },
          },
        },
      ],
      validation: (rule) => rule.max(8),
    }),

    defineField({
      name: "faqCtaText",
      title: "FAQ Link Text",
      type: "localizedString",
      description:
        'Text for the link to the FAQ page shown below the questions. e.g. "View all FAQs"',
      group: "faq",
    }),

    // =========================================================================
    // CTA SECTION
    // =========================================================================

    defineField({
      name: "ctaHeadline",
      title: "CTA Headline",
      type: "localizedString",
      description:
        'Bottom CTA banner headline, e.g. "Ready to Explore Underwater Punta Cana?"',
      group: "cta",
    }),

    defineField({
      name: "ctaButtonText",
      title: "CTA Button Text",
      type: "localizedString",
      group: "cta",
    }),

    defineField({
      name: "ctaWhatsappNumber",
      title: "WhatsApp Number",
      type: "string",
      description:
        "Phone number for the WhatsApp CTA (include country code, no spaces).",
      group: "cta",
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
    select: { title: "heroHeadline.en" },
    prepare({ title }) {
      return {
        title: title || "Diving & Snorkeling Page",
        subtitle: "Page — Singleton",
      };
    },
  },
});
