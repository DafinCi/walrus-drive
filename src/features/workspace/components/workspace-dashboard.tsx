"use client";

import { useState, Suspense } from "react";
import {
  useParams,
  useRouter,
  usePathname,
  useSearchParams,
} from "next/navigation";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Import Lego Components Presentational
import { WorkspaceHeader } from "./workspace-header";
import { WorkspaceToolbar } from "./workspace-toolbar";
import { WorkspaceEmpty } from "./workspace-empty";
import { WorkspaceGrid } from "./workspace-grid";
import { WorkspaceTable } from "./workspace-table";
import { InviteModal } from "@/features/invite/components/invite-modal";

// Import Dropzone Core Upload Service
import { Dropzone } from "@/features/upload/components/dropzone";

// Import Single Source of Truth Query Hook
import { useWorkspaceQuery } from "../hooks/use-workspace-query";

function DashboardContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();

  const workspaceId = params.workspaceId as string;

  // State Lokal Pengendali Modals Portal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // 1. CONSUME DATA UTAMA NATIVE FROM TANSTACK QUERY
  const { data, isLoading, error } = useWorkspaceQuery(workspaceId);

  // 2. READ & DERIVE URL SELECTION STATE
  const view = (searchParams.get("view") === "table" ? "table" : "grid") as
    | "grid"
    | "table";
  const searchQuery = searchParams.get("search") ?? "";

  // 3. SAFE DERIVE SUB-DATA SESUAI TIPE WorkspaceFullPayload
  const workspaceData = data?.workspace;
  const rawFiles = data?.files ?? [];
  const members = data?.members ?? [];

  // 4. DATA MAPPING: Ubah snake_case (DB) ke camelCase (UI Component)
  // Ini mencegah error di dalam FileCard dan FileRow
  const uiFiles = rawFiles.map((f) => ({
    id: f.id,
    blobId: f.blob_id,
    name: f.file_name,
    mimeType: f.mime_type,
    size: f.file_size,
    uploader: f.wallet_address,
    createdAt: f.created_at,
  }));

  // 5. URL MUTATION HANDLER
  const handleViewChange = (newView: "grid" | "table") => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("view", newView);
    router.push(`${pathname}?${currentParams.toString()}`);
  };

  // 6. DATA RUNTIME FILTERING (Reaktif terhadap pencarian URL global)
  const filteredFiles = uiFiles.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // =========================================================================
  // STATE RENDERING MATRIX
  // =========================================================================

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] gap-3">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground animate-pulse font-medium">
          Sinkronisasi arsitektur runtime workspace...
        </p>
      </div>
    );
  }

  if (error || !data || !workspaceData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] max-w-md mx-auto text-center p-6 border border-destructive/20 bg-destructive/5 rounded-2xl shadow-xl">
        <AlertTriangle className="h-10 w-10 text-destructive mb-3" />
        <h3 className="text-lg font-bold text-foreground">
          Akses Komando Workspace Gagal
        </h3>
        <p className="text-sm text-muted-foreground mt-1 mb-5 leading-relaxed">
          Gagal memuat data dari API. Pastikan parameter URL valid atau muat
          ulang jika terjadi kendala jaringan.
        </p>
        <Button
          size="sm"
          onClick={() => window.location.reload()}
          className="cursor-pointer font-medium"
        >
          Coba Muat Ulang
        </Button>
      </div>
    );
  }

  const isEmpty = uiFiles.length === 0;

  return (
    <div className="flex flex-col w-full max-w-[1400px] mx-auto px-4 py-6 md:px-8 animate-in fade-in duration-300">
      {/* SECTION LAYER 1: Header Informasi */}
      <WorkspaceHeader
        workspaceName={workspaceData.name}
        totalFiles={rawFiles.length}
        totalMembers={members.length}
        // Jika ada logic untuk cek current wallet address vs owner, bisa dimasukkan di sini.
        // Untuk sekarang default ke "member"
        userRole="member"
        createdAt={workspaceData.created_at}
      />

      {/* SECTION LAYER 2: Action Bar Toolbar */}
      <WorkspaceToolbar
        view={view}
        onViewChange={handleViewChange}
        onUploadClick={() => setIsUploadModalOpen(true)}
        onInviteClick={() => setIsInviteModalOpen(true)}
      />

      {/* SECTION LAYER 3: Dynamic Render Viewport */}
      <main className="flex-1 mt-2">
        {isEmpty ? (
          <WorkspaceEmpty />
        ) : view === "grid" ? (
          <WorkspaceGrid files={filteredFiles} />
        ) : (
          <WorkspaceTable files={filteredFiles} />
        )}
      </main>

      {/* =========================================================================
          GLOBAL MODAL PORTALS
         ========================================================================= */}

      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="sm:max-w-xl bg-card border border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              Unggah Berkas Baru
            </DialogTitle>
          </DialogHeader>
          <div className="pt-2">
            <Dropzone />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <InviteModal
          open={isInviteModalOpen}
          onOpenChange={setIsInviteModalOpen}
        />
        <DialogContent className="sm:max-w-md bg-card border border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              Undang Anggota Kolaborasi
            </DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Composition Root Wrapper
export function WorkspaceDashboard() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[75vh]">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
