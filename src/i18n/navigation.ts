import { createNavigation } from "next-intl/navigation";

import { pathnames } from "./pathnames";
import { routing } from "./routing";

export const {
  Link,
  redirect,
  permanentRedirect,
  usePathname,
  useRouter,
  getPathname,
} = createNavigation(routing);

/** Every internal route key in the pathnames map (includes `[slug]` routes). */
export type AppPathname = keyof typeof pathnames;

/**
 * A localized-navigation href: either a static route key string, or an object
 * `{ pathname, params }` for `[slug]` routes. Accepted by `getPathname`, `Link`,
 * and the redirect helpers.
 */
export type AppHref = Parameters<typeof getPathname>[0]["href"];

/**
 * Route keys that take no dynamic params — i.e. the ones that can be passed to
 * `<Link href={...}>` as a bare string. Excludes `[slug]` routes (those require
 * the object form `{ pathname, params }`).
 */
export type StaticPathname = {
  [K in AppPathname]: K extends `${string}[${string}` ? never : K;
}[AppPathname];

/**
 * Narrow an arbitrary internal path string (e.g. a CMS-authored nav/CTA href)
 * to a static route key so it can be passed to the localized `<Link>`. Use only
 * for links that target a static page; slug/dynamic routes must use the object
 * form `{ pathname: "/excursions/[slug]", params: { slug } }`.
 */
export function staticHref(href: string): StaticPathname {
  return href as StaticPathname;
}
