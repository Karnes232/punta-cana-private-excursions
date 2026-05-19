import type { Metadata } from "next";
import { LegalPage, renderLegalMetadata } from "@/components/LegalPage/LegalPage";
import { getPrivacyPolicy } from "@/sanity/queries/LegalPages/LegalDocument";

const FALLBACK = { en: "Privacy Policy", es: "Política de Privacidad" };
const ID = "privacy-policy";

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
    path: "/privacy-policy",
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <LegalPage
      locale={locale}
      documentId={ID}
      fetcher={getPrivacyPolicy}
      fallbackTitle={FALLBACK}
      path="/privacy-policy"
    />
  );
}
