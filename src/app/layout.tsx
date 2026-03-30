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
      {/* Desktop: warm neutral bg with centred phone frame
          Mobile: full-bleed (the inner div just becomes 100 vw) */}
      <body
        className="min-h-full flex justify-center"
        style={{ background: "#ddd9cc" }}
      >
        <div
          className="relative w-full flex flex-col"
          style={{
            maxWidth: 430,
            minHeight: "100dvh",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 8px 48px rgba(0,0,0,0.18)",
          }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
