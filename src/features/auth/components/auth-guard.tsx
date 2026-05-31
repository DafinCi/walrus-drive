"use client";

import { useEffect, useState } from "react";
import { Loader2, ShieldAlert } from "lucide-react";
import { useAuthState } from "../hooks/use-auth-state";
import { WalletConnectButton } from "./wallet-connect-btn";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isConnected, isConnecting } = useAuthState();
  const [isMounted, setIsMounted] = useState(false);

  // Mencegah Hydration Mismatch dari Next.js SSR
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // STATE 1: Loading & Hydration
  // Tampilkan selama server render atau saat wallet dApp kit sedang proses koneksi awal
  if (!isMounted || isConnecting) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/60" />
        <p className="text-sm text-muted-foreground animate-pulse font-medium">
          Memverifikasi identitas kriptografi...
        </p>
      </div>
    );
  }

  // STATE 2: Not Connected
  // Tampilkan halaman kosong yang elegan untuk memaksa user login
  if (!isConnected) {
    return (
      <div className="flex h-[75vh] w-full flex-col items-center justify-center px-4">
        <div className="max-w-md text-center space-y-6 p-8 border border-border/40 rounded-sm bg-card/50 shadow-sm backdrop-blur-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
            <ShieldAlert className="h-7 w-7 text-primary" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Akses Terkunci
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ruang kerja ini dilindungi oleh autentikasi Web3. Silakan
              hubungkan dompet Anda untuk memverifikasi identitas dan
              melanjutkan sesi.
            </p>
          </div>

          <div className="flex justify-center pt-2">
            {/* Kita panggil tombol connect yang sama agar UX selaras dengan Navbar */}
            <WalletConnectButton />
          </div>
        </div>
      </div>
    );
  }

  // STATE 3: Connected
  // Render aplikasi seutuhnya!
  return <>{children}</>;
}
