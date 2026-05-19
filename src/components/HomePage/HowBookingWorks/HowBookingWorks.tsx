import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

interface Step {
  stepNumber: number;
  icon: string;
  title: string;
  description: string;
}

function StepIcon({ kind }: { kind: string }) {
  const common = {
    width: 36,
    height: 36,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (kind) {
    case "browse":
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <line x1="20" y1="20" x2="16.5" y2="16.5" />
        </svg>
      );
    case "deposit":
    case "payment":
    case "card":
      return (
        <svg {...common}>
          <rect x="3" y="6" width="18" height="13" rx="2" />
          <line x1="3" y1="11" x2="21" y2="11" />
          <line x1="7" y1="15" x2="11" y2="15" />
        </svg>
      );
    case "reserve":
    case "calendar":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <line x1="8" y1="3" x2="8" y2="7" />
          <line x1="16" y1="3" x2="16" y2="7" />
          <path d="m9 15 2 2 4-4" />
        </svg>
      );
    case "confirm":
    case "check":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <polyline points="8 12 11 15 16 9" />
        </svg>
      );
    case "concierge":
    case "message":
    case "chat":
      return (
        <svg {...common}>
          <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7l-4 3v-3H5a2 2 0 0 1-2-2V8Z" />
        </svg>
      );
    case "pickup":
    case "transfer":
      return (
        <svg {...common}>
          <path d="M3 13h18l-2-6H5l-2 6Z" />
          <path d="M5 13v5h14v-5" />
          <circle cx="7.5" cy="18" r="1.5" />
          <circle cx="16.5" cy="18" r="1.5" />
        </svg>
      );
    case "enjoy":
    case "sun":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" />
          <line x1="12" y1="2" x2="12" y2="4" />
          <line x1="12" y1="20" x2="12" y2="22" />
          <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
          <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
          <line x1="2" y1="12" x2="4" y2="12" />
          <line x1="20" y1="12" x2="22" y2="12" />
          <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
          <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
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

interface HowBookingWorksProps {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  steps: Step[];
}

const FALLBACK_STEPS: Step[] = [
  {
    stepNumber: 1,
    icon: "browse",
    title: "Choose your experience",
    description:
      "Browse our private catalog or message our concierge for a fully bespoke day.",
  },
  {
    stepNumber: 2,
    icon: "reserve",
    title: "Reserve your date",
    description:
      "Secure your private charter with a small deposit via PayPal — the rest is paid on the day.",
  },
  {
    stepNumber: 3,
    icon: "enjoy",
    title: "Enjoy in private",
    description:
      "Hotel pickup in a luxury vehicle. Your day, your way, with a guide who's just for you.",
  },
];

export function HowBookingWorks({
  eyebrow = "How it works",
  heading,
  subheading,
  steps,
}: HowBookingWorksProps) {
  const list = steps && steps.length > 0 ? steps : FALLBACK_STEPS;

  return (
    <section className="section-sand py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <SectionEyebrow>{eyebrow}</SectionEyebrow>
          <h2 className="mt-5 font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-dark leading-tight tracking-[-0.015em]">
            {heading || "Three simple steps."}
          </h2>
          {subheading && (
            <p className="mt-5 text-slate text-base sm:text-lg leading-relaxed">
              {subheading}
            </p>
          )}
        </div>

        <div className="grid gap-10 md:grid-cols-3 relative">
          {/* Connector line on desktop */}
          <div
            aria-hidden
            className="hidden md:block absolute top-12 left-[16.6%] right-[16.6%] h-px bg-gradient-to-r from-transparent via-ocean/30 to-transparent"
          />

          {list.map((step, i) => (
            <RevealOnScroll key={step.stepNumber} delayMs={i * 120}>
              <div className="text-center px-4">
                <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-card mb-6 z-10 text-ocean">
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-sunset text-white text-sm font-heading font-bold flex items-center justify-center shadow-sm">
                    {step.stepNumber}
                  </span>
                  <StepIcon kind={step.icon} />
                </div>
                <h3 className="font-heading font-bold text-xl text-slate-dark mb-3">
                  {step.title}
                </h3>
                <p className="text-slate leading-relaxed max-w-sm mx-auto">
                  {step.description}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
