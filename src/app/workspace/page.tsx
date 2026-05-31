"use client";

import { useState, useMemo } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useRouter } from "next/navigation";
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

export default function WorkspaceHubPage() {
  const account = useCurrentAccount();
  const router = useRouter();

  // 1. CONSUME SORT PREFERENCE FROM ZUSTAND
  const { workspaceSort, setWorkspaceSort, setJoinModalOpen } =
    useWorkspaceStore();

  // 2. INJEKSIKAN PREFERENSI SORT KE DALAM HOOK QUERY
  const {
    data: workspaces,
    isLoading,
    error,
  } = useWorkspaces(account?.address, workspaceSort); // 🌟 DIUBAH: Mengirim parameter sort

  // Local Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Filter & Kalkulasi Data Runtime (Client-side Search)
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
  // RENDERING MATRIX (DISCONNECTED & LOADING STATES TETAP SAMA)
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

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 md:px-8 animate-in fade-in duration-300">
        {hasNoWorkspace ? (
          <div className="mt-10">
            <WorkspaceListEmpty
              onCreateClick={() => router.push("/workspace/create")}
            />
          </div>
        ) : (
          <>
            <WorkspaceHubHero
              totalWorkspaces={workspaces.length}
              totalFiles={totalFiles}
              totalMembers={totalMembers}
            />

            {/* 🌟 PERUBAHAN: Pasangkan props state & handler sorting */}
            <WorkspaceHubToolbar
              searchQuery={searchQuery}
              currentSort={workspaceSort}
              onSortChange={setWorkspaceSort}
              onSearchChange={setSearchQuery}
              onCreateClick={() => router.push("/workspace/create")}
              onJoinClick={() => setJoinModalOpen(true)}
            />

            <WorkspaceList items={filteredWorkspaces} />
          </>
        )}
      </main>
    </div>
  );
}
