"use client";

import { useState, useMemo } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Loader2, Wallet } from "lucide-react";

// Hook & Store
import { useWorkspaces } from "@/features/workspace/hooks/use-workspaces";
import { useWorkspaceStore } from "@/features/workspace/store/workspace-store";

// UI Components
import { WalletConnectButton } from "@/features/auth/components/wallet-connect-btn";
import { WorkspaceList } from "@/features/workspace/components/workspace-list";
import { WorkspaceListEmpty } from "@/features/workspace/components/workspace-list-empty";
import { WorkspaceHubHero } from "@/features/workspace/components/hub/workspace-hub-hero";
import { WorkspaceHubToolbar } from "@/features/workspace/components/hub/workspace-hub-toolbar";

// Modals (Pastikan lu sudah punya komponen modal ini, atau buat mockupnya dulu)
// import { CreateWorkspaceModal } from "@/features/workspace/components/create-workspace-modal";
// import { JoinWorkspaceModal } from "@/features/workspace/components/join-workspace-modal";

export default function WorkspaceHubPage() {
  const account = useCurrentAccount();
  const {
    data: workspaces,
    isLoading,
    error,
  } = useWorkspaces(account?.address);

  // Zustand Modals State
  const {
    isCreateModalOpen,
    setCreateModalOpen,
    isJoinModalOpen,
    setJoinModalOpen,
  } = useWorkspaceStore();

  // Local Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Filter & Kalkulasi Data Runtime
  const filteredWorkspaces = useMemo(() => {
    if (!workspaces) return [];
    return workspaces.filter((ws) =>
      ws.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [workspaces, searchQuery]);

  // Kalkulasi agregat untuk Hero Stats
  const totalFiles =
    workspaces?.reduce((acc, ws) => acc + ws.totalFiles, 0) || 0;
  const totalMembers =
    workspaces?.reduce((acc, ws) => acc + ws.totalMembers, 0) || 0;

  // =========================================================================
  // STATE 1: WALLET DISCONNECTED STATE
  // =========================================================================
  if (!account) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto text-center px-4">
          <div className="p-4 bg-amber-500/10 rounded-full mb-4 border border-amber-500/20">
            <Wallet className="h-7 w-7 text-amber-400 animate-pulse" />
          </div>
          <h3 className="text-base font-bold text-foreground">
            Gerbang Kredensial Terkunci
          </h3>
          <p className="text-xs text-muted-foreground mt-1.5 mb-6 leading-relaxed">
            TrestoSpace memerlukan tanda tangan kriptografi dompet Anda untuk
            memetakan kepemilikan enkripsi data workspace.
          </p>
          <WalletConnectButton />
        </div>
      </div>
    );
  }

  // =========================================================================
  // LOGIKA LOADING
  // =========================================================================
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-7 w-7 text-primary animate-spin" />
          <p className="text-xs text-muted-foreground font-medium animate-pulse">
            Memuat manifes otorisasi ruang kerja...
          </p>
        </div>
      </div>
    );
  }

  const hasNoWorkspace = !workspaces || workspaces.length === 0;

  // =========================================================================
  // STATE 2 & 3: MAIN HUB DASHBOARD
  // =========================================================================
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 md:px-8 animate-in fade-in duration-300">
        {hasNoWorkspace ? (
          // STATE 2: EMPTY ONBOARDING
          <div className="mt-10">
            <WorkspaceListEmpty
              onCreateClick={() => setCreateModalOpen(true)}
            />
          </div>
        ) : (
          // STATE 3: HUB GRID LIST
          <>
            <WorkspaceHubHero
              totalWorkspaces={workspaces.length}
              totalFiles={totalFiles}
              totalMembers={totalMembers}
            />

            <WorkspaceHubToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onCreateClick={() => setCreateModalOpen(true)}
              onJoinClick={() => setJoinModalOpen(true)}
            />

            <WorkspaceList items={filteredWorkspaces} />
          </>
        )}
      </main>

      {/* =========================================================================
          GLOBAL MODAL PORTALS
         ========================================================================= */}

      {/* <CreateWorkspaceModal 
          open={isCreateModalOpen} 
          onOpenChange={setCreateModalOpen} 
        />
        
        <JoinWorkspaceModal 
          open={isJoinModalOpen} 
          onOpenChange={setJoinModalOpen} 
        /> 
      */}
    </div>
  );
}
