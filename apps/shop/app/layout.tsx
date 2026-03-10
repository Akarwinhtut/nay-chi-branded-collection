import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import { SiteShell } from "@/components/site-shell";
import { sharedMetadata } from "@/lib/metadata";
import "./globals.css";

const bodyFont = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const displayFont = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = sharedMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bodyFont.variable} ${displayFont.variable} min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)] antialiased`}
      >
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
