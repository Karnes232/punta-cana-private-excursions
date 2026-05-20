const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export function cloudinaryVideoUrl(
  publicId: string | undefined,
  transforms = "f_auto,q_auto,vc_auto",
): string | null {
  if (!CLOUD_NAME || !publicId) return null;
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${transforms}/${publicId}`;
}
