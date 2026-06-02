/**
 * Shared slug generator used by Studio slug fields and the backfill migration.
 * Lowercases, collapses whitespace to hyphens, strips non-word characters, and
 * caps the length. Mirrors the historic inline slugify on the excursion `slug`
 * field so backfilled `localizedSlug.en` values match existing slugs exactly.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .slice(0, 96);
}
