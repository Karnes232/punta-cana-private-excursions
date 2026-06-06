import { defineArrayMember, defineField, defineType } from "sanity";
import { InfoOutlineIcon } from "@sanity/icons";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  icon: InfoOutlineIcon,

  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "story", title: "Our Story" },
    { name: "stats", title: "Stats" },
    { name: "values", title: "Our Values" },
    { name: "team", title: "Team" },
    { name: "cta", title: "CTA" },
    { name: "seo", title: "SEO" },
  ],

  fields: [
    // =========================================================================
    // HERO
    // =========================================================================
    defineField({
      name: "heroImage",
      title: "Hero Background Image",
      type: "image",
      group: "hero",
      options: { hotspot: true, metadata: ["lqip"] },
    }),
    defineField({
      name: "heroBadge",
      title: "Hero Badge",
      type: "localizedString",
      group: "hero",
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

    // =========================================================================
    // OUR STORY
    // =========================================================================
    defineField({
      name: "storyTagline",
      title: "Tagline",
      type: "localizedString",
      group: "story",
    }),
    defineField({
      name: "storyHeadline",
      title: "Headline",
      type: "localizedString",
      group: "story",
    }),
    defineField({
      name: "storyBody",
      title: "Story Body",
      type: "localizedBlockContent",
      group: "story",
    }),
    defineField({
      name: "storyImage",
      title: "Story Image",
      type: "image",
      group: "story",
      options: { hotspot: true, metadata: ["lqip"] },
    }),
    defineField({
      name: "foundedLabel",
      title: "Label",
      type: "localizedString",
      group: "story",
      description: 'e.g. "Founded in 2015"',
    }),

    // =========================================================================
    // STATS
    // =========================================================================
    defineField({
      name: "statsHeadline",
      title: "Stats Headline",
      type: "localizedString",
      group: "stats",
    }),
    defineField({
      name: "stats",
      title: "Stats",
      type: "array",
      group: "stats",
      of: [
        defineArrayMember({
          type: "object",
          name: "statItem",
          title: "Stat",
          fields: [
            defineField({
              name: "value",
              title: "Value",
              type: "localizedString",
              description: 'e.g. "10+" or "50,000+"',
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "localizedString",
              description: 'e.g. "Years of Experience"',
            }),
          ],
          preview: {
            select: { title: "value.en", subtitle: "label.en" },
          },
        }),
      ],
    }),

    // =========================================================================
    // OUR VALUES
    // =========================================================================
    defineField({
      name: "valuesEyebrow",
      title: "Values Eyebrow / Kicker",
      type: "localizedString",
      group: "values",
      description: 'Small label above the headline, e.g. "What we value"',
    }),
    defineField({
      name: "valuesHeadline",
      title: "Values Headline",
      type: "localizedString",
      group: "values",
    }),
    defineField({
      name: "valuesSubheading",
      title: "Values Subheading",
      type: "localizedText",
      group: "values",
    }),
    defineField({
      name: "values",
      title: "Values",
      type: "array",
      group: "values",
      of: [
        defineArrayMember({
          type: "object",
          name: "valueItem",
          title: "Value",
          fields: [
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              options: {
                list: [
                  { title: "Safety (shield check)", value: "safety" },
                  { title: "Local (map pin)", value: "local" },
                  { title: "Trust (badge check)", value: "trust" },
                  { title: "Bilingual (languages)", value: "bilingual" },
                  { title: "Support (headset)", value: "support" },
                  { title: "Reviews (star)", value: "reviews" },
                  { title: "Variety (layout grid)", value: "variety" },
                  { title: "Booking (calendar check)", value: "booking" },
                ],
                layout: "dropdown",
              },
            }),
            defineField({ name: "title", title: "Title", type: "localizedString" }),
            defineField({ name: "description", title: "Description", type: "localizedText" }),
          ],
          preview: {
            select: { title: "title.en", subtitle: "icon" },
          },
        }),
      ],
    }),

    // =========================================================================
    // TEAM
    // =========================================================================
    defineField({
      name: "teamHeadline",
      title: "Team Headline",
      type: "localizedString",
      group: "team",
    }),
    defineField({
      name: "teamSubheading",
      title: "Team Subheading",
      type: "localizedText",
      group: "team",
    }),
    defineField({
      name: "teamMembers",
      title: "Team Members",
      type: "array",
      group: "team",
      of: [
        defineArrayMember({
          type: "object",
          name: "teamMember",
          title: "Team Member",
          fields: [
            defineField({
              name: "name",
              title: "Full Name",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({ name: "role", title: "Role / Title", type: "localizedString" }),
            defineField({ name: "bio", title: "Short Bio", type: "localizedText" }),
            defineField({
              name: "photo",
              title: "Photo",
              type: "image",
              options: { hotspot: true, metadata: ["lqip"] },
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "role.en", media: "photo" },
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
      description: 'Small label above the headline, e.g. "Ready when you are"',
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
      name: "ctaPrimaryButton",
      title: "Primary Button",
      type: "object",
      group: "cta",
      fields: [
        defineField({ name: "label", title: "Label", type: "localizedString" }),
        defineField({
          name: "href",
          title: "Link",
          type: "string",
          description:
            'Internal path (e.g. "/contact") or full URL (e.g. "https://wa.me/18091234567")',
        }),
      ],
    }),
    defineField({
      name: "ctaSecondaryButton",
      title: "Secondary Button",
      type: "object",
      group: "cta",
      fields: [
        defineField({ name: "label", title: "Label", type: "localizedString" }),
        defineField({
          name: "href",
          title: "Link",
          type: "string",
          description:
            'Internal path (e.g. "/excursions") or full URL (e.g. "https://wa.me/18091234567")',
        }),
      ],
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
      return { title: "About Page" };
    },
  },
});
