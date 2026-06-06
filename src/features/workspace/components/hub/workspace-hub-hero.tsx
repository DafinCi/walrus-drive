"use client";

import { Layers, FileText, Users } from "lucide-react";

interface WorkspaceHubHeroProps {
  totalWorkspaces: number;
  totalFiles: number;
  totalMembers: number;
}

export function WorkspaceHubHero({
  totalWorkspaces,
  totalFiles,
  totalMembers,
}: WorkspaceHubHeroProps) {
  return (
    <div className="flex flex-col gap-6 mb-8">
      {/* Bagian Sapaan */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your decentralized workspace securely on the Sui network.
        </p>
      </div>

      {/* Bagian Quick Stats (Metrik) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Stat 1 */}
        <div className="flex items-center gap-4 p-4 bg-card border border-border/60 rounded-[6px] shadow-sm">
          <div className="p-3 bg-primary/10 rounded-[6px]">
            <Layers className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground leading-none">
              {totalWorkspaces}
            </p>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              Total Workspaces
            </p>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="flex items-center gap-4 p-4 bg-card border border-border/60 rounded-[6px] shadow-sm">
          <div className="p-3 bg-blue-500/10 rounded-[6px]">
            <FileText className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground leading-none">
              {totalFiles}
            </p>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              File Encrypted
            </p>
          </div>
        </div>

        {/* Stat 3 (Sebagai ganti Storage karena belum ada API size, kita pakai Total Anggota Jaringan) */}
        <div className="flex items-center gap-4 p-4 bg-card border border-border/60 rounded-[6px] shadow-sm">
          <div className="p-3 bg-emerald-500/10 rounded-[6px]">
            <Users className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground leading-none">
              {totalMembers}
            </p>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              Total Collaborators
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
