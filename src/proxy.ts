import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

const intl = createMiddleware(routing);

// fr/de/pt/it are routable for /blog content only. Any other path under these
// locales is redirected to the unprefixed (default-locale) URL.
const BLOG_ONLY_PREFIX = /^\/(fr|de|pt|it)(?=\/|$)/;

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (BLOG_ONLY_PREFIX.test(pathname)) {
    const stripped = pathname.replace(BLOG_ONLY_PREFIX, "") || "/";
    if (!stripped.startsWith("/blog")) {
      const url = req.nextUrl.clone();
      url.pathname = stripped;
      return NextResponse.redirect(url);
    }
  }
  return intl(req);
}

export const config = {
  matcher: [
    "/",
    "/(en|es|fr|de|pt|it)/:path*",
    "/((?!api|trpc|_next|_vercel|studio|.*\\..*).*)",
  ],
};
