"use client";

import { useState } from "react";
import { ExcursionBookingModal } from "./ExcursionBookingModal";

interface BookNowButtonProps {
  locale: "en" | "es";
  excursionId: string;
  excursionTitle: string;
  daysAvailable: string[];
  timeSlots: string[];
  bookingNoticeHours: number;
  depositAmount: number;
  pricePerPerson: number;
  childPrice?: number;
  childAgeRange?: string;
}

export function BookNowButton(props: BookNowButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isEs = props.locale === "es";

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="btn-primary w-full text-center"
      >
        {isEs ? "Reservar ahora" : "Book now"}
      </button>
      <ExcursionBookingModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        locale={props.locale}
        excursionId={props.excursionId}
        excursionTitle={props.excursionTitle}
        daysAvailable={props.daysAvailable}
        timeSlots={props.timeSlots}
        bookingNoticeHours={props.bookingNoticeHours}
        depositAmount={props.depositAmount}
        pricePerPerson={props.pricePerPerson}
        childPrice={props.childPrice}
        childAgeRange={props.childAgeRange}
      />
    </>
  );
}
