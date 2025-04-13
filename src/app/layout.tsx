'use client';

import { Inter, JetBrains_Mono } from "next/font/google";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/lib/hooks/use-auth";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased min-h-screen">
        <AuthProvider>
          <Header />
          <div className="pt-16"> {/* Adding padding to account for fixed header */}
            <AnimatePresence mode="wait">
              {children}
            </AnimatePresence>
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
