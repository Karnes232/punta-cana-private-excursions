import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Punta Cana Private Excursions — Sanity Studio",
  description: "Content management for Punta Cana Private Excursions",
};

export default function StudioRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
