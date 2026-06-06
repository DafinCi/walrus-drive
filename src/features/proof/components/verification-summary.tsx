"use client";

import { Files, ShieldCheck, Clock3, AlertTriangle } from "lucide-react";
import { VerificationStatCard } from "./verification-stat-card";

interface VerificationStats {
  totalFiles: number;
  verified: number;
  pending: number;
  failed: number;
}

interface VerificationSummaryProps {
  stats: VerificationStats;
}

export function VerificationSummary({ stats }: VerificationSummaryProps) {
  const { totalFiles, verified, pending, failed } = stats;

  return (
    <div className="animate-in fade-in-50 duration-200">
      {/* 4 GRID KPI STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <VerificationStatCard
          title="Total Files"
          value={totalFiles}
          description="File saved to workspace"
          icon={Files}
          iconColorClass="text-blue-400"
        />
        <VerificationStatCard
          title="Verified"
          value={verified}
          description="On-chain proof validated"
          icon={ShieldCheck}
          iconColorClass="text-emerald-400"
          borderColorClass="hover:border-emerald-500/20"
        />
        <VerificationStatCard
          title="Pending"
          value={pending}
          description="Waiting in validator queue"
          icon={Clock3}
          iconColorClass="text-amber-400"
          borderColorClass="hover:border-amber-500/20"
        />
        <VerificationStatCard
          title="Failed"
          value={failed}
          description="Failed to verify anchor"
          icon={AlertTriangle}
          iconColorClass="text-destructive"
          borderColorClass="hover:border-destructive/20"
        />
      </div>
    </div>
  );
}

// 🌟 SKELETON LOADER COMPONENT (Disesuaikan khusus untuk 4 grid saja)
export function VerificationSummarySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="h-24 bg-muted/50 border border-border/40 rounded-[6px]"
        />
      ))}
    </div>
  );
}
