import { client } from "@/sanity/lib/client";
import {
  LocalizedField,
  type LocalizedBlockContent,
} from "../GeneralLayout/generalLayoutQuery";

export interface ExcursionsPage {
  _id: string;
  heroImage: {
    asset: {
      url: string;
      metadata: {
        lqip: string;
        dimensions: {
          width: number;
          height: number;
        };
      };
    };
    hotspot?: { x: number; y: number };
    crop?: { top: number; bottom: number; left: number; right: number };
  };
  heroEyebrow: LocalizedField;
  heroHeadline: LocalizedField;
  heroSubheadline: LocalizedField;
  introEyebrow: LocalizedField;
  introHeadline: LocalizedField;
  introBody: LocalizedBlockContent;
  introImage: {
    asset: { url: string; metadata: { lqip?: string } };
    hotspot?: { x: number; y: number };
    crop?: { top: number; bottom: number; left: number; right: number };
  } | null;
  outroHeading: LocalizedField;
  outroBody: LocalizedBlockContent;
  ctaEyebrow: LocalizedField;
  ctaHeadline: LocalizedField;
  ctaSubheadline: LocalizedField;
  ctaButtonText: LocalizedField;
  ctaButtonHref: string;
}

export const excursionsPageQuery = `*[_type == "excursionsPage"][0] {
    _id,
    heroImage {
        asset-> {
            url,
            metadata {
                lqip,
                dimensions {
                    width,
                    height,
                }
            }
        },
        hotspot,
        crop
    },
    heroEyebrow,
    heroHeadline,
    heroSubheadline,
    introEyebrow,
    introHeadline,
    introBody,
    introImage {
        asset-> { url, metadata { lqip } },
        hotspot,
        crop
    },
    outroHeading,
    outroBody,
    ctaEyebrow,
    ctaHeadline,
    ctaSubheadline,
    ctaButtonText,
    ctaButtonHref,
}`;

export async function getExcursionsPage(): Promise<ExcursionsPage | null> {
  const result = await client.fetch<ExcursionsPage>(excursionsPageQuery);
  return result;
}

// =============================================================================
// SEO
// =============================================================================

import { seoProjection, type SeoData } from "../SEO/seoProjection";

export const excursionsPageSeoQuery = `*[_type == "excursionsPage"][0]{
  "seo": seo { ${seoProjection} }
}`;

export async function getExcursionsPageSeo(): Promise<{ seo: SeoData | null } | null> {
  return client.fetch(excursionsPageSeoQuery);
}
