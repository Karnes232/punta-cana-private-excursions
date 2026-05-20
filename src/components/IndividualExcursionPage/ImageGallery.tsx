"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  hotspotToObjectPosition,
  type SanityHotspot,
} from "@/sanity/lib/hotspot";
import { ImageLightbox, type LightboxImage } from "./ImageLightbox";

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

interface TileProps {
  img: GalleryImageData;
  index: number;
  total: number;
  sizes: string;
  className: string;
  priority?: boolean;
  overlay?: React.ReactNode;
  onOpen: (i: number) => void;
}

function Tile({
  img,
  index,
  total,
  sizes,
  className,
  priority,
  overlay,
  onOpen,
}: TileProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={`Open photo ${index + 1} of ${total}`}
      className={`group relative overflow-hidden rounded-2xl shadow-card cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 ${className}`}
    >
      {img.url ? (
        <Image
          src={img.url}
          alt={img.alt}
          fill
          priority={priority}
          sizes={sizes}
          placeholder={img.lqip ? "blur" : undefined}
          blurDataURL={img.lqip}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          style={{ objectPosition: hotspotToObjectPosition(img.hotspot) }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-ocean to-teal" />
      )}
      {overlay}
    </button>
  );
}

export function ImageGallery({ hero, thumbnails }: ImageGalleryProps) {
  const allThumbs = useMemo(() => thumbnails ?? [], [thumbnails]);
  const visibleThumbs = allThumbs.slice(0, 4);
  const extra = Math.max(0, allThumbs.length - 4);

  const allImages: LightboxImage[] = useMemo(
    () => [hero, ...allThumbs],
    [hero, allThumbs],
  );

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const open = (i: number) => setLightboxIndex(i);
  const close = () => setLightboxIndex(null);

  const total = allImages.length;
  const hasThumbs = visibleThumbs.length > 0;

  return (
    <section className="relative isolate">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-12">
        <div
          className={
            hasThumbs
              ? "grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-4 gap-3 lg:aspect-[16/9]"
              : "grid grid-cols-1 gap-3"
          }
        >
          {/* Hero */}
          <Tile
            img={hero}
            index={0}
            total={total}
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className={
              hasThumbs
                ? "col-span-2 lg:row-span-4 aspect-[16/10] lg:aspect-auto"
                : "aspect-[16/9]"
            }
            onOpen={open}
            overlay={
              hasThumbs && total > 1 ? (
                <span className="pointer-events-none absolute bottom-4 right-4 hidden lg:inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur px-4 py-2 text-sm font-medium text-gray-900 shadow-card">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                  View all {total} photos
                </span>
              ) : null
            }
          />

          {/* T2 — wide top */}
          {visibleThumbs[0] && (
            <Tile
              img={visibleThumbs[0]}
              index={1}
              total={total}
              sizes="(min-width: 1024px) 33vw, 50vw"
              className="col-span-1 lg:col-span-2 lg:row-span-1 aspect-[4/3] lg:aspect-auto"
              onOpen={open}
            />
          )}

          {/* T3 — middle left */}
          {visibleThumbs[1] && (
            <Tile
              img={visibleThumbs[1]}
              index={2}
              total={total}
              sizes="(min-width: 1024px) 16vw, 50vw"
              className="col-span-1 lg:row-span-2 aspect-[4/3] lg:aspect-auto"
              onOpen={open}
            />
          )}

          {/* T4 — middle right */}
          {visibleThumbs[2] && (
            <Tile
              img={visibleThumbs[2]}
              index={3}
              total={total}
              sizes="(min-width: 1024px) 16vw, 50vw"
              className="col-span-1 lg:row-span-2 aspect-[4/3] lg:aspect-auto"
              onOpen={open}
            />
          )}

          {/* T5 — wide bottom (with +N overlay if more) */}
          {visibleThumbs[3] && (
            <Tile
              img={visibleThumbs[3]}
              index={4}
              total={total}
              sizes="(min-width: 1024px) 33vw, 50vw"
              className="col-span-2 lg:row-span-1 aspect-[4/3] lg:aspect-auto"
              onOpen={open}
              overlay={
                extra > 0 ? (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-white text-xl font-semibold backdrop-blur-[2px]">
                    +{extra} more
                  </span>
                ) : null
              }
            />
          )}
        </div>
      </div>

      {lightboxIndex !== null && (
        <ImageLightbox
          images={allImages}
          index={lightboxIndex}
          onClose={close}
          onIndexChange={setLightboxIndex}
        />
      )}
    </section>
  );
}
