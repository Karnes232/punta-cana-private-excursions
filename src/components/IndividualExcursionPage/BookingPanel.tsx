import { Link } from "@/i18n/navigation";

interface BookingPanelProps {
  locale: "en" | "es";
  price: number;
  deposit?: number;
  priceNote?: string;
  duration?: string;
  groupSize?: string;
  maxGuests?: number | null;
  pickupTime?: string;
  excursionTitle: string;
}

export function BookingPanel({
  locale,
  price,
  deposit,
  priceNote,
  duration,
  groupSize,
  maxGuests,
  pickupTime,
  excursionTitle,
}: BookingPanelProps) {
  const isEs = locale === "es";
  const inquiryHref = `/contact?excursion=${encodeURIComponent(excursionTitle)}`;
  const waText = encodeURIComponent(
    isEs
      ? `Hola, me interesa reservar la experiencia privada: ${excursionTitle}.`
      : `Hi, I'd like to book the private experience: ${excursionTitle}.`,
  );

  return (
    <aside className="relative lg:sticky lg:top-28 bg-white border border-sand-dark rounded-2xl shadow-card p-7">
      <p className="text-[11px] font-heading font-semibold uppercase tracking-[0.18em] text-sunset mb-2">
        {isEs ? "Reserva privada" : "Private reservation"}
      </p>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-3xl font-heading font-bold text-slate-dark">
          ${price}
        </span>
        <span className="text-xs text-gray-dark uppercase tracking-wider">
          {isEs ? "desde / por persona" : "from / per person"}
        </span>
      </div>
      {priceNote && (
        <p className="text-xs text-gray-dark italic mb-4">{priceNote}</p>
      )}
      {deposit ? (
        <p className="text-sm text-slate mb-5">
          <span className="font-heading font-semibold text-ocean">
            ${deposit}
          </span>{" "}
          {isEs
            ? "depósito ahora · saldo el día de la experiencia"
            : "deposit now · balance on the day"}
        </p>
      ) : null}

      <div className="border-y border-sand-dark py-4 my-5 space-y-2 text-sm text-slate">
        {duration && (
          <p>
            <span className="text-gray-dark text-xs uppercase tracking-wider font-heading font-semibold mr-2">
              {isEs ? "Duración" : "Duration"}
            </span>
            {duration}
          </p>
        )}
        {(groupSize || maxGuests) && (
          <p>
            <span className="text-gray-dark text-xs uppercase tracking-wider font-heading font-semibold mr-2">
              {isEs ? "Grupo" : "Group"}
            </span>
            {groupSize ||
              `${isEs ? "Hasta" : "Up to"} ${maxGuests} ${
                isEs ? "huéspedes (privado)" : "guests (private)"
              }`}
          </p>
        )}
        {pickupTime && (
          <p>
            <span className="text-gray-dark text-xs uppercase tracking-wider font-heading font-semibold mr-2">
              {isEs ? "Recogida" : "Pickup"}
            </span>
            {pickupTime}
          </p>
        )}
      </div>

      <Link href={inquiryHref} className="btn-primary w-full text-center mb-3">
        {isEs ? "Solicitar conserjería" : "Request via concierge"}
      </Link>
      <a
        href={`https://wa.me/?text=${waText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center gap-2 px-6 py-3 rounded-full bg-whatsapp text-white font-heading font-semibold text-sm shadow-sm hover:bg-whatsapp-dark transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.52 3.48A11.85 11.85 0 0 0 12.06 0C5.5 0 .17 5.32.17 11.86c0 2.09.55 4.13 1.6 5.93L0 24l6.4-1.68a11.83 11.83 0 0 0 5.66 1.44h.01c6.55 0 11.88-5.32 11.88-11.86a11.8 11.8 0 0 0-3.43-8.42Z" />
        </svg>
        {isEs ? "WhatsApp" : "Message on WhatsApp"}
      </a>

      <p className="mt-5 text-xs text-gray-dark text-center italic">
        {isEs
          ? "Reserva instantánea por PayPal próximamente."
          : "Instant PayPal booking coming soon."}
      </p>
    </aside>
  );
}
