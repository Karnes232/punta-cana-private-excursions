import { defineField, defineType } from "sanity";
import { EnvelopeIcon } from "@sanity/icons";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  icon: EnvelopeIcon,

  fields: [
    defineField({
      name: "heroEyebrow",
      title: "Hero Eyebrow / Kicker",
      type: "localizedString",
      description:
        'Small uppercase label above the headline. e.g. "Private concierge"',
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
      name: "formHeadline",
      title: "Form Section Headline",
      type: "localizedString",
      description: "Heading above the contact form column.",
    }),
    defineField({
      name: "formIntroLine",
      title: "Form Intro Line",
      type: "localizedText",
      description: "Short intro text shown below the form headline.",
    }),
    defineField({
      name: "infoHeadline",
      title: "Info Section Headline",
      type: "localizedString",
      description: "Heading above the contact info cards column.",
    }),

    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],

  preview: {
    prepare() {
      return { title: "Contact Page" };
    },
  },
});
