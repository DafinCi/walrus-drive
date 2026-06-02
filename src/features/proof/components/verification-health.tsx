"use client";

import {
  CheckCircle2,
  Activity,
  AlertTriangle,
  XCircle,
  ShieldAlert,
  AlertOctagon,
} from "lucide-react";

interface VerificationHealthProps {
  totalFiles: number;
  verifiedFiles: number;
  pendingFiles: number;
  failedFiles: number;
}

export function VerificationHealth({
  totalFiles,
  verifiedFiles,
  pendingFiles,
  failedFiles,
}: VerificationHealthProps) {
  // 🌟 EMPTY STATE MURNI: Jika total file 0, stop di sini.
  if (totalFiles === 0) {
    return (
      <div className="p-8 bg-card/40 border border-dashed border-border rounded-lg text-center flex flex-col items-center justify-center animate-in fade-in duration-300">
        <div className="p-3 bg-muted/50 rounded-full mb-4">
          <ShieldAlert className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-base font-bold text-foreground">
          Belum Ada Berkas yang Diunggah
        </h3>
        <p className="text-sm text-muted-foreground max-w-md mt-1">
          Unggah berkas pertama Anda ke workspace ini untuk mulai membangun dan
          melacak jejak verifikasi kriptografis on-chain.
        </p>
      </div>
    );
  }

  // 🌟 ENGINE PERHITUNGAN: Paling jujur, verified / total
  const score = Math.round((verifiedFiles / totalFiles) * 100);

  // 🌟 PENENTUAN INSIGHT LEVEL
  let level = "Critical";
  let message = "Verification health is low. Immediate review recommended.";
  let progressColor = "bg-destructive";
  let textColor = "text-destructive";
  let Icon = XCircle;

  if (score >= 95) {
    level = "Excellent";
    message =
      "All critical files are verified. Workspace integrity is excellent.";
    progressColor = "bg-emerald-500";
    textColor = "text-emerald-400";
    Icon = CheckCircle2;
  } else if (score >= 80) {
    level = "Good";
    message = "Most files are verified. No immediate action required.";
    progressColor = "bg-primary"; // Memakai warna primary ungu dari OKLCH lu
    textColor = "text-primary";
    Icon = Activity;
  } else if (score >= 60) {
    level = "Needs Attention";
    message = "Several files require verification. Review pending uploads.";
    progressColor = "bg-amber-500";
    textColor = "text-amber-400";
    Icon = AlertTriangle;
  }

  return (
    <div className="flex flex-col border border-border/80 bg-card rounded-sm shadow-xs overflow-hidden animate-in fade-in-50 duration-300">
      <div className="p-6 md:p-8 space-y-6">
        {/* HEADER: TITLE & BIG SCORE */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Workspace Integrity Health
            </h2>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Icon className={`h-4 w-4 ${textColor}`} />
              <span className="font-semibold text-foreground/90">{level}</span>
              <span>— {message}</span>
            </p>
          </div>
          <div className="text-right">
            <span
              className={`text-4xl md:text-5xl font-heading tracking-tighter ${textColor}`}
            >
              {score}%
            </span>
          </div>
        </div>

        {/* PROGRESS BAR SHADCN STYLE (Native CSS) */}
        <div className="relative w-full h-2.5 bg-muted rounded-full overflow-hidden border border-border/50">
          <div
            className={`absolute top-0 left-0 h-full ${progressColor} transition-all duration-1000 ease-out`}
            style={{ width: `${score}%` }}
          />
        </div>

        {/* MINI STATS DETAIL */}
        <div className="flex flex-wrap items-center gap-6 pt-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-sm font-medium text-foreground">
              {verifiedFiles} Verified
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-sm font-medium text-muted-foreground">
              {pendingFiles} Pending
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-destructive" />
            <span className="text-sm font-medium text-muted-foreground">
              {failedFiles} Failed
            </span>
          </div>
        </div>
      </div>

      {/* 🚨 FAILED HIGHLIGHT: Hanya muncul jika ada file gagal */}
      {failedFiles > 0 && (
        <div className="bg-destructive/10 border-t border-destructive/20 p-4 px-6 flex items-start gap-3">
          <AlertOctagon className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-destructive">
              {failedFiles} files failed verification
            </h4>
            <p className="text-xs text-destructive/80 mt-0.5">
              Berkas-berkas ini gagal diverifikasi di jaringan. Segera tinjau
              ulang atau lakukan re-verifikasi melalui tabel di bawah.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// 🌟 SKELETON LOADER
export function VerificationHealthSkeleton() {
  return (
    <div className="flex flex-col border border-border/80 bg-card rounded-xl shadow-xs overflow-hidden animate-pulse">
      <div className="p-6 md:p-8 space-y-6">
        <div className="flex justify-between items-end gap-4">
          <div className="space-y-3 w-full max-w-sm">
            <div className="h-6 w-48 bg-muted rounded-sm" />
            <div className="h-4 w-72 bg-muted/60 rounded-sm" />
          </div>
          <div className="h-12 w-24 bg-muted rounded-md" />
        </div>
        <div className="h-2.5 w-full bg-muted rounded-full" />
        <div className="flex gap-6 pt-2">
          <div className="h-4 w-24 bg-muted/60 rounded-sm" />
          <div className="h-4 w-24 bg-muted/60 rounded-sm" />
          <div className="h-4 w-24 bg-muted/60 rounded-sm" />
        </div>
      </div>
    </div>
  );
}
