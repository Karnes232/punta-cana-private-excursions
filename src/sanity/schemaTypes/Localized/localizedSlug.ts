import { defineField, defineType } from "sanity";
import type { SlugValidationContext } from "sanity";

import { apiVersion } from "../../env";
import { i18n } from "../../lib/i18n";
import { slugify } from "../../lib/slugify";

/**
 * A per-language URL slug, e.g. `{ en: { current }, es: { current } }`.
 *
 * Mirrors the `localizedString`/`localizedText` pattern: one `slug` field per
 * language in `i18n.languages`. Each language slug auto-generates from the
 * matching localized `title.<lang>` and is uniqueness-checked WITHIN its own
 * document type (so the same slug may exist for an `excursion` and a
 * `divingExcursion`, which live under different route segments).
 *
 * The English slug is required and acts as the canonical fallback when a
 * localized slug is missing (see `resolveSlug.ts`).
 */
export const localizedSlug = defineType({
  name: "localizedSlug",
  title: "Localized Slug",
  type: "object",
  fields: i18n.languages.map((lang) =>
    defineField({
      name: lang.id,
      title: lang.title,
      type: "slug",
      options: {
        // `doc` is the full parent document; its title is a localizedString,
        // so derive each language slug from the matching title language.
        source: (doc) =>
          (doc as { title?: Record<string, string> })?.title?.[lang.id] ?? "",
        slugify,
        maxLength: 96,
        isUnique: async (slug: string, context: SlugValidationContext) => {
          if (!slug) return true;
          const docType = context.document?._type;
          if (!docType) return true;
          const id = context.document?._id?.replace(/^drafts\./, "");
          const client = context.getClient({ apiVersion });
          const count = await client.fetch<number>(
            `count(*[_type == $docType && !(_id in [$id, "drafts." + $id]) && localizedSlug[$lang].current == $slug])`,
            { docType, id, lang: lang.id, slug },
          );
          return count === 0;
        },
      },
      validation:
        lang.id === i18n.defaultLanguage
          ? (rule) => rule.required()
          : undefined,
    }),
  ),
});
