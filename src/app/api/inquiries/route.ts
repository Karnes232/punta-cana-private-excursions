import { NextResponse } from "next/server";
import { checkBotId } from "botid/server";
import { Resend } from "resend";
import { OperatorInquiryEmail } from "@/lib/email/inquiryEmail";
import { OPERATOR_EMAIL_SUBJECT_PREFIX } from "@/lib/seo/constants";
import { looksLikeSpam } from "@/lib/spam";
import { recordFormSubmission } from "@/lib/supabase/server";

interface InquiryPayload {
  excursionTitle: string;
  locale: "en" | "es";
  name: string;
  email: string;
  phone?: string;
  hotel?: string;
  message?: string;
}

function isValid(payload: unknown): payload is InquiryPayload {
  if (!payload || typeof payload !== "object") return false;
  const p = payload as Partial<InquiryPayload>;
  return (
    typeof p.excursionTitle === "string" &&
    p.excursionTitle.length > 0 &&
    (p.locale === "en" || p.locale === "es") &&
    typeof p.name === "string" &&
    p.name.trim().length > 0 &&
    typeof p.email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)
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

  // Bot gate (Vercel BotID — inert in local dev, active on Vercel).
  const { isBot } = await checkBotId();
  if (isBot) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  // Spam gate — silently drop (return a success shape so bots get no signal),
  // skipping both persistence and email.
  if (looksLikeSpam(payload)) {
    return NextResponse.json({ ok: true });
  }

  // Persist the submission (best-effort, never blocks). excursionTitle → excursion.
  await recordFormSubmission({
    type: "inquiry",
    locale: payload.locale,
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    hotel: payload.hotel,
    excursion: payload.excursionTitle,
    message: payload.message,
  });

  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const operatorEmail = process.env.BOOKING_NOTIFICATION_EMAIL;

  if (!resendKey || !fromEmail || !operatorEmail) {
    console.error("[inquiries] missing Resend config");
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 500 },
    );
  }

  const resend = new Resend(resendKey);

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: operatorEmail,
      subject: `${OPERATOR_EMAIL_SUBJECT_PREFIX} Private inquiry — ${payload.excursionTitle} — ${payload.name}`,
      react: OperatorInquiryEmail(payload),
      replyTo: payload.email,
    });

    if (result.error) {
      console.error("[inquiries] resend error", result.error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[inquiries] send error", err);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 502 },
    );
  }
}
