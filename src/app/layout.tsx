import type { Metadata } from "next";
import { Outfit, Fraunces } from "next/font/google";
import "./globals.css";

// Body text — clean geometric sans
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// Display / headings — warm editorial serif (closest to Cooper BT / Sagita on Google Fonts)
// Fraunces has an optical-size axis and a WONK axis designed to look
// intentionally "imperfect" — ideal for the Digital Zine aesthetic.
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Soul Seated",
  description: "Your 8-week journey toward purpose, belonging, and community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
