interface CheckListProps {
  items: string[];
  variant?: "check" | "x";
}

export function CheckList({ items, variant = "check" }: CheckListProps) {
  if (!items || items.length === 0) return null;
  const tone =
    variant === "check"
      ? "text-teal"
      : "text-gray-dark";

  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 items-start text-slate leading-relaxed">
          <span className={`mt-1 flex-none ${tone}`} aria-hidden>
            {variant === "check" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            )}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
