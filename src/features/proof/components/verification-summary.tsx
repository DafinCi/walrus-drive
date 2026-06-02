"use client";

import {
  Files,
  ShieldCheck,
  Clock3,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";
import { VerificationStatCard } from "./verification-stat-card";

interface VerificationStats {
  totalFiles: number;
  verified: number;
  pending: number;
  failed: number;
  integrityScore: number;
  integrityLabel: string;
}

interface VerificationSummaryProps {
  stats: VerificationStats;
}

export function VerificationSummary({ stats }: VerificationSummaryProps) {
  const {
    totalFiles,
    verified,
    pending,
    failed,
    integrityScore,
    integrityLabel,
  } = stats;

  // 🌟 EMTPY STATE LAYER: Skenario jika workspace belum memiliki berkas sama sekali
  if (totalFiles === 0) {
    return (
      <div className="p-6 border border-dashed border-border rounded-sm bg-muted/20 text-center max-w-2xl mx-auto my-4 animate-in fade-in duration-300">
        <ShieldAlert className="h-10 w-10 text-muted-foreground/70 mx-auto mb-3 stroke-[1.5]" />
        <h3 className="text-sm font-bold text-foreground">
          Workspace Belum Terisi
        </h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto leading-relaxed">
          Belum ada berkas yang diunggah ke ruang kerja ini. Silakan unggah file
          di dashboard untuk memulai pelacakan integritas kriptografis.
        </p>
      </div>
    );
  }

  // Tentukan warna dinamis berdasarkan skor integritas workspace
  let progressColorClass = "bg-emerald-500";
  let textColorClass = "text-emerald-400";
  let bgGradientClass = "from-emerald-500/5 to-transparent";

  if (integrityScore < 85) {
    progressColorClass = "bg-destructive";
    textColorClass = "text-destructive";
    bgGradientClass = "from-destructive/5 to-transparent";
  } else if (integrityScore < 95) {
    progressColorClass = "bg-amber-500";
    textColorClass = "text-amber-400";
    bgGradientClass = "from-amber-500/5 to-transparent";
  }

  return (
    <div className="space-y-4 animate-in fade-in-50 duration-200">
      {/* 4 GRID KPI STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <VerificationStatCard
          title="Total Files"
          value={totalFiles}
          description="Berkas tersimpan di workspace"
          icon={Files}
          iconColorClass="text-blue-400"
        />
        <VerificationStatCard
          title="Verified"
          value={verified}
          description="Proof tervalidasi on-chain"
          icon={ShieldCheck}
          iconColorClass="text-emerald-400"
          borderColorClass="hover:border-emerald-500/20"
        />
        <VerificationStatCard
          title="Pending"
          value={pending}
          description="Menunggu antrean validator"
          icon={Clock3}
          iconColorClass="text-amber-400"
          borderColorClass="hover:border-amber-500/20"
        />
        <VerificationStatCard
          title="Failed"
          value={failed}
          description="Kegagalan verifikasi jangkar"
          icon={AlertTriangle}
          iconColorClass="text-destructive"
          borderColorClass="hover:border-destructive/20"
        />
      </div>

      {/* BIG PREMIUM INTEGRITY PROGRESS CARD */}
      <div
        className={`p-5 bg-gradient-to-r ${bgGradientClass} bg-card/40 border border-border/60 rounded-sm shadow-xs space-y-3`}
      >
        <div className="flex items-baseline justify-between">
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-foreground">
              Workspace Verification Integrity
            </h4>
            <p className="text-xs text-muted-foreground">
              {verified} dari {totalFiles} file berhasil diamankan secara
              kriptografis.
            </p>
          </div>

          <div className="text-right">
            <span
              className={`text-2xl font-black tracking-tight ${textColorClass}`}
            >
              {integrityScore}%
            </span>
            <span className="text-[10px] font-bold block uppercase tracking-wider text-muted-foreground/80">
              [{integrityLabel}]
            </span>
          </div>
        </div>

        {/* Custom Progress Bar Native CSS & Tailwind */}
        <div className="w-full h-2 bg-muted border border-border/40 rounded-full overflow-hidden">
          <div
            className={`h-full ${progressColorClass} transition-all duration-500 ease-out`}
            style={{ width: `${integrityScore}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// 🌟 SKELETON LOADER COMPONENT (Anti-Flickering Dashboard SaaS)
export function VerificationSummarySkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-24 bg-muted/50 border border-border/40 rounded-sm"
          />
        ))}
      </div>
      {/* Big progress bar card skeleton */}
      <div className="h-24 bg-muted/40 border border-border/40 rounded-sm" />
    </div>
  );
}
