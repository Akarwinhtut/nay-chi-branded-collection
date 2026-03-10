import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

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
    <html lang="en" className="scroll-smooth">
      <body
        className={`${bodyFont.variable} ${displayFont.variable} min-h-screen bg-[#f7f1e6] text-[#1b1613] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
