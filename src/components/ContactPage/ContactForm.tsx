"use client";

import { useState } from "react";

interface ContactFormProps {
  locale: "en" | "es";
  defaultExcursion?: string;
}

export function ContactForm({ locale, defaultExcursion }: ContactFormProps) {
  const isEs = locale === "es";
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, locale }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Submission failed");
      }
      setStatus("ok");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Submission failed");
    }
  }

  const t = isEs
    ? {
        name: "Nombre completo",
        email: "Correo electrónico",
        phone: "Teléfono / WhatsApp (opcional)",
        hotel: "Hotel (opcional)",
        excursion: "Experiencia de interés (opcional)",
        message: "Mensaje",
        submit: "Enviar a conserjería",
        sending: "Enviando…",
        ok: "Gracias. Te contactaremos dentro de 24 horas.",
        error: "No pudimos enviar tu mensaje. Por favor intenta de nuevo o escríbenos por WhatsApp.",
      }
    : {
        name: "Full name",
        email: "Email address",
        phone: "Phone / WhatsApp (optional)",
        hotel: "Hotel (optional)",
        excursion: "Experience of interest (optional)",
        message: "Message",
        submit: "Send to concierge",
        sending: "Sending…",
        ok: "Thank you. Our concierge will be in touch within 24 hours.",
        error: "We couldn't send your message. Please try again or message us on WhatsApp.",
      };

  if (status === "ok") {
    return (
      <div className="p-8 rounded-2xl bg-ocean text-white">
        <p className="text-[11px] font-heading font-semibold uppercase tracking-[0.22em] text-sunset mb-3">
          {isEs ? "Recibido" : "Received"}
        </p>
        <p className="font-heading font-bold text-2xl">{t.ok}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Field name="name" label={t.name} required />
      <Field name="email" label={t.email} type="email" required />
      <Field name="phone" label={t.phone} />
      <Field name="hotel" label={t.hotel} />
      <Field name="excursion" label={t.excursion} defaultValue={defaultExcursion} />
      <div>
        <label className="block text-xs font-heading font-semibold uppercase tracking-[0.14em] text-slate-dark mb-2">
          {t.message}
        </label>
        <textarea
          name="message"
          rows={5}
          required
          className="w-full px-4 py-3 rounded-xl border border-sand-dark bg-white text-slate focus:outline-none focus:border-ocean focus:ring-2 focus:ring-ocean/10 transition-colors"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "sending" ? t.sending : t.submit}
        </button>
        {status === "error" && (
          <p className="text-sm text-error">
            {error || t.error}
          </p>
        )}
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  defaultValue,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-heading font-semibold uppercase tracking-[0.14em] text-slate-dark mb-2">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="w-full px-4 py-3 rounded-xl border border-sand-dark bg-white text-slate focus:outline-none focus:border-ocean focus:ring-2 focus:ring-ocean/10 transition-colors"
      />
    </div>
  );
}
