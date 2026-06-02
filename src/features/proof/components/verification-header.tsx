"use client";

import { ShieldCheck, RotateCw, Download, MoreHorizontal } from "lucide-react";

interface VerificationHeaderProps {
  workspaceName: string;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function VerificationHeader({
  workspaceName,
  onRefresh,
  isRefreshing = false,
}: VerificationHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-border/40 pb-5 animate-in fade-in-50 duration-200">
      {/* LEFT SIDE: KONTEN ORIENTASI & BADGE WORKSPACE */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="p-1.5 bg-primary/10 text-primary rounded-sm shrink-0">
            <ShieldCheck className="h-5 w-5 stroke-[2]" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground font-heading">
            Verification Center
          </h1>

          {/* Workspace Identification Badge */}
          <span className="inline-flex items-center text-[11px] font-bold bg-muted/60 text-muted-foreground border border-border/60 px-2 py-0.5 rounded-sm select-none">
            Workspace: {workspaceName.toLowerCase().replace(/\s+/g, "-")}
          </span>
        </div>

        <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed pl-0 md:pl-9">
          Monitor file integrity, proof status, and verification history across
          your workspace. Seluruh data terikat langsung ke dalam jangkar
          kriptografis publik secara transparan.
        </p>
      </div>

      {/* RIGHT SIDE: INTERACTIVE ACTIONS ROW (FUTURE-PROOFED) */}
      <div className="flex items-center gap-2 pl-0 md:pl-9 md:pl-0 justify-start md:justify-end shrink-0 w-full md:w-auto">
        {/* ACTION MAIN: REFRESH TRIGGER */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center justify-center gap-1.5 bg-secondary text-secondary-foreground border border-border/80 rounded-sm px-3 py-1.5 text-xs font-semibold hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer shadow-xs w-full sm:w-auto"
        >
          <RotateCw
            className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-primary" : "text-muted-foreground"}`}
          />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>

        {/* FUTURE SLOT 1: EXPORT DATA (PRE-STYLED PLACEHOLDER) */}
        <button
          disabled
          title="Tersedia di versi Enterprise"
          className="opacity-40 hidden sm:inline-flex items-center justify-center gap-1.5 bg-transparent text-muted-foreground border border-border border-dashed rounded-sm px-3 py-1.5 text-xs font-semibold select-none"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </button>

        {/* FUTURE SLOT 2: MORE CONTEXT DROPDOWN MENU TRIGGER */}
        <button
          disabled
          className="opacity-40 p-1.5 bg-secondary text-muted-foreground border border-border/80 rounded-sm hover:bg-accent transition-all cursor-not-allowed hidden sm:block"
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

// 🌟 INTEGRATED SKELETON HEADER
export function VerificationHeaderSkeleton() {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-border/40 pb-5 animate-pulse">
      <div className="space-y-3 w-full max-w-xl">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 bg-muted rounded-sm" />
          <div className="h-6 w-44 bg-muted rounded-sm" />
          <div className="h-5 w-32 bg-muted/60 rounded-sm" />
        </div>
        <div className="h-4 w-full bg-muted/40 rounded-sm" />
      </div>
      <div className="h-8 w-24 bg-muted rounded-sm shrink-0 w-full sm:w-24" />
    </div>
  );
}
