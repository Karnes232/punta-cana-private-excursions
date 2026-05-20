"use client";

import { useState } from "react";
import { ExcursionInquiryModal } from "./ExcursionInquiryModal";

interface ConciergeButtonProps {
  locale: "en" | "es";
  excursionTitle: string;
  variant?: "primary" | "secondary";
}

export function ConciergeButton({
  locale,
  excursionTitle,
  variant = "primary",
}: ConciergeButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isEs = locale === "es";

  const className =
    variant === "primary"
      ? "btn-primary w-full text-center"
      : "inline-flex w-full items-center justify-center px-6 py-3 rounded-full bg-white border border-ocean text-ocean font-heading font-semibold text-sm hover:bg-ocean hover:text-white transition-colors";

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={className}
      >
        {isEs ? "Solicitar conserjería" : "Request via concierge"}
      </button>
      <ExcursionInquiryModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        excursionTitle={excursionTitle}
        locale={locale}
      />
    </>
  );
}
