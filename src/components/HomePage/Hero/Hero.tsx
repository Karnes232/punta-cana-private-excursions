import Image from "next/image";
import { Link, staticHref } from "@/i18n/navigation";
import {
  hotspotToObjectPosition,
  type SanityHotspot,
} from "@/sanity/lib/hotspot";
import { cloudinaryVideoUrl } from "@/lib/cloudinary";

interface HeroImage {
  url: string;
  alt: string;
  lqip?: string;
  hotspot?: SanityHotspot | null;
}

interface HeroVideo {
  publicId: string;
  posterUrl?: string;
}

interface HeroCta {
  text: string;
  href: string;
}

interface HeroProps {
  backgroundImage?: HeroImage;
  video?: HeroVideo;
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
  primaryCTA?: HeroCta;
  secondaryCTA?: HeroCta;
}

export function Hero({
  backgroundImage,
  video,
  eyebrow = "VIP · Punta Cana",
  headline,
  subheadline,
  primaryCTA,
  secondaryCTA,
}: HeroProps) {
  const hasImage = Boolean(backgroundImage?.url);
  const videoUrl = cloudinaryVideoUrl(video?.publicId);

  return (
    <section className="relative isolate min-h-[88vh] flex items-end overflow-hidden">
      {/* Poster / fallback image (also shown under prefers-reduced-motion) */}
      {hasImage ? (
        <Image
          src={backgroundImage!.url}
          alt={backgroundImage!.alt ?? ""}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          placeholder={backgroundImage?.lqip ? "blur" : undefined}
          blurDataURL={backgroundImage?.lqip}
          className="object-cover -z-20"
          style={{ objectPosition: hotspotToObjectPosition(backgroundImage?.hotspot) }}
        />
      ) : (
        <div className="absolute inset-0 -z-20 bg-gradient-to-br from-ocean via-ocean-dark to-slate-dark" />
      )}

      {/* Autoplay hero video (hidden for reduced-motion users) */}
      {videoUrl && (
        <video
          src={videoUrl}
          poster={video?.posterUrl}
          autoPlay
          muted
          playsInline
          preload="none"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover motion-safe:block motion-reduce:hidden"
          style={{ zIndex: -15 }}
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/30 via-black/40 to-black/75" />

      <div className="max-w-7xl mx-auto w-full px-5 sm:px-8 lg:px-12 py-24 sm:py-28">
        <p className="text-sunset font-heading font-semibold uppercase tracking-[0.22em] text-xs sm:text-sm mb-6">
          {eyebrow}
        </p>
        <h1 className="font-heading font-bold text-white text-4xl sm:text-6xl lg:text-7xl max-w-4xl leading-[1.05] tracking-[-0.015em]">
          {headline || "Private excursions, crafted for you."}
        </h1>
        {subheadline && (
          <p className="mt-6 text-white/85 text-base sm:text-lg max-w-2xl leading-relaxed">
            {subheadline}
          </p>
        )}
        {(primaryCTA || secondaryCTA) && (
          <div className="mt-10 flex flex-wrap gap-3">
            {primaryCTA?.text && (
              <Link href={staticHref(primaryCTA.href || "#")} className="btn-primary">
                {primaryCTA.text}
              </Link>
            )}
            {secondaryCTA?.text && (
              <Link
                href={staticHref(secondaryCTA.href || "#")}
                className="btn-secondary !bg-transparent !text-white !border-white/50 hover:!bg-white hover:!text-ocean"
              >
                {secondaryCTA.text}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
