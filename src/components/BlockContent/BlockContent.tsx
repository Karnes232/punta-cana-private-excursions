import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { Link } from "@/i18n/navigation";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-slate leading-[1.8] mb-5 font-body">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="font-heading font-bold text-2xl sm:text-3xl text-slate-dark tracking-[-0.015em] mt-12 mb-5">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-heading font-bold text-xl sm:text-2xl text-slate-dark mt-10 mb-4">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-heading font-semibold text-lg text-slate-dark mt-8 mb-3">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-teal pl-6 my-6 italic text-slate text-lg">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="space-y-2 mb-6 ml-1">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="space-y-2 mb-6 ml-5 list-decimal text-slate">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="flex gap-3 text-slate leading-relaxed">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mt-1 flex-none text-teal"
          aria-hidden
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span>{children}</span>
      </li>
    ),
    number: ({ children }) => <li className="pl-2">{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-heading font-semibold text-slate-dark">
        {children}
      </strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => {
      const href = (value as { href?: string })?.href || "#";
      const isExternal = href.startsWith("http");
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ocean underline decoration-ocean/30 hover:decoration-ocean transition-colors"
          >
            {children}
          </a>
        );
      }
      return (
        <Link
          href={href}
          className="text-ocean underline decoration-ocean/30 hover:decoration-ocean transition-colors"
        >
          {children}
        </Link>
      );
    },
  },
};

interface BlockContentProps {
  value: PortableTextBlock[] | undefined | null;
  className?: string;
}

export function BlockContent({ value, className = "" }: BlockContentProps) {
  if (!value || value.length === 0) return null;
  return (
    <div className={className}>
      <PortableText value={value} components={components} />
    </div>
  );
}
