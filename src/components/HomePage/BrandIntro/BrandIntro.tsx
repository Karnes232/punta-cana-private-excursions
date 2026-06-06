import Image from "next/image";
import type { PortableTextBlock } from "@portabletext/types";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { BlockContent } from "@/components/BlockContent/BlockContent";
import {
  hotspotToObjectPosition,
  type SanityHotspot,
} from "@/sanity/lib/hotspot";

interface BrandIntroProps {
  image?: {
    url: string;
    alt: string;
    lqip?: string;
    hotspot?: SanityHotspot | null;
  };
  tagline?: string;
  heading?: string;
  body?: PortableTextBlock[];
}

export function BrandIntro({ image, tagline, heading, body }: BrandIntroProps) {
  return (
    <section className="section-sand py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 grid gap-12 lg:gap-20 lg:grid-cols-2 items-center">
        <RevealOnScroll>
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
            {image?.url ? (
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                placeholder={image.lqip ? "blur" : undefined}
                blurDataURL={image.lqip}
                className="object-cover"
                style={{ objectPosition: hotspotToObjectPosition(image.hotspot) }}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-teal to-ocean" />
            )}
          </div>
        </RevealOnScroll>

        <RevealOnScroll delayMs={120}>
          <div>
            {tagline && (
              <SectionEyebrow align="left" className="mb-5">
                {tagline}
              </SectionEyebrow>
            )}
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-dark leading-[1.1] tracking-[-0.015em]">
              {heading || "An experience built around you, not a schedule."}
            </h2>
            <BlockContent value={body} className="mt-6" />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
