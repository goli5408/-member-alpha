import type { Metadata } from "next";
import { Outfit, Fraunces } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

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
      {/*
        The phone frame (max-width 430px) is intentionally NOT applied here.
        • (app) and (auth) layouts add it themselves → member app stays mobile-first.
        • (staff) layout renders full-width → desktop management interface.
      */}
      <body className="min-h-full">
        {children}
      </body>
    </html>
  );
}
