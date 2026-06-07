import { defineField, defineType } from "sanity";
import { BookIcon } from "@sanity/icons";

export const blogPage = defineType({
  name: "blogPage",
  title: "Blog Page",
  type: "document",
  icon: BookIcon,

  fields: [
    defineField({
      name: "heroEyebrow",
      title: "Hero Eyebrow / Kicker",
      type: "localizedString",
      description: 'Small uppercase label above the headline. e.g. "Journal"',
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
      description: 'e.g. "Done reading? Let\'s plan the real thing."',
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
      description: 'Internal path (e.g. "/contact") or full URL',
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
      return { title: "Blog Page" };
    },
  },
});
