"use client";

import { use } from "react";
import { useWorkspaceVerifications } from "@/features/proof/hooks/use-workspace-verification";
import {
  VerificationHeader,
  VerificationHeaderSkeleton,
} from "@/features/proof/components/verification-header"; // 🌟 SEKARANG IMPORT COMPONENT ASLI
import {
  VerificationSummary,
  VerificationSummarySkeleton,
} from "@/features/proof/components/verification-summary";
import {
  VerificationHealth,
  VerificationHealthSkeleton,
} from "@/features/proof/components/verification-health";
import {
  VerificationTable,
  VerificationTableSkeleton,
} from "@/features/proof/components/verification-table";
import { AlertTriangle } from "lucide-react";
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

  // 1. Ambil data dengan fungsionalitas destruktur penuh (termasuk trigger sinkronisasi ulang)
  const {
    data,
    isLoading,
    error,
    refetch, // 🌟 FUNGSI BAWAAN RE-QUERY
    isFetching, // 🌟 STATE DETEKSI BACKGROUND FETCHING
  } = useWorkspaceVerifications(slug);

  // Aksi interaktif Dropdown Table
  const handleReVerify = (file: WorkspaceFile) => {
    console.log("🔄 Memicu re-verifikasi untuk berkas ID:", file.id);
  };

  const handleViewProof = (file: WorkspaceFile) => {
    console.log("🔍 Membuka panel bukti enkripsi untuk berkas ID:", file.id);
  };

  // 2. LOADING STATE: Sekuensial skeleton dari tingkat teratas hingga terdalam
  if (isLoading) {
    return (
      <div className="space-y-6 p-6 max-w-7xl mx-auto">
        <VerificationHeaderSkeleton />
        <VerificationSummarySkeleton />
        <VerificationHealthSkeleton />
        <div className="pt-2">
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

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto animate-in fade-in-50 duration-300">
      {/* SECTION 1: HEADER HALAMAN (Orientation Layer wired up to TanStack Query) */}
      <VerificationHeader
        workspaceName={data.meta.workspaceName}
        onRefresh={refetch}
        isRefreshing={isFetching}
      />

      {/* SECTION 2: SUMMARY CARDS (Raw Statistics) */}
      <VerificationSummary stats={data.summary} />

      {/* SECTION 3: INTEGRITY HEALTH CARD (Insight Analysis Dashboard) */}
      <VerificationHealth
        totalFiles={data.summary.totalFiles}
        verifiedFiles={data.summary.verified}
        pendingFiles={data.summary.pending}
        failedFiles={data.summary.failed}
      />

      {/* SECTION 4: AUDIT LOG TIMELINE (Data Exploration & Table Trails) */}
      <div className="space-y-3 pt-2">
        <div>
          <h3 className="text-sm font-bold text-foreground">
            Verification History
          </h3>
          <p className="text-xs text-muted-foreground">
            Daftar lengkap berkas yang telah dikunci ke dalam jangkar
            kriptografis on-chain.
          </p>
        </div>

        <VerificationTable
          files={data.history}
          onReVerify={handleReVerify}
          onViewProof={handleViewProof}
        />
      </div>
    </div>
  );
}
