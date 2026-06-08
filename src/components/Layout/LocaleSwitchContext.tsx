"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
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
  // Memoize so the context value keeps a stable identity across renders
  // (setAlternates from useState is already stable). Without this, every
  // provider render hands consumers a new object.
  const value = useMemo(
    () => ({ alternates, setAlternates }),
    [alternates],
  );
  return (
    <LocaleSwitchContext.Provider value={value}>
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
  // Depend on the stable setter, NOT the whole context object. The context
  // value's identity can change between renders; depending on it here would
  // re-run the effect every render and (because we set a fresh object each
  // time) spin into an infinite update loop.
  const setAlternates = useContext(LocaleSwitchContext)?.setAlternates;
  const { pathname } = props;
  const en = props.slugs.en;
  const es = props.slugs.es;

  useEffect(() => {
    if (!setAlternates) return;
    setAlternates({ pathname, slugs: { en, es } });
    return () => setAlternates(null);
  }, [setAlternates, pathname, en, es]);

  return null;
}
