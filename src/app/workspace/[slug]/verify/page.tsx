"use client";

import { use } from "react"; // 🌟 TAMBAHAN: Import 'use' untuk unwrap Promise
import { useWorkspaceVerifications } from "@/features/proof/hooks/use-workspace-verification";
import {
  VerificationSummary,
  VerificationSummarySkeleton,
} from "@/features/proof/components/verification-summary";
import { ShieldCheck, AlertTriangle } from "lucide-react";

interface VerificationPageProps {
  params: Promise<{
    slug: string;
  }>; // 🌟 DISESUAIKAN: params sekarang bertipe Promise
}

export default function VerificationCenterPage({
  params,
}: VerificationPageProps) {
  // 🌟 DISESUAIKAN: Unwrap params menggunakan React.use() sebelum mengakses propertinya
  const unwrappedParams = use(params);
  const slug = unwrappedParams.slug;

  // 1. Konsumsi single-fetch API via TanStack Query
  const { data, isLoading, error } = useWorkspaceVerifications(slug);

  // 2. LOADING STATE: Menampilkan Skeleton Loader Premium
  if (isLoading) {
    return (
      <div className="space-y-6 p-6 max-w-7xl mx-auto">
        <PageHeaderSkeleton />
        <VerificationSummarySkeleton />
      </div>
    );
  }

  // 3. ERROR STATE: Penanganan jika API jebol atau slug typo
  if (error || !data || !data.success) {
    return (
      <div className="p-6 max-w-md mx-auto mt-20 text-center border border-destructive/20 bg-destructive/5 rounded-sm">
        <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
        <h3 className="text-sm font-bold text-foreground">
          Gagal Memuat Data Audit
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          {error?.message ||
            "Terjadi kesalahan internal saat menarik metrik integritas."}
        </p>
      </div>
    );
  }

  // 4. MAIN RENDER
  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto animate-in fade-in-50 duration-300">
      {/* Page Header Component */}
      <PageHeader workspaceName={data.meta.workspaceName} />

      {/* Summary KPI Cards & Progress Bar */}
      <VerificationSummary stats={data.summary} />
    </div>
  );
}

// ─── SUB COMPONENT: PAGE HEADER ──────────────────────────────────────────
function PageHeader({ workspaceName }: { workspaceName: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border/40 pb-5">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-primary/10 text-primary rounded-xs">
          <ShieldCheck className="h-5 w-5 stroke-[2]" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Workspace Integrity Center
        </h1>
      </div>
      <p className="text-xs text-muted-foreground pl-9">
        Memantau kepatuhan data, validasi enkripsi on-chain, dan kesehatan
        kriptografis untuk ruang kerja{" "}
        <span className="font-semibold text-foreground">{workspaceName}</span>.
      </p>
    </div>
  );
}

// ─── SUB COMPONENT: HEADER SKELETON ──────────────────────────────────────
function PageHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-2 border-b border-border/40 pb-5 animate-pulse">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 bg-muted rounded-xs" />
        <div className="h-6 w-52 bg-muted rounded-sm" />
      </div>
      <div className="h-4 w-96 bg-muted/70 rounded-sm ml-10" />
    </div>
  );
}
