const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const BASE_FOLDER = process.env.NEXT_PUBLIC_CLOUDINARY_BASE_FOLDER;

export function cloudinaryVideoUrl(
  publicId: string | undefined,
  transforms = "f_auto,q_auto,vc_auto",
): string | null {
  if (!CLOUD_NAME || !publicId) return null;
  // Editors enter the public ID relative to the project folder; prepend the
  // base folder unless it's already present (a pasted full path), so the
  // delivery URL points at the actual asset location.
  const id = publicId.replace(/^\/+/, "");
  const fullId =
    BASE_FOLDER && !id.startsWith(`${BASE_FOLDER}/`) ? `${BASE_FOLDER}/${id}` : id;
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${transforms}/${fullId}`;
}
