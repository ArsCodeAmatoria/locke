'use client';

import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/lib/hooks/use-auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// Use system fonts directly instead of Google Fonts to avoid fetch failures
const systemFontsSans = {
  variable: '--font-sans',
};

const systemFontsMono = {
  variable: '--font-mono',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${systemFontsSans.variable} ${systemFontsMono.variable}`}>
      <head>
        <title>zkLocke - Decentralized Identity with Zero-Knowledge Proofs</title>
        <meta name="description" content="A secure, privacy-preserving identity verification system powered by zero-knowledge cryptography on Substrate and Polkadot." />
        <meta name="author" content="Ars Code Amatoria" />
        {/* Define system fonts directly */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            --font-mono: 'Courier New', monospace;
          }
        `}} />
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
