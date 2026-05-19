import type { Metadata } from "next";
import { LegalPage, renderLegalMetadata } from "@/components/LegalPage/LegalPage";
import { getCancellationPolicy } from "@/sanity/queries/LegalPages/LegalDocument";

const FALLBACK = { en: "Cancellation Policy", es: "Política de Cancelación" };
const ID = "cancellation-policy";

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
    path: "/cancellation-policy",
  });
}

export default async function CancellationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <LegalPage
      locale={locale}
      documentId={ID}
      fetcher={getCancellationPolicy}
      fallbackTitle={FALLBACK}
      path="/cancellation-policy"
    />
  );
}
