export interface BookingFormState {
  name: string;
  email: string;
  phone: string;
  hotel: string;
  date: string;
  timeSlot: string;
  adults: number;
  children: number;
}

export type BookingFormErrors = Partial<Record<keyof BookingFormState, string>>;

export type BookingStep = "form" | "review" | "success" | "error";

export interface BookingLabels {
  modalTitle: string;
  modalSubtitle: string;
  close: string;
  stepFormTitle: string;
  stepReviewTitle: string;
  dateLabel: string;
  /** Use {hours} as the placeholder. */
  dateHelper: string;
  dateInvalidWeekday: string;
  dateInvalidNotice: string;
  timeLabel: string;
  timeRequired: string;
  guestsLabel: string;
  adultsLabel: string;
  childrenLabel: string;
  contactSection: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  hotelLabel: string;
  hotelPlaceholder: string;
  required: string;
  invalidEmail: string;
  invalidPhone: string;
  continueToPayment: string;
  editDetails: string;
  reviewExcursion: string;
  reviewDate: string;
  reviewTime: string;
  reviewGuests: string;
  reviewHotel: string;
  reviewTotal?: string;
  reviewDeposit: string;
  reviewDepositNote: string;
  reviewBalanceLabel: string;
  successTitle: string;
  successMessage: string;
  successCheckEmail: string;
  errorTitle: string;
  errorRetry: string;
  errorContact: string;
  paymentError: string;
}

export function getBookingLabels(locale: "en" | "es"): BookingLabels {
  if (locale === "es") {
    return {
      modalTitle: "Reservar experiencia privada",
      modalSubtitle: "Asegura tu fecha con un depósito",
      close: "Cerrar",
      stepFormTitle: "Detalles de la reserva",
      stepReviewTitle: "Confirma tu reserva",
      dateLabel: "Fecha",
      dateHelper: "Reserva con al menos {hours} horas de anticipación.",
      dateInvalidWeekday: "Esta experiencia no está disponible ese día.",
      dateInvalidNotice: "Por favor elige una fecha más adelante.",
      timeLabel: "Hora de salida",
      timeRequired: "Selecciona una hora.",
      guestsLabel: "Huéspedes",
      adultsLabel: "Adultos",
      childrenLabel: "Niños",
      contactSection: "Datos de contacto",
      nameLabel: "Nombre completo",
      namePlaceholder: "Tu nombre",
      emailLabel: "Correo electrónico",
      emailPlaceholder: "tu@correo.com",
      phoneLabel: "Teléfono / WhatsApp",
      phonePlaceholder: "+1 829 000 0000",
      hotelLabel: "Hotel / Alojamiento",
      hotelPlaceholder: "Nombre de tu hotel",
      required: "Campo obligatorio",
      invalidEmail: "Correo no válido",
      invalidPhone: "Teléfono no válido",
      continueToPayment: "Continuar al pago",
      editDetails: "Editar detalles",
      reviewExcursion: "Experiencia",
      reviewDate: "Fecha",
      reviewTime: "Hora",
      reviewGuests: "Huéspedes",
      reviewHotel: "Hotel",
      reviewTotal: "Total",
      reviewDeposit: "Depósito hoy",
      reviewDepositNote:
        "Reembolsable hasta 48 horas antes. Saldo el día de la experiencia.",
      reviewBalanceLabel: "Saldo el día",
      successTitle: "¡Reserva confirmada!",
      successMessage:
        "Hemos recibido tu depósito. Te contactaremos por WhatsApp para coordinar.",
      successCheckEmail: "Revisa tu correo en",
      errorTitle: "Hubo un problema",
      errorRetry: "Reintentar",
      errorContact:
        "El pago se procesó pero no pudimos completar la reserva. Contáctanos por WhatsApp.",
      paymentError: "El pago no se pudo procesar. Inténtalo de nuevo.",
    };
  }
  return {
    modalTitle: "Book private experience",
    modalSubtitle: "Secure your date with a deposit",
    close: "Close",
    stepFormTitle: "Booking details",
    stepReviewTitle: "Confirm your booking",
    dateLabel: "Date",
    dateHelper: "Please book at least {hours} hours in advance.",
    dateInvalidWeekday: "This experience isn't available on that day.",
    dateInvalidNotice: "Please choose a date further out.",
    timeLabel: "Departure time",
    timeRequired: "Please select a time.",
    guestsLabel: "Guests",
    adultsLabel: "Adults",
    childrenLabel: "Children",
    contactSection: "Contact details",
    nameLabel: "Full name",
    namePlaceholder: "Your name",
    emailLabel: "Email",
    emailPlaceholder: "you@email.com",
    phoneLabel: "Phone / WhatsApp",
    phonePlaceholder: "+1 829 000 0000",
    hotelLabel: "Hotel / Accommodation",
    hotelPlaceholder: "Where you're staying",
    required: "Required",
    invalidEmail: "Invalid email",
    invalidPhone: "Invalid phone",
    continueToPayment: "Continue to payment",
    editDetails: "Edit details",
    reviewExcursion: "Experience",
    reviewDate: "Date",
    reviewTime: "Time",
    reviewGuests: "Guests",
    reviewHotel: "Hotel",
    reviewTotal: "Total",
    reviewDeposit: "Deposit today",
    reviewDepositNote:
      "Refundable up to 48 hours before. Balance due on the day.",
    reviewBalanceLabel: "Balance on the day",
    successTitle: "Booking confirmed!",
    successMessage:
      "We've received your deposit. We'll reach out on WhatsApp shortly to coordinate.",
    successCheckEmail: "A confirmation was sent to",
    errorTitle: "Something went wrong",
    errorRetry: "Retry",
    errorContact:
      "Your payment went through but we couldn't finalize the booking. Please contact us on WhatsApp.",
    paymentError: "We couldn't process the payment. Please try again.",
  };
}
