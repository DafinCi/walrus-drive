"use client";

import { CreateWorkspaceForm } from "@/features/workspace/components/create-workspace-form";
import { useAuthState } from "@/features/auth/hooks/use-auth-state";

export default function CreateWorkspacePage() {
  // Ambil 'address' dari auth state lu (bukan walletAddress)
  const { address } = useAuthState();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-4 py-12 select-none">
      <div className="w-full max-w-xl text-center space-y-6">
        {/* Header Seksi Onboarding */}
        <div className="space-y-2">
          <div className="text-xs font-mono tracking-widest text-primary uppercase font-bold">
            🛡️ Ecosystem Gateway
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Create Your Workspace
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Konfigurasikan tata kelola kontainer penyimpanan terenkripsi lu yang
            ditenagai oleh Walrus & Sui Network.
          </p>
        </div>

        {/* Form Box Premium Wrapper */}
        <div className="bg-card/40 border border-muted-foreground/10 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl">
          {/* Konversi null bawaan hook menjadi undefined agar sesuai ekspektasi props komponen */}
          <CreateWorkspaceForm walletAddress={address || undefined} />
        </div>

        {/* Footer Kecil Estetis */}
        <p className="text-xs text-muted-foreground/60 font-mono">
          TrestoSpace v1.0.0 • Secured Decentralized Protocol
        </p>
      </div>
    </div>
  );
}
