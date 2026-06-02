"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/** Slug-bearing route keys whose language switch needs a per-locale slug. */
export type SlugRoutePathname =
  | "/excursions/[slug]"
  | "/scuba-diving/[slug]"
  | "/blog/[slug]";

export interface LocaleSwitchAlternates {
  /** The internal route key, e.g. "/excursions/[slug]". */
  pathname: SlugRoutePathname;
  /** The canonical slug for each locale. */
  slugs: { en: string; es: string };
}

interface LocaleSwitchContextValue {
  alternates: LocaleSwitchAlternates | null;
  setAlternates: (value: LocaleSwitchAlternates | null) => void;
}

const LocaleSwitchContext = createContext<LocaleSwitchContextValue | null>(null);

export function LocaleSwitchProvider({ children }: { children: ReactNode }) {
  const [alternates, setAlternates] =
    useState<LocaleSwitchAlternates | null>(null);
  return (
    <LocaleSwitchContext.Provider value={{ alternates, setAlternates }}>
      {children}
    </LocaleSwitchContext.Provider>
  );
}

/** Read the current document's locale alternates (null on non-slug pages). */
export function useLocaleSwitch(): LocaleSwitchAlternates | null {
  return useContext(LocaleSwitchContext)?.alternates ?? null;
}

/**
 * Rendered by a slug page to register the current document's per-locale slugs
 * with the language switcher. Clears on unmount so navigating to a static page
 * falls back to plain pathname switching.
 */
export function SetLocaleAlternates(props: LocaleSwitchAlternates) {
  const ctx = useContext(LocaleSwitchContext);
  const { pathname } = props;
  const en = props.slugs.en;
  const es = props.slugs.es;

  useEffect(() => {
    if (!ctx) return;
    ctx.setAlternates({ pathname, slugs: { en, es } });
    return () => ctx.setAlternates(null);
  }, [ctx, pathname, en, es]);

  return null;
}
