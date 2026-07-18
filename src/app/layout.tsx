import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Haushaltsplaner",
  description: "Gemeinsamer Planer fuer wiederkehrende Haushaltsaufgaben.",
};

const themeScript = `
(() => {
  try {
    const savedTheme = window.localStorage.getItem("theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    const theme = savedTheme === "light" || savedTheme === "dark"
      ? savedTheme
      : systemTheme;

    document.documentElement.dataset.theme = theme;
  } catch {
    document.documentElement.dataset.theme = "light";
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body>{children}</body>
      <Script
        dangerouslySetInnerHTML={{ __html: themeScript }}
        id="theme-script"
        strategy="beforeInteractive"
      />
    </html>
  );
}
