"use client";

import { Suspense, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCurrentAccount } from "@mysten/dapp-kit";

// Import Lego Components Presentational
import { WorkspaceHeader } from "./workspace-header";
import { WorkspaceToolbar } from "./workspace-toolbar";
import { WorkspaceEmpty } from "./workspace-empty";
import { WorkspaceGrid } from "./workspace-grid";
import { WorkspaceTable } from "./workspace-table";
import { InviteModal } from "@/features/invite/components/invite-modal";
import { ProofModal } from "@/features/proof/components/proof-modal";

// Import Dropzone Core Upload Service
import { Dropzone } from "@/features/upload/components/dropzone";

// Import Single Source of Truth Query Hooks & UI Zustand Store
import { useWorkspaceQuery } from "../hooks/use-workspace-query";
import { useWorkspaceFiles } from "../hooks/use-workspace-files";
import { useWorkspaceStore } from "../store/workspace-store";
// 🌟 TAMBAHAN: Import tipe data tunggal agar sinkron
import { WorkspaceFile } from "@/features/workspace/types/workspace.types";

function DashboardContent({ slug }: { slug: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const account = useCurrentAccount();

  // 🌟 TAMBAHAN STATE UNTUK QUICK VERIFY MODAL
  const [selectedVerifyFile, setSelectedVerifyFile] =
    useState<WorkspaceFile | null>(null);

  // 1. CONSUME INTERACTION & SORT STATE FROM ZUSTAND STORE
  const {
    isUploadModalOpen,
    isInviteModalOpen,
    fileSort,
    setFileSort,
    setUploadModalOpen,
    setInviteModalOpen,
  } = useWorkspaceStore();

  // 2. CONSUME SERVER DATA STATES
  const {
    data: metaData,
    isLoading: isMetaLoading,
    error: metaError,
  } = useWorkspaceQuery(slug);

  const {
    data: rawFiles = [],
    isLoading: isFilesLoading,
    error: filesError,
  } = useWorkspaceFiles(slug, fileSort);

  // 3. READ & DERIVE URL SELECTION STATE
  const view = (searchParams.get("view") === "table" ? "table" : "grid") as
    | "grid"
    | "table";
  const searchQuery = searchParams.get("search") ?? "";

  // 4. SAFE DERIVE SUB-DATA
  const workspaceData = metaData?.workspace;
  const members = metaData?.members ?? [];

  const currentUserRole =
    members.find((m) => m.wallet_address === account?.address)?.role ??
    "member";

  const typedFiles = rawFiles as WorkspaceFile[];

  // 5. URL MUTATION HANDLER
  const handleViewChange = (newView: "grid" | "table") => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("view", newView);
    router.push(`${pathname}?${currentParams.toString()}`);
  };

  // 6. CLIENT-SIDE RUNTIME SEARCH FILTERING
  // 🌟 FIX 2: Sesuaikan filter pencarian menggunakan properti asli database 'file_name'
  const filteredFiles = typedFiles.filter((file) =>
    (file.file_name || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // =========================================================================
  // STATE RENDERING MATRIX
  // =========================================================================

  const isGlobalLoading = isMetaLoading || isFilesLoading;
  const hasGlobalError = metaError || filesError || !metaData || !workspaceData;

  if (isGlobalLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] gap-3">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground animate-pulse font-medium">
          Syncing workspace runtime architecture...
        </p>
      </div>
    );
  }

  if (hasGlobalError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] max-w-md mx-auto text-center p-6 border border-destructive/20 bg-destructive/5 rounded-[6px] shadow-xl">
        <AlertTriangle className="h-10 w-10 text-destructive mb-3" />
        <h3 className="text-lg font-bold text-foreground">
          Failed to access workspace command.
        </h3>
        <p className="text-sm text-muted-foreground mt-1 mb-5 leading-relaxed">
          Unable to load data from the API. Check your URL parameters or try
          reloading if the network is unstable.
        </p>
        <Button
          size="sm"
          onClick={() => window.location.reload()}
          className="cursor-pointer font-medium"
        >
          Try Reload
        </Button>
      </div>
    );
  }

  // 🌟 FIX 3: Cek kekosongan data langsung dari array utama
  const isEmpty = typedFiles.length === 0;

  return (
    <div className="flex flex-col w-full max-w-[1400px] mx-auto px-4 py-6 md:px-8 animate-in fade-in duration-300">
      <WorkspaceHeader
        workspaceName={workspaceData.name}
        totalFiles={typedFiles.length}
        totalMembers={members.length}
        userRole={currentUserRole}
        createdAt={workspaceData.created_at}
      />

      <WorkspaceToolbar
        workspaceId={workspaceData.id}
        view={view}
        currentSort={fileSort}
        onSortChange={setFileSort}
        onViewChange={handleViewChange}
        onUploadClick={() => setUploadModalOpen(true)}
        onInviteClick={() => setInviteModalOpen(true)}
      />

      <main className="flex-1 mt-2">
        {isEmpty ? (
          <WorkspaceEmpty workspaceId={workspaceData.id} />
        ) : view === "grid" ? (
          // 🌟 OPER FUNGSI SETTER KE GRID
          <WorkspaceGrid
            files={filteredFiles}
            onVerifyClick={setSelectedVerifyFile}
          />
        ) : (
          // 🌟 LAKUKAN HAL YANG SAMA UNTUK TABLE JIKA DIBUTUHKAN NANTI
          <WorkspaceTable
            files={filteredFiles}
            onVerifyClick={setSelectedVerifyFile}
          />
        )}
      </main>

      {/* GLOBAL MODAL PORTALS */}
      <Dialog open={isUploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="sm:max-w-xl bg-card border border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              Upload New File
            </DialogTitle>
          </DialogHeader>
          <div className="pt-2">
            {isUploadModalOpen && (
              <Dropzone workspaceId={workspaceData.id} autoOpen={true} />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <InviteModal
        open={isInviteModalOpen}
        onOpenChange={setInviteModalOpen}
        workspaceId={workspaceData.id}
      />

      <ProofModal
        file={selectedVerifyFile}
        isOpen={!!selectedVerifyFile}
        onOpenChange={(open) => !open && setSelectedVerifyFile(null)}
        slug={slug}
      />
    </div>
  );
}

// Composition Root Wrapper
export function WorkspaceDashboard({ slug }: { slug: string }) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[75vh]">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      }
    >
      <DashboardContent slug={slug} />
    </Suspense>
  );
}
