import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Haushaltsplaner",
  description: "Gemeinsamer Planer fuer wiederkehrende Haushaltsaufgaben.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
