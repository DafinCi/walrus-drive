"use client";

import type { ReactNode } from "react";
import { AppQueryProvider } from "./query-provider";
import { AppWalletProvider } from "./wallet-provider";

interface AppProviderProps {
  children: ReactNode;
}

/**
 * AppProvider
 *
 * Single composition root for all app-level providers.
 * The layout only needs to know about AppProvider — not about
 * TanStack Query, Sui, or any individual provider internals.
 *
 * Order is intentional:
 * 1. QueryProvider outermost — TanStack Query has no dependencies
 * 2. WalletProvider inside — wallet hooks internally use React context
 *    for the Sui client, which must be initialized first
 *
 * This file is the only place provider order is managed.
 * Adding a new provider (Supabase context, toast, theme) means
 * editing only this file.
 */
export function AppProvider({ children }: AppProviderProps) {
  return (
    <AppQueryProvider>
      <AppWalletProvider>{children}</AppWalletProvider>
    </AppQueryProvider>
  );
}
