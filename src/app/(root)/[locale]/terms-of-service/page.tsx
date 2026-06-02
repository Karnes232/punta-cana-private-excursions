import type { Metadata } from "next";
import { LegalPage, renderLegalMetadata } from "@/components/LegalPage/LegalPage";
import { getTermsOfService } from "@/sanity/queries/LegalPages/LegalDocument";

const FALLBACK = { en: "Terms of Service", es: "Términos de Servicio" };
const ID = "terms-of-service";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return renderLegalMetadata({
    locale,
    documentId: ID,
    fallbackTitle: FALLBACK,
    href: "/terms-of-service",
  });
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <LegalPage
      locale={locale}
      documentId={ID}
      fetcher={getTermsOfService}
      fallbackTitle={FALLBACK}
    />
  );
}
