"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  hotspotToObjectPosition,
  type SanityHotspot,
} from "@/sanity/lib/hotspot";

export interface LightboxImage {
  url: string;
  alt: string;
  lqip?: string;
  hotspot?: SanityHotspot | null;
}

interface ImageLightboxProps {
  images: LightboxImage[];
  index: number;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}

export function ImageLightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: ImageLightboxProps) {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const total = images.length;

  const goPrev = useCallback(() => {
    onIndexChange((index - 1 + total) % total);
  }, [index, total, onIndexChange]);

  const goNext = useCallback(() => {
    onIndexChange((index + 1) % total);
  }, [index, total, onIndexChange]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, goPrev, goNext]);

  const active = images[index];
  if (!active || typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photo gallery"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 text-white">
        <span className="text-sm font-medium tabular-nums">
          {index + 1} / {total}
        </span>
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="rounded-full p-2 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="relative flex-1 flex items-center justify-center px-4 sm:px-12">
        {total > 1 && (
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous photo"
            className="absolute left-2 sm:left-4 z-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur p-3 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        <div className="relative w-full h-full max-w-6xl">
          <Image
            key={active.url}
            src={active.url}
            alt={active.alt}
            fill
            sizes="100vw"
            placeholder={active.lqip ? "blur" : undefined}
            blurDataURL={active.lqip}
            className="object-contain"
            style={{ objectPosition: hotspotToObjectPosition(active.hotspot) }}
            priority
          />
        </div>

        {total > 1 && (
          <button
            type="button"
            onClick={goNext}
            aria-label="Next photo"
            className="absolute right-2 sm:right-4 z-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur p-3 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>

      {total > 1 && (
        <div className="overflow-x-auto px-4 sm:px-6 py-4">
          <div className="flex gap-2 justify-start sm:justify-center min-w-max mx-auto">
            {images.map((img, i) => (
              <button
                key={`${img.url}-${i}`}
                type="button"
                onClick={() => onIndexChange(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index}
                className={`relative h-16 w-24 shrink-0 rounded-lg overflow-hidden transition ${
                  i === index
                    ? "ring-2 ring-white opacity-100"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={img.url}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover"
                  style={{ objectPosition: hotspotToObjectPosition(img.hotspot) }}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
}
