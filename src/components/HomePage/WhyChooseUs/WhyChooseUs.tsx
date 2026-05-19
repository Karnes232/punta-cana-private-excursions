import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

interface Pillar {
  icon: string;
  title: string;
  description: string;
}

interface WhyChooseUsProps {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  pillars: Pillar[];
}

const FALLBACK_PILLARS: Pillar[] = [
  {
    icon: "private",
    title: "Truly private",
    description:
      "Your group only — no shared boats, no shared buses. Departures on your schedule.",
  },
  {
    icon: "concierge",
    title: "Concierge support",
    description:
      "WhatsApp-first communication with a dedicated coordinator from booking to drop-off.",
  },
  {
    icon: "guide",
    title: "Top guides",
    description:
      "Hand-picked, bilingual, certified guides who know every site like their backyard.",
  },
  {
    icon: "transfer",
    title: "Premium transfers",
    description:
      "Air-conditioned luxury SUVs and Sprinter vans with hotel pickup and return.",
  },
];

function PillarIcon({ kind }: { kind: string }) {
  const common = {
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (kind) {
    case "private":
      return (
        <svg {...common}>
          <path d="M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
          <path d="M5 20a7 7 0 0 1 14 0" />
        </svg>
      );
    case "concierge":
      return (
        <svg {...common}>
          <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7l-4 3v-3H5a2 2 0 0 1-2-2V8Z" />
        </svg>
      );
    case "guide":
      return (
        <svg {...common}>
          <path d="M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6l-8-4Z" />
        </svg>
      );
    case "transfer":
      return (
        <svg {...common}>
          <path d="M3 13h18l-2-6H5l-2 6Z" />
          <path d="M5 13v5h14v-5" />
          <circle cx="7.5" cy="18" r="1.5" />
          <circle cx="16.5" cy="18" r="1.5" />
        </svg>
      );
    case "safety":
      return (
        <svg {...common}>
          <path d="M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6l-8-4Z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      );
    case "reviews":
    case "rating":
      return (
        <svg {...common}>
          <path d="m12 3 2.6 5.6 6.1.6-4.5 4.2 1.2 6L12 16.7 6.6 19.4l1.2-6L3.3 9.2l6.1-.6L12 3Z" />
        </svg>
      );
    case "bilingual":
    case "support":
      return (
        <svg {...common}>
          <path d="M4 6h10" />
          <path d="M9 3v3" />
          <path d="M6.5 12c1.6-2.5 2.5-4 2.5-6" />
          <path d="M5 11s1.5 3.5 5 3.5" />
          <path d="m14 19 3-7 3 7" />
          <path d="M15 17h4" />
        </svg>
      );
    case "exclusive":
    case "luxury":
      return (
        <svg {...common}>
          <path d="m12 3 2.5 5 5.5.8-4 4 1 5.5L12 15.8 7 18.3l1-5.5-4-4 5.5-.8L12 3Z" />
        </svg>
      );
    case "local":
      return (
        <svg {...common}>
          <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case "trust":
    case "verified":
      return (
        <svg {...common}>
          <path d="M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6l-8-4Z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      );
    case "booking":
    case "reserve":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <line x1="8" y1="3" x2="8" y2="7" />
          <line x1="16" y1="3" x2="16" y2="7" />
        </svg>
      );
    case "variety":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}

export function WhyChooseUs({
  eyebrow = "Why us",
  heading,
  subheading,
  pillars,
}: WhyChooseUsProps) {
  const list = pillars && pillars.length > 0 ? pillars : FALLBACK_PILLARS;

  return (
    <section className="section-white py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <SectionEyebrow>{eyebrow}</SectionEyebrow>
          <h2 className="mt-5 font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-dark leading-tight tracking-[-0.015em]">
            {heading || "The difference is in the details."}
          </h2>
          {subheading && (
            <p className="mt-5 text-slate text-base sm:text-lg leading-relaxed">
              {subheading}
            </p>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((p, i) => (
            <RevealOnScroll key={p.icon + i} delayMs={i * 80}>
              <div className="h-full p-8 rounded-2xl border border-sand-dark bg-sand/50 hover:bg-white hover:shadow-card transition-all">
                <div className="w-14 h-14 rounded-full bg-ocean/10 text-ocean flex items-center justify-center mb-5">
                  <PillarIcon kind={p.icon} />
                </div>
                <h3 className="font-heading font-bold text-lg text-slate-dark mb-2">
                  {p.title}
                </h3>
                <p className="text-slate text-sm leading-relaxed">
                  {p.description}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
