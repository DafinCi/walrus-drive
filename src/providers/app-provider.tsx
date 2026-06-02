"use client";

import type { ReactNode } from "react";
import { AppQueryProvider } from "./query-provider";
import { AppWalletProvider } from "./wallet-provider";
import { Toaster } from "@/components/ui/sonner"; // 🌟 TAMBAHAN BARU (Bisa di-install via: npx shadcn@latest add sonner)

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <AppQueryProvider>
      <AppWalletProvider>
        {children}
        <Toaster position="top-right" richColors closeButton />{" "}
        {/* 🌟 TAMBAHAN BARU */}
      </AppWalletProvider>
    </AppQueryProvider>
  );
}
