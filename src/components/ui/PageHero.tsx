import Image from "next/image";
import {
  hotspotToObjectPosition,
  type SanityHotspot,
} from "@/sanity/lib/hotspot";

interface PageHeroProps {
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
  image?: {
    url: string;
    alt?: string;
    lqip?: string;
    hotspot?: SanityHotspot | null;
  } | null;
  /** Smaller variant for less heavy pages (FAQ, blog, contact) */
  size?: "tall" | "compact";
}

export function PageHero({
  eyebrow = "VIP · Punta Cana",
  headline,
  subheadline,
  image,
  size = "tall",
}: PageHeroProps) {
  const hasImage = Boolean(image?.url);
  const minH = size === "compact" ? "min-h-[52vh]" : "min-h-[68vh]";

  return (
    <section className={`relative isolate ${minH} flex items-end overflow-hidden`}>
      {hasImage ? (
        <Image
          src={image!.url}
          alt={image?.alt ?? ""}
          fill
          priority
          sizes="100vw"
          placeholder={image?.lqip ? "blur" : undefined}
          blurDataURL={image?.lqip}
          className="object-cover -z-10"
          style={{ objectPosition: hotspotToObjectPosition(image?.hotspot) }}
        />
      ) : (
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-ocean via-ocean-dark to-slate-dark" />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />

      <div className="max-w-7xl mx-auto w-full px-5 sm:px-8 lg:px-12 py-20 sm:py-24">
        <p className="text-sunset font-heading font-semibold uppercase tracking-[0.22em] text-xs sm:text-sm mb-5">
          {eyebrow}
        </p>
        <h1 className="font-heading font-bold text-white text-4xl sm:text-5xl lg:text-6xl max-w-4xl leading-[1.05] tracking-[-0.015em]">
          {headline}
        </h1>
        {subheadline && (
          <p className="mt-5 text-white/85 text-base sm:text-lg max-w-2xl leading-relaxed">
            {subheadline}
          </p>
        )}
      </div>
    </section>
  );
}
