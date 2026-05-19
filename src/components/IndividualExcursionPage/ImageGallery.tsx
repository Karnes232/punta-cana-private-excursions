import Image from "next/image";
import {
  hotspotToObjectPosition,
  type SanityHotspot,
} from "@/sanity/lib/hotspot";

interface GalleryImageData {
  url: string;
  alt: string;
  lqip?: string;
  hotspot?: SanityHotspot | null;
}

interface ImageGalleryProps {
  hero: GalleryImageData;
  thumbnails?: GalleryImageData[];
}

export function ImageGallery({ hero, thumbnails }: ImageGalleryProps) {
  const list = (thumbnails ?? []).slice(0, 4);

  return (
    <section className="relative isolate">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-12">
        <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-card">
          {hero.url ? (
            <Image
              src={hero.url}
              alt={hero.alt}
              fill
              priority
              sizes="(min-width: 1024px) 66vw, 100vw"
              placeholder={hero.lqip ? "blur" : undefined}
              blurDataURL={hero.lqip}
              className="object-cover"
              style={{ objectPosition: hotspotToObjectPosition(hero.hotspot) }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-ocean to-teal" />
          )}
        </div>
        {list.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
            {list.map((img, i) => (
              <div
                key={i}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-card"
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  placeholder={img.lqip ? "blur" : undefined}
                  blurDataURL={img.lqip}
                  className="object-cover"
                  style={{ objectPosition: hotspotToObjectPosition(img.hotspot) }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
