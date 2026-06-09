// Cheap, dependency-free spam heuristic for form submissions. Intentionally
// conservative (false-positive-averse): a borderline message should pass. Pure,
// no side effects.

interface SpamInput {
  name?: string;
  email?: string;
  message?: string;
}

const SPAM_KEYWORDS = [
  "viagra",
  "cialis",
  "casino",
  "porn",
  "crypto",
  "bitcoin",
  "forex",
  "payday loan",
  "seo service",
  "seo services",
  "backlink",
  "guest post",
  "buy followers",
  "telegram",
  "binary option",
];

function urlCount(text: string): number {
  const matches = text.match(/https?:\/\/|www\.|\[url/gi);
  return matches ? matches.length : 0;
}

export function looksLikeSpam(input: SpamInput): boolean {
  const name = (input.name ?? "").toLowerCase();
  const email = (input.email ?? "").toLowerCase();
  const message = (input.message ?? "").toLowerCase();
  const haystack = `${name} ${message}`;

  // Links anywhere in the name are a strong bot signal.
  if (urlCount(name) > 0) return true;

  // Multiple links in the body — typical of link-spam.
  if (urlCount(haystack) >= 2) return true;

  // BBCode link markup almost never appears in legitimate messages.
  if (/\[url|\[link/i.test(haystack)) return true;

  // Known spam terms.
  if (SPAM_KEYWORDS.some((kw) => haystack.includes(kw))) return true;

  // Malformed email that somehow slipped past basic validation.
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return true;

  return false;
}
