/**
 * Convert a Sanity image hotspot (x/y in 0..1) into a CSS object-position string.
 *
 * Sanity Studio lets editors click a point on the image to mark "the most
 * important spot." That point should stay visible after object-fit: cover crops.
 * Falls back to "50% 50%" (centered) when no hotspot is set.
 */
export interface SanityHotspot {
  x?: number;
  y?: number;
}

export function hotspotToObjectPosition(
  hotspot: SanityHotspot | null | undefined,
): string {
  if (!hotspot || typeof hotspot.x !== "number" || typeof hotspot.y !== "number") {
    return "50% 50%";
  }
  const x = Math.max(0, Math.min(1, hotspot.x)) * 100;
  const y = Math.max(0, Math.min(1, hotspot.y)) * 100;
  return `${x.toFixed(2)}% ${y.toFixed(2)}%`;
}
