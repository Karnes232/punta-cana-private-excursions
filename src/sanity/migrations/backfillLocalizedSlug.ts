/**
 * Backfill the new `localizedSlug` object on excursion / divingExcursion /
 * excursionCategory documents.
 *
 *   - localizedSlug.en.current  ← existing slug.current  (preserves live URLs)
 *   - localizedSlug.es.current  ← slugify(title.es)      (skipped if no title.es)
 *
 * Spanish slugs are de-duplicated per type by appending -2, -3, … on collision.
 * Both published and draft documents are patched. Idempotent: `setIfMissing`
 * guards the object and we skip a language whose slug is already present.
 *
 * Usage:
 *   1. Ensure SANITY_API_TOKEN (Editor+) is in .env.local
 *   2. npx tsx src/sanity/migrations/backfillLocalizedSlug.ts
 */

import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";

import { slugify } from "../lib/slugify";

dotenv.config({ path: ".env.local" });
dotenv.config();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
  process.exit(1);
}
if (!token) {
  console.error(
    "Missing SANITY_API_TOKEN. Create one at sanity.io/manage → API → Tokens (Editor or higher).",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-05-19",
  token,
  useCdn: false,
});

const TYPES = ["excursion", "divingExcursion", "excursionCategory"] as const;

interface DocRow {
  _id: string;
  _type: string;
  legacySlug?: string;
  titleEs?: string;
  enSlug?: string;
  esSlug?: string;
}

async function run() {
  for (const type of TYPES) {
    // Pull both published and drafts.
    const rows = await client.fetch<DocRow[]>(
      `*[_type == $type]{
        _id,
        _type,
        "legacySlug": slug.current,
        "titleEs": title.es,
        "enSlug": localizedSlug.en.current,
        "esSlug": localizedSlug.es.current
      }`,
      { type },
    );

    // Track es slugs already in use (existing + newly assigned) for de-dup.
    const usedEs = new Set<string>();
    for (const r of rows) {
      if (r.esSlug) usedEs.add(r.esSlug);
    }

    let patched = 0;
    let skipped = 0;

    for (const row of rows) {
      const patch: Record<string, { current: string; _type: "slug" }> = {};

      // English slug — backfill from legacy slug if missing.
      if (!row.enSlug && row.legacySlug) {
        patch.en = { _type: "slug", current: row.legacySlug };
      }

      // Spanish slug — derive from title.es if missing and present.
      if (!row.esSlug && row.titleEs) {
        let candidate = slugify(row.titleEs);
        if (candidate) {
          let unique = candidate;
          let n = 2;
          while (unique && usedEs.has(unique)) {
            unique = `${candidate}-${n}`;
            n += 1;
          }
          candidate = unique;
          usedEs.add(candidate);
          patch.es = { _type: "slug", current: candidate };
        }
      }

      if (Object.keys(patch).length === 0) {
        skipped += 1;
        continue;
      }

      await client
        .patch(row._id)
        .setIfMissing({ localizedSlug: {} })
        .set(
          Object.fromEntries(
            Object.entries(patch).map(([lang, val]) => [
              `localizedSlug.${lang}`,
              val,
            ]),
          ),
        )
        .commit();
      patched += 1;
    }

    console.log(`[${type}] patched=${patched} skipped=${skipped} total=${rows.length}`);
  }

  console.log("Backfill complete.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
