// src/app/workspace/create/page.tsx
"use client";

import { CreateWorkspaceForm } from "@/features/workspace/components/create-workspace-form";
import { useAuthState } from "@/features/auth/hooks/use-auth-state";

export default function CreateWorkspacePage() {
  const { address } = useAuthState();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-xl space-y-6">
        {/* Header Minimalis */}
        <div className="space-y-1.5 text-left">
          <div className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase font-semibold">
            Gateway / New Container
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Create Your Workspace
          </h1>
          <p className="text-xs text-muted-foreground max-w-md">
            Configure decentralized storage parameters powered by Walrus
            Protocol and Sui Network.
          </p>
        </div>

        {/* Solid Form Container */}
        <div className="bg-card border border-border p-6 sm:p-8 rounded-sm shadow-sm">
          <CreateWorkspaceForm walletAddress={address || undefined} />
        </div>

        {/* Footer Monokromatik */}
        <div className="text-left">
          <p className="text-[10px] text-muted-foreground/50 font-mono">
            TrestoSpace Protocol v1.0.0 • Production Environment
          </p>
        </div>
      </div>
    </div>
  );
}
