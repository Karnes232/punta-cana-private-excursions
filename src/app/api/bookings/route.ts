import { NextResponse } from "next/server";
import { Resend } from "resend";
import { client } from "@/sanity/lib/client";
import { capturePayPalOrder, getPayPalOrder } from "@/lib/paypal";
import {
  CustomerBookingEmail,
  OperatorBookingEmail,
  BookingEmailData,
} from "@/lib/email/bookingEmails";
import { OPERATOR_EMAIL_SUBJECT_PREFIX } from "@/lib/seo/constants";
import { recordBooking } from "@/lib/supabase/server";

interface ExcursionForEmail {
  title: { en?: string; es?: string };
  price: number;
  depositAmount: number;
}

const EMAIL_QUERY = `*[_type == "excursion" && _id == $id][0]{
  title,
  price,
  depositAmount
}`;

interface BrandingForEmail {
  logoUrl: string | null;
  companyName: { en?: string; es?: string } | null;
}

const BRANDING_QUERY = `*[_type == "generalLayout"][0]{
  "logoUrl": logo.asset->url,
  companyName
}`;

interface BookingPayload {
  orderID: string;
  excursionId: string;
  locale: "en" | "es";
  formData: {
    name: string;
    email: string;
    phone: string;
    hotel: string;
    date: string;
    timeSlot?: string;
    adults: number;
    children: number;
  };
}

function isValid(payload: unknown): payload is BookingPayload {
  if (!payload || typeof payload !== "object") return false;
  const p = payload as Partial<BookingPayload>;
  if (!p.orderID || typeof p.orderID !== "string") return false;
  if (!p.excursionId || typeof p.excursionId !== "string") return false;
  if (p.locale !== "en" && p.locale !== "es") return false;
  if (!p.formData || typeof p.formData !== "object") return false;
  const f = p.formData;
  return (
    typeof f.name === "string" &&
    typeof f.email === "string" &&
    typeof f.phone === "string" &&
    typeof f.hotel === "string" &&
    typeof f.date === "string" &&
    typeof f.adults === "number" &&
    typeof f.children === "number"
  );
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isValid(payload)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { orderID, excursionId, locale, formData } = payload;

  // Step 1: capture the PayPal order (or verify if already captured)
  let captureAmount: string | null = null;
  let captureCurrency: string | null = null;

  try {
    const cap = await capturePayPalOrder(orderID);
    if (cap.ok) {
      captureAmount = cap.amount;
      captureCurrency = cap.currency;
    }
  } catch {
    // fall through to verification
  }

  if (!captureAmount) {
    try {
      const verify = await getPayPalOrder(orderID);
      if (verify.ok) {
        captureAmount = verify.amount;
        captureCurrency = verify.currency;
      }
    } catch (err) {
      console.error("[bookings] verify error", err);
    }
  }

  if (!captureAmount) {
    return NextResponse.json(
      { error: "Payment could not be verified. Please contact our concierge." },
      { status: 402 },
    );
  }

  // Step 2: verify deposit amount + grab branding
  const [excursion, branding] = await Promise.all([
    client.fetch<ExcursionForEmail | null>(EMAIL_QUERY, { id: excursionId }),
    client.fetch<BrandingForEmail | null>(BRANDING_QUERY),
  ]);
  if (!excursion) {
    return NextResponse.json({ error: "Excursion not found" }, { status: 404 });
  }

  const totalGuests = formData.adults + formData.children;
  const expectedDeposit = (excursion.depositAmount * totalGuests).toFixed(2);
  if (captureAmount !== expectedDeposit) {
    console.error(
      `[bookings] amount mismatch: captured=${captureAmount} expected=${expectedDeposit}`,
    );
    return NextResponse.json(
      { error: "Payment amount mismatch — please contact our concierge." },
      { status: 409 },
    );
  }

  // Step 3: send emails via Resend
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const operatorEmail = process.env.BOOKING_NOTIFICATION_EMAIL;

  if (!resendKey || !fromEmail || !operatorEmail) {
    console.error("[bookings] missing Resend config");
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 500 },
    );
  }

  const resend = new Resend(resendKey);

  const excursionTitle =
    locale === "es"
      ? excursion.title?.es ?? excursion.title?.en ?? "Private Experience"
      : excursion.title?.en ?? "Private Experience";

  const totalPrice = excursion.price * totalGuests;
  const remainingBalance = (totalPrice - Number(captureAmount)).toFixed(2);

  // Persist the confirmed booking (best-effort, never blocks). Upsert on
  // paypal_order_id means re-POSTing the same order will not duplicate.
  await recordBooking({
    paypal_order_id: orderID,
    excursion_id: excursionId,
    excursion_title: excursionTitle,
    locale,
    customer_name: formData.name,
    email: formData.email,
    phone: formData.phone,
    hotel: formData.hotel,
    tour_date: formData.date,
    time_slot: formData.timeSlot,
    adults: formData.adults,
    children: formData.children,
    deposit_paid: Number(captureAmount),
    currency: captureCurrency ?? "USD",
    total_price: totalPrice,
    remaining_balance: Number(remainingBalance),
    status: "confirmed",
  });

  const logoUrl = branding?.logoUrl
    ? `${branding.logoUrl}?h=240&fit=max&auto=format`
    : undefined;
  const companyName =
    locale === "es"
      ? branding?.companyName?.es ?? branding?.companyName?.en ?? "Punta Cana Private Excursions"
      : branding?.companyName?.en ?? "Punta Cana Private Excursions";

  const emailData: BookingEmailData = {
    excursionTitle,
    date: formData.date,
    timeSlot: formData.timeSlot,
    adults: formData.adults,
    children: formData.children,
    depositPaid: captureAmount,
    currency: captureCurrency ?? "USD",
    remainingBalance: Number(remainingBalance) > 0 ? remainingBalance : undefined,
    customer: {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      hotel: formData.hotel,
    },
    paypalOrderId: orderID,
    locale,
    logoUrl,
    companyName,
  };

  const customerSubject =
    locale === "es"
      ? `Reserva privada confirmada — ${excursionTitle}`
      : `Private booking confirmed — ${excursionTitle}`;

  const operatorSubject = `${OPERATOR_EMAIL_SUBJECT_PREFIX} New private booking — ${excursionTitle} — ${formData.date}`;

  try {
    const [customerRes, operatorRes] = await Promise.all([
      resend.emails.send({
        from: fromEmail,
        to: formData.email,
        subject: customerSubject,
        react: CustomerBookingEmail(emailData),
        replyTo: operatorEmail,
      }),
      resend.emails.send({
        from: fromEmail,
        to: operatorEmail,
        subject: operatorSubject,
        react: OperatorBookingEmail(emailData),
        replyTo: formData.email,
      }),
    ]);

    if (customerRes.error || operatorRes.error) {
      console.error(
        "[bookings] resend error",
        customerRes.error,
        operatorRes.error,
      );
      return NextResponse.json(
        {
          error:
            "Payment captured but emails failed. Please contact our concierge with your order ID.",
          orderID,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      orderID,
      depositPaid: captureAmount,
      currency: captureCurrency,
    });
  } catch (err) {
    console.error("[bookings] send error", err);
    return NextResponse.json(
      {
        error:
          "Payment captured but emails failed. Please contact our concierge with your order ID.",
        orderID,
      },
      { status: 502 },
    );
  }
}
