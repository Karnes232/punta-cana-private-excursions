import { defineArrayMember, defineField, defineType } from "sanity";
import { RocketIcon } from "@sanity/icons";

export const howItWorksPage = defineType({
  name: "howItWorksPage",
  title: "How It Works Page",
  type: "document",
  icon: RocketIcon,

  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "steps", title: "Steps" },
    { name: "faq", title: "FAQ" },
    { name: "cta", title: "CTA" },
    { name: "seo", title: "SEO" },
  ],

  fields: [
    // =========================================================================
    // HERO
    // =========================================================================
    defineField({
      name: "heroEyebrow",
      title: "Hero Eyebrow / Kicker",
      type: "localizedString",
      group: "hero",
      description:
        'Small uppercase label above the headline. e.g. "How it works"',
    }),
    defineField({
      name: "heroHeadline",
      title: "Headline",
      type: "localizedString",
      group: "hero",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "heroSubheadline",
      title: "Subheadline",
      type: "localizedText",
      group: "hero",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Background Image",
      type: "image",
      group: "hero",
      options: { hotspot: true, metadata: ["lqip"] },
    }),

    // =========================================================================
    // STEPS
    // =========================================================================
    defineField({
      name: "stepsEyebrow",
      title: "Steps Eyebrow / Kicker",
      type: "localizedString",
      group: "steps",
      description:
        'Small uppercase label above the heading. e.g. "Three steps"',
    }),
    defineField({
      name: "stepsHeading",
      title: "Steps Heading",
      type: "localizedString",
      group: "steps",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "stepsSubheading",
      title: "Steps Subheading",
      type: "localizedText",
      group: "steps",
    }),
    defineField({
      name: "steps",
      title: "Steps",
      type: "array",
      group: "steps",
      validation: (r) => r.required().min(3).max(8),
      of: [
        defineArrayMember({
          type: "object",
          name: "step",
          title: "Step",
          fields: [
            defineField({
              name: "stepNumber",
              title: "Step Number",
              type: "number",
              validation: (r) => r.required().min(1).integer(),
            }),
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              validation: (r) => r.required(),
              options: {
                list: [
                  { title: "Browse", value: "browse" },
                  { title: "Reserve", value: "reserve" },
                  { title: "Deposit", value: "deposit" },
                  { title: "Confirm", value: "confirm" },
                  { title: "Enjoy", value: "enjoy" },
                ],
              },
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "localizedString",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "localizedText",
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: { title: "title.en", subtitle: "description.en" },
          },
        }),
      ],
    }),

    // =========================================================================
    // FAQ
    // =========================================================================
    defineField({
      name: "faqEyebrow",
      title: "FAQ Eyebrow / Kicker",
      type: "localizedString",
      group: "faq",
      description:
        'Small uppercase label above the heading. e.g. "Frequently asked"',
    }),
    defineField({
      name: "faqHeading",
      title: "FAQ Heading",
      type: "localizedString",
      group: "faq",
    }),
    defineField({
      name: "faqSubheading",
      title: "FAQ Subheading",
      type: "localizedText",
      group: "faq",
    }),
    defineField({
      name: "faqItems",
      title: "FAQ Items",
      type: "array",
      group: "faq",
      validation: (r) => r.max(10),
      of: [
        defineArrayMember({
          type: "object",
          name: "faqItem",
          title: "FAQ Item",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "localizedString",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: "localizedText",
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: { title: "question.en" },
          },
        }),
      ],
    }),

    // =========================================================================
    // CTA
    // =========================================================================
    defineField({
      name: "ctaEyebrow",
      title: "CTA Eyebrow / Kicker",
      type: "localizedString",
      group: "cta",
      description:
        'Small uppercase label above the headline. e.g. "Ready when you are"',
    }),
    defineField({
      name: "ctaHeadline",
      title: "CTA Headline",
      type: "localizedString",
      group: "cta",
    }),
    defineField({
      name: "ctaSubheadline",
      title: "CTA Subheadline",
      type: "localizedText",
      group: "cta",
    }),
    defineField({
      name: "ctaButtonText",
      title: "Primary Button Text",
      type: "localizedString",
      group: "cta",
    }),
    defineField({
      name: "ctaButtonHref",
      title: "Primary Button Link",
      type: "string",
      group: "cta",
      initialValue: "/excursions",
    }),
    defineField({
      name: "ctaSecondaryButtonText",
      title: "Secondary Button Text",
      type: "localizedString",
      description: 'e.g. "Browse excursions"',
      group: "cta",
    }),
    defineField({
      name: "ctaSecondaryButtonHref",
      title: "Secondary Button Link",
      type: "string",
      description:
        'Internal path (e.g. "/excursions") or full URL (e.g. "https://wa.me/18091234567")',
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
    prepare() {
      return { title: "How It Works Page" };
    },
  },
});
