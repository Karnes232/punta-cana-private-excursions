interface SocialIconProps {
  platform: string;
  className?: string;
}

/**
 * Normalize the platform key from Sanity (e.g. "Google Business" → "google-business")
 * so editors can use whatever casing/spacing feels natural in Studio.
 */
function normalize(p: string) {
  return p
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z-]/g, "");
}

export function SocialIcon({ platform, className = "w-4 h-4" }: SocialIconProps) {
  const key = normalize(platform);

  switch (key) {
    case "instagram":
    case "ig":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
          <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.34 4.14.63a5.86 5.86 0 0 0-2.13 1.38A5.86 5.86 0 0 0 .63 4.14C.34 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.27 2.15.56 2.91a5.86 5.86 0 0 0 1.38 2.13 5.86 5.86 0 0 0 2.13 1.38c.76.29 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.27 2.91-.56a5.86 5.86 0 0 0 2.13-1.38 5.86 5.86 0 0 0 1.38-2.13c.29-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.27-2.15-.56-2.91a5.86 5.86 0 0 0-1.38-2.13A5.86 5.86 0 0 0 19.86.63C19.1.34 18.22.13 16.95.07 15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z" />
        </svg>
      );
    case "facebook":
    case "fb":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
          <path d="M24 12c0-6.63-5.37-12-12-12S0 5.37 0 12c0 5.99 4.39 10.95 10.13 11.85V15.47H7.08V12h3.05V9.36c0-3.01 1.79-4.67 4.53-4.67 1.31 0 2.69.23 2.69.23v2.96h-1.52c-1.49 0-1.95.92-1.95 1.87V12h3.32l-.53 3.47h-2.8v8.38C19.61 22.95 24 17.99 24 12Z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
          <path d="M19.32 5.56a5.7 5.7 0 0 1-3.32-1.07A5.74 5.74 0 0 1 13.66 0H10v14.97a3.43 3.43 0 1 1-2.36-3.25v-3.7a7.1 7.1 0 1 0 5.99 7v-7.69a9.36 9.36 0 0 0 5.49 1.78V5.56h.2Z" />
        </svg>
      );
    case "youtube":
    case "yt":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
          <path d="M23.5 6.21a3.01 3.01 0 0 0-2.12-2.13C19.5 3.57 12 3.57 12 3.57s-7.5 0-9.38.51A3.01 3.01 0 0 0 .5 6.21C0 8.09 0 12 0 12s0 3.91.5 5.79a3.01 3.01 0 0 0 2.12 2.13c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.01 3.01 0 0 0 2.12-2.13C24 15.91 24 12 24 12s0-3.91-.5-5.79ZM9.6 15.6V8.4l6.24 3.6-6.24 3.6Z" />
        </svg>
      );
    case "x":
    case "twitter":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
          <path d="M18.9 1.15h3.68l-8.04 9.18L24 22.85h-7.4l-5.8-7.58-6.63 7.58H.49l8.6-9.82L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.5h2.04L6.49 3.24H4.3L17.61 20.65Z" />
        </svg>
      );
    case "google-business":
    case "google":
    case "gmb":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
          <path d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.46c-.28 1.48-1.13 2.73-2.4 3.57v2.97h3.87c2.27-2.09 3.56-5.17 3.56-8.78Z" />
          <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-2.97c-1.07.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.94H1.27v3.07A11.99 11.99 0 0 0 12 24Z" />
          <path d="M5.27 14.34a7.2 7.2 0 0 1 0-4.68V6.59H1.27a12 12 0 0 0 0 10.82l4-3.07Z" />
          <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.59l4 3.07C6.22 6.86 8.87 4.75 12 4.75Z" />
        </svg>
      );
    case "tripadvisor":
    case "trip-advisor":
    case "ta":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
          <path d="M12 5.31c-3.1 0-5.93.71-8.22 2.06h-3.4L2.65 9.96A6.74 6.74 0 1 0 11.99 19.7a6.74 6.74 0 1 0 9.35-9.74l2.27-2.59h-3.4A15.32 15.32 0 0 0 12 5.31Zm-5.34 4.5a4.83 4.83 0 1 1 0 9.66 4.83 4.83 0 0 1 0-9.66Zm10.68 0a4.83 4.83 0 1 1 0 9.66 4.83 4.83 0 0 1 0-9.66ZM6.66 11.7a2.94 2.94 0 1 0 0 5.88 2.94 2.94 0 0 0 0-5.88Zm10.68 0a2.94 2.94 0 1 0 0 5.88 2.94 2.94 0 0 0 0-5.88Zm-10.68 1.4a1.54 1.54 0 1 1 0 3.08 1.54 1.54 0 0 1 0-3.08Zm10.68 0a1.54 1.54 0 1 1 0 3.08 1.54 1.54 0 0 1 0-3.08Z" />
        </svg>
      );
    default:
      // Fallback: outline circle so unknown platforms still render something
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}
