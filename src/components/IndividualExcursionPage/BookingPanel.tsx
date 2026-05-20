import { BookNowButton } from "./Booking/BookNowButton";
import { ConciergeButton } from "./Booking/ConciergeButton";

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
  excursionId: string;
  daysAvailable: string[];
  timeSlots: string[];
  bookingNoticeHours: number;
  childPrice?: number;
  childAgeRange?: string;
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
  excursionId,
  daysAvailable,
  timeSlots,
  bookingNoticeHours,
  childPrice,
  childAgeRange,
}: BookingPanelProps) {
  const isEs = locale === "es";

  const canBookOnline = Boolean(
    deposit && deposit > 0 && daysAvailable && daysAvailable.length > 0,
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

      {canBookOnline && deposit ? (
        <div className="mb-3">
          <BookNowButton
            locale={locale}
            excursionId={excursionId}
            excursionTitle={excursionTitle}
            daysAvailable={daysAvailable}
            timeSlots={timeSlots}
            bookingNoticeHours={bookingNoticeHours}
            depositAmount={deposit}
            pricePerPerson={price}
            childPrice={childPrice}
            childAgeRange={childAgeRange}
          />
        </div>
      ) : null}

      <ConciergeButton
        locale={locale}
        excursionTitle={excursionTitle}
        variant={canBookOnline ? "secondary" : "primary"}
      />
    </aside>
  );
}
