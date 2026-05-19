interface SectionEyebrowProps {
  children: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}

/** Small uppercase label sitting above section headings (VIP "editorial" cue). */
export function SectionEyebrow({
  children,
  align = "center",
  className = "",
}: SectionEyebrowProps) {
  return (
    <p
      className={`text-sunset font-heading font-semibold uppercase tracking-[0.18em] text-xs ${
        align === "center" ? "text-center" : ""
      } ${className}`}
    >
      <span className="inline-flex items-center gap-3">
        <span className="h-px w-8 bg-sunset/60" aria-hidden />
        {children}
        <span className="h-px w-8 bg-sunset/60" aria-hidden />
      </span>
    </p>
  );
}
