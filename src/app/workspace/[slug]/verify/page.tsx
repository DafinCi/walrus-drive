"use client";

import { use, useState } from "react"; // 🌟 Tambah useState
import { useWorkspaceVerifications } from "@/features/proof/hooks/use-workspace-verification";
import { useVerifyProof } from "@/features/proof/hooks/use-verify-proof";
import { toast } from "sonner";

import {
  VerificationHeader,
  VerificationHeaderSkeleton,
} from "@/features/proof/components/verification-header";
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
import { ProofModal } from "@/features/proof/components/proof-modal"; // 🌟 Import Modal Lu
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

  // 🌟 STATE UNTUK MODAL DETAIL PROOF
  const [selectedFile, setSelectedFile] = useState<WorkspaceFile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Jalur Utama Fetching Data
  const { data, isLoading, error, refetch, isFetching } =
    useWorkspaceVerifications(slug);

  // 2. Jalur Utama Eksekusi Mutasi Verifikasi
  const { mutate: verifyFile, isPending: isVerifying } = useVerifyProof(slug);

  // HANDLER: Klik Re-Verify di baris tabel
  const handleReVerify = (file: WorkspaceFile) => {
    if (isVerifying) {
      toast.warning("Sistem sedang memproses verifikasi berkas. Mohon tunggu.");
      return;
    }
    verifyFile({ fileId: file.id });
  };

  // 🌟 HANDLER: Klik View Proof di baris tabel
  const handleViewProof = (file: WorkspaceFile) => {
    setSelectedFile(file); // Set file yang mau diintip detailnya
    setIsModalOpen(true); // Buka popup-nya
  };

  // 3. LOADING STATE
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

  // 4. ERROR STATE
  if (error || !data || !data.success) {
    return (
      <div className="p-6 max-w-md mx-auto mt-20 text-center border border-destructive/20 bg-destructive/5 rounded-[6px]">
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
      {/* SECTION 1: HEADER HALAMAN */}
      <VerificationHeader
        workspaceName={data.meta.workspaceName}
        onRefresh={refetch}
        isRefreshing={isFetching}
      />

      {/* SECTION 2: SUMMARY CARDS */}
      <VerificationSummary stats={data.summary} />

      {/* SECTION 3: INTEGRITY HEALTH CARD */}
      <VerificationHealth
        totalFiles={data.summary.totalFiles}
        verifiedFiles={data.summary.verified}
        pendingFiles={data.summary.pending}
        failedFiles={data.summary.failed}
      />

      {/* SECTION 4: AUDIT LOG TIMELINE */}
      <div className="space-y-3 pt-2">
        <div>
          <h3 className="text-sm font-bold text-foreground font-heading uppercase tracking-tighter">
            Verification History
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
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

      {/* 🌟 OVERLAY: MODAL DETAIL PROOF */}
      <ProofModal
        file={selectedFile}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        slug={slug}
      />
    </div>
  );
}
