"use client";

import {
  Wallet,
  Loader2,
  Users,
  FolderKanban,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectButton } from "@mysten/dapp-kit";

interface JoinWorkspaceCardProps {
  workspaceName: string;
  ownerAddress: string;
  role: string; // 🌟 TAMBAHAN: Menerima prop role dari parent
  isConnected: boolean;
  isJoining: boolean;
  onJoin: () => void;
}

export function JoinWorkspaceCard({
  workspaceName,
  ownerAddress,
  role, // 🌟 Destructure role
  isConnected,
  isJoining,
  onJoin,
}: JoinWorkspaceCardProps) {
  // Potong alamat wallet owner biar estetik
  const truncatedOwner = `${ownerAddress.slice(0, 6)}...${ownerAddress.slice(-4)}`;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] border border-border bg-card p-6 rounded-sm shadow-2xl space-y-6">
        {/* Header Visual */}
        <div className="text-center space-y-3">
          <div className="mx-auto h-12 w-12 rounded-sm bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <FolderKanban className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold tracking-tight text-foreground">
              Bergabung ke Workspace
            </h2>
            <p className="text-xs text-muted-foreground">
              Anda diundang untuk berkolaborasi di dalam kluster terenkripsi.
            </p>
          </div>
        </div>

        {/* Informasi Detail Workspace */}
        <div className="bg-muted/40 border border-border/60 rounded-sm p-3.5 space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground font-medium flex items-center gap-1">
              <FolderKanban className="h-3.5 w-3.5 shrink-0" /> Nama:
            </span>
            <span className="font-bold text-foreground truncate max-w-[200px]">
              {workspaceName}
            </span>
          </div>

          {/* 🌟 TAMBAHAN: Indikator Peran (Role) */}
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground font-medium flex items-center gap-1">
              {role === "admin" ? (
                <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
              ) : (
                <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
              )}
              Peran Anda:
            </span>
            <span
              className={`font-bold capitalize ${role === "admin" ? "text-amber-500" : "text-primary"}`}
            >
              {role === "admin" ? "Admin" : "Member"}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground font-medium flex items-center gap-1">
              <Users className="h-3.5 w-3.5 shrink-0" /> Owner Wallet:
            </span>
            <span className="font-mono text-foreground/80 bg-background px-1.5 py-0.5 rounded border border-border/40 select-all">
              {truncatedOwner}
            </span>
          </div>
        </div>

        {/* Seksi Tombol Aksi Dinamis Web3 */}
        <div className="pt-2">
          {!isConnected ? (
            <div className="space-y-3">
              <div className="text-center text-[11px] text-amber-500 font-medium bg-amber-500/5 border border-amber-500/10 rounded-sm p-2">
                Hubungkan dompet Sui Anda terlebih dahulu untuk memverifikasi
                hak akses tanda tangan digital Anda.
              </div>
              <div className="flex justify-center [&_button]:w-full [&_button]:h-10 [&_button]:text-xs [&_button]:font-semibold [&_button]:cursor-pointer">
                <ConnectButton
                  style={{ width: "100%" }}
                  connectText="Hubungkan Wallet Sui"
                />
              </div>
            </div>
          ) : (
            <Button
              onClick={onJoin}
              disabled={isJoining}
              className="w-full h-10 text-xs font-semibold gap-2 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isJoining ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Mendaftarkan Otoritas Akses...
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4" />
                  Terima Undangan & Gabung
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
