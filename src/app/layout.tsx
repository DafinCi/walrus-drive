import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/providers/app-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Walrus Drive",
  description: "Decentralized collaborative storage powered by Walrus",
};

/**
 * RootLayout — Server Component (intentional, no 'use client' directive).
 *
 * AppProvider is a Client Component boundary. Next.js App Router correctly
 * handles this: the layout itself remains a Server Component and the
 * client boundary begins inside AppProvider.
 *
 * This pattern preserves:
 * - metadata export (only works in Server Components)
 * - font optimization (next/font server-side injection)
 * - streaming/Suspense compatibility at the layout level
 *
 * DO NOT add 'use client' to this file.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
