'use client';

import { Inter, JetBrains_Mono } from "next/font/google";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/lib/hooks/use-auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { Metadata } from "next";

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
  title: "zkLocke - Decentralized Identity with Zero-Knowledge Proofs",
  description: "A secure, privacy-preserving identity verification system powered by zero-knowledge cryptography on Substrate and Polkadot.",
  authors: [{ name: "Ars Code Amatoria", url: "https://www.arscode.org" }],
  creator: "Ars Code Amatoria",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <title>zkLocke - Decentralized Identity with Zero-Knowledge Proofs</title>
        <meta name="description" content="A secure, privacy-preserving identity verification system powered by zero-knowledge cryptography on Substrate and Polkadot." />
        <meta name="author" content="Ars Code Amatoria" />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <Header />
          <div className="pt-16 flex-grow"> {/* Adding padding to account for fixed header */}
            <AnimatePresence mode="wait">
              {children}
            </AnimatePresence>
          </div>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
