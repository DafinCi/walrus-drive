"use client";

import { Suspense } from "react";
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
import { useCurrentAccount } from "@mysten/dapp-kit";

// Import Lego Components Presentational
import { WorkspaceHeader } from "./workspace-header";
import { WorkspaceToolbar } from "./workspace-toolbar";
import { WorkspaceEmpty } from "./workspace-empty";
import { WorkspaceGrid } from "./workspace-grid";
import { WorkspaceTable } from "./workspace-table";
import { InviteModal } from "@/features/invite/components/invite-modal";

// Import Dropzone Core Upload Service
import { Dropzone } from "@/features/upload/components/dropzone";

// Import Single Source of Truth Query Hook & UI Zustand Store
import { useWorkspaceQuery } from "../hooks/use-workspace-query";
import { useWorkspaceStore } from "../store/workspace-store";

function DashboardContent({ slug }: { slug: string }) {
  // 🌟 PERBAIKAN: Menerima prop slug
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const account = useCurrentAccount();

  // 1. CONSUME INTERACTION STATE FROM ZUSTAND STORE
  const {
    isUploadModalOpen,
    isInviteModalOpen,
    setUploadModalOpen,
    setInviteModalOpen,
  } = useWorkspaceStore();

  // 2. CONSUME SERVER DATA STATE FROM TANSTACK QUERY
  // 🌟 PERBAIKAN: Fetch data menggunakan slug
  const { data, isLoading, error } = useWorkspaceQuery(slug);

  // 3. READ & DERIVE URL SELECTION STATE
  const view = (searchParams.get("view") === "table" ? "table" : "grid") as
    | "grid"
    | "table";
  const searchQuery = searchParams.get("search") ?? "";

  // 4. SAFE DERIVE SUB-DATA SESUAI TIPE WorkspaceFullPayload
  const workspaceData = data?.workspace;
  const rawFiles = data?.files ?? [];
  const members = data?.members ?? [];

  // 3. FIX ERROR: Ekstrak role spesifik milik user yang sedang buka halaman ini
  const currentUserRole =
    members.find((m) => m.wallet_address === account?.address)?.role ??
    "member";

  // 5. DATA MAPPING: Ubah snake_case (DB) ke camelCase (UI Component)
  const uiFiles = rawFiles.map((f) => ({
    id: f.id,
    blobId: f.blob_id,
    name: f.file_name,
    mimeType: f.mime_type,
    size: f.file_size,
    uploader: f.wallet_address,
    createdAt: f.created_at,
  }));

  // 6. URL MUTATION HANDLER
  const handleViewChange = (newView: "grid" | "table") => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("view", newView);
    router.push(`${pathname}?${currentParams.toString()}`);
  };

  // 7. DATA RUNTIME FILTERING (Reaktif terhadap pencarian URL global)
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
        userRole={currentUserRole}
        createdAt={workspaceData.created_at}
      />

      {/* SECTION LAYER 2: Action Bar Toolbar */}
      <WorkspaceToolbar
        view={view}
        onViewChange={handleViewChange}
        onUploadClick={() => setUploadModalOpen(true)}
        onInviteClick={() => setInviteModalOpen(true)}
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
          GLOBAL MODAL PORTALS (ORCHESTRATED BY ZUSTAND)
         ========================================================================= */}

      {/* Modal Upload */}
      <Dialog open={isUploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="sm:max-w-xl bg-card border border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              Unggah Berkas Baru
            </DialogTitle>
          </DialogHeader>
          <div className="pt-2">
            {/* 🌟 PENTING: Passing ID asli dari database, BUKAN slug, agar fungsi upload tidak error! */}
            <Dropzone workspaceId={workspaceData.id} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Invite */}
      {/* 🌟 Sama seperti dropzone, pastikan modal ini menerima ID jika ia melakukan query database internal */}
      <InviteModal
        open={isInviteModalOpen}
        onOpenChange={setInviteModalOpen}
        workspaceId={workspaceData.id}
      />
    </div>
  );
}

// Composition Root Wrapper
export function WorkspaceDashboard({ slug }: { slug: string }) {
  // 🌟 PERBAIKAN: Menerima dan meneruskan prop slug dari page.tsx
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
