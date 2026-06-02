"use client";

import { use } from "react";
import { useWorkspaceVerifications } from "@/features/proof/hooks/use-workspace-verification";
import {
  VerificationSummary,
  VerificationSummarySkeleton,
} from "@/features/proof/components/verification-summary";
import {
  VerificationTable,
  VerificationTableSkeleton,
} from "@/features/proof/components/verification-table"; // 🌟 TAMBAHAN: Import komponen tabel
import { ShieldCheck, AlertTriangle } from "lucide-react";
import { WorkspaceFile } from "@/features/workspace/types/workspace.types";

interface VerificationPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function VerificationCenterPage({
  params,
}: VerificationPageProps) {
  const unwrappedParams = use(params);
  const slug = unwrappedParams.slug;

  // 1. Konsumsi single-fetch API via TanStack Query (Mengambil summary & history sekaligus)
  const { data, isLoading, error } = useWorkspaceVerifications(slug);

  // 🌟 HANDLER STUB: Aksi ketika user klik "Re-Verify" di dropdown tabel
  const handleReVerify = (file: WorkspaceFile) => {
    console.log("🔄 Memicu re-verifikasi untuk berkas ID:", file.id);
    // Nanti di sini kita tinggal panggil mutasi dari useVerifyProof(slug)
  };

  // 🌟 HANDLER STUB: Aksi ketika user klik "View Proof" di dropdown tabel
  const handleViewProof = (file: WorkspaceFile) => {
    console.log(
      "🔍 Membuka modal detail enkripsi/proof untuk berkas ID:",
      file.id,
    );
    // Nanti di sini kita sambungkan ke state modal untuk memunculkan ProofModal
  };

  // 2. LOADING STATE: Menampilkan Skeleton Header, Summary, dan Tabel secara kompak
  if (isLoading) {
    return (
      <div className="space-y-6 p-6 max-w-7xl mx-auto">
        <PageHeaderSkeleton />
        <VerificationSummarySkeleton />
        <div className="pt-4">
          <VerificationTableSkeleton />
        </div>
      </div>
    );
  }

  // 3. ERROR STATE
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

  // 4. MAIN RENDER: Integrasi Penuh Berstruktur SaaS Premium
  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto animate-in fade-in-50 duration-300">
      {/* Page Header */}
      <PageHeader workspaceName={data.meta.workspaceName} />

      {/* Summary KPI Cards & Progress Bar */}
      <VerificationSummary stats={data.summary} />

      {/* Audit Trail Section */}
      <div className="space-y-2 pt-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">
            Verification History
          </h3>
          <p className="text-xs text-muted-foreground">
            Daftar lengkap berkas yang telah dikunci ke dalam jangkar
            kriptografis on-chain.
          </p>
        </div>

        {/* Core Audit Log Table */}
        <VerificationTable
          files={data.history}
          onReVerify={handleReVerify}
          onViewProof={handleViewProof}
        />
      </div>
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
        <span className="font-semibold text-foreground">"{workspaceName}"</span>
        .
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
