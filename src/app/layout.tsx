'use client';

import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "zkID Login - Identity Verification",
  description: "Decentralized identity verification powered by zero-knowledge cryptography",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased min-h-screen">
        <Header />
        <div className="pt-16"> {/* Adding padding to account for fixed header */}
          <AnimatePresence mode="wait">
            {children}
          </AnimatePresence>
        </div>
      </body>
    </html>
  );
}
