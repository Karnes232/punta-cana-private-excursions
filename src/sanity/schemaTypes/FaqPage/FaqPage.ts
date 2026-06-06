import { defineArrayMember, defineField, defineType } from "sanity";
import { HelpCircleIcon } from "@sanity/icons";

export const faqPage = defineType({
  name: "faqPage",
  title: "FAQ Page",
  type: "document",
  icon: HelpCircleIcon,

  fields: [
    defineField({
      name: "heroEyebrow",
      title: "Hero Eyebrow / Kicker",
      type: "localizedString",
      description:
        'Small uppercase label above the headline. e.g. "Frequently asked"',
    }),
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "localizedString",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "heroSubheadline",
      title: "Hero Subheadline",
      type: "localizedText",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Background Image",
      type: "image",
      options: { hotspot: true, metadata: ["lqip"] },
    }),
    defineField({
      name: "categories",
      title: "FAQ Categories",
      type: "array",
      description: "Group FAQs into categories. Each category becomes a section on the page.",
      of: [
        defineArrayMember({
          type: "object",
          name: "faqCategory",
          title: "Category",
          fields: [
            defineField({
              name: "categoryName",
              title: "Category Name",
              type: "localizedString",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "subtitle",
              title: "Subtitle",
              type: "localizedString",
              description:
                'Short scope line under the category name, e.g. "Booking, deposits, and how payment works"',
            }),
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              options: {
                list: [
                  { title: "Booking (calendar check)", value: "booking" },
                  { title: "Cancellation (rotate)", value: "cancellation" },
                  { title: "Transport / Pickup (bus)", value: "transport" },
                  { title: "Safety (shield check)", value: "safety" },
                  { title: "On the day (sun)", value: "day" },
                  { title: "Diving / Snorkeling (waves)", value: "diving" },
                  { title: "Planning (map)", value: "planning" },
                  { title: "Company / About (users)", value: "company" },
                  { title: "Excursion (compass)", value: "excursion" },
                  { title: "General (help circle)", value: "general" },
                ],
                layout: "dropdown",
              },
            }),
            defineField({
              name: "items",
              title: "FAQ Items",
              type: "array",
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
          ],
          preview: {
            select: { title: "categoryName.en" },
            prepare({ title }) {
              return { title: title ?? "Category" };
            },
          },
        }),
      ],
    }),

    defineField({
      name: "ctaEyebrow",
      title: "CTA Eyebrow / Kicker",
      type: "localizedString",
      description:
        'Small uppercase label above the headline. e.g. "Ready when you are"',
    }),
    defineField({
      name: "ctaHeadline",
      title: "CTA Headline",
      type: "localizedString",
      description: 'e.g. "Didn\'t find your answer?"',
    }),
    defineField({
      name: "ctaSubheadline",
      title: "CTA Subheadline",
      type: "localizedText",
    }),
    defineField({
      name: "ctaButtonText",
      title: "Primary Button Text",
      type: "localizedString",
    }),
    defineField({
      name: "ctaButtonHref",
      title: "Primary Button Link",
      type: "string",
      initialValue: "/contact",
    }),
    defineField({
      name: "ctaSecondaryButtonText",
      title: "Secondary Button Text",
      type: "localizedString",
      description: 'e.g. "Browse excursions"',
    }),
    defineField({
      name: "ctaSecondaryButtonHref",
      title: "Secondary Button Link",
      type: "string",
      description:
        'Internal path (e.g. "/excursions") or full URL (e.g. "https://wa.me/18091234567")',
    }),

    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],

  preview: {
    prepare() {
      return { title: "FAQ Page" };
    },
  },
});
