"use client";

import { useState } from "react";
import { useWorkspaceQuery } from "../hooks/use-workspace-query";
import { Dropzone } from "@/features/upload/components/dropzone";
import { Loader2, HardDrive, Users, FileIcon, Grid, List } from "lucide-react";

interface WorkspaceDashboardProps {
  workspaceId: string;
}

export function WorkspaceDashboard({ workspaceId }: WorkspaceDashboardProps) {
  // State untuk toggle tampilan (Grid vs Table) nanti di Step 5
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  // Panggil single source of truth dari TanStack Hook
  const { data, isLoading, error } = useWorkspaceQuery(workspaceId);

  // 1. Handling Loading State
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-sm text-gray-400 font-mono animate-pulse">
          Synchronizing decentralized state...
        </p>
      </div>
    );
  }

  // 2. Handling Error State
  if (error || !data) {
    return (
      <div className="p-6 border border-red-900/50 bg-red-950/20 rounded-xl max-w-2xl mx-auto mt-12 text-center">
        <h3 className="text-red-400 font-semibold text-lg">
          Gagal Memuat Workspace
        </h3>
        <p className="text-gray-400 text-sm mt-1">
          {error instanceof Error
            ? error.message
            : "Pastikan ID Workspace benar atau Anda memiliki hak akses."}
        </p>
      </div>
    );
  }

  // Destrukturisasi data hasil payload terpadu
  const { workspace, files, members } = data;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* SECTION INFO: Metadata Workspace */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between p-6 bg-gray-900/30 border border-gray-800 rounded-2xl gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">{workspace.name}</h1>
          <p className="text-xs text-gray-500 font-mono mt-1">
            Owner: {workspace.owner_address}
          </p>
        </div>
        <div className="flex items-center space-x-6 shrink-0 bg-gray-900/60 px-4 py-2.5 rounded-xl border border-gray-800/80">
          <div className="flex items-center space-x-2">
            <HardDrive className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-300 font-medium">
              {files.length} Files
            </span>
          </div>
          <div className="h-4 w-[1px] bg-gray-800" />
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-300 font-medium">
              {members.length} Members
            </span>
          </div>
        </div>
      </div>

      {/* SECTION CORE: Upload Zone (Dropzone) */}
      <div className="bg-gray-900/20 p-6 rounded-2xl border border-gray-800/60">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-300 tracking-wide uppercase">
            Decentralized Storage Layer
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            File yang Anda jatuhkan di sini akan langsung di-stream ke Walrus
            Protocol.
          </p>
        </div>
        <Dropzone />
      </div>

      {/* SECTION EXPLORER: Toolbar & List Rendering */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <h3 className="font-semibold text-gray-200">File Explorer</h3>

          {/* View Mode Switcher Minimalis */}
          <div className="flex items-center bg-gray-900 border border-gray-800 p-1 rounded-lg space-x-1">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition ${viewMode === "list" ? "bg-gray-800 text-blue-400" : "text-gray-500 hover:text-gray-300"}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition ${viewMode === "grid" ? "bg-gray-800 text-blue-400" : "text-gray-500 hover:text-gray-300"}`}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Conditional Rendering untuk Empty State */}
        {files.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-800 rounded-2xl bg-gray-900/10">
            <FileIcon className="w-12 h-12 text-gray-600 mx-auto stroke-[1.5]" />
            <h4 className="text-gray-400 font-medium mt-4">Workspace Kosong</h4>
            <p className="text-gray-500 text-xs mt-1 max-w-xs mx-auto">
              Belum ada file terdesentralisasi yang diindeks di dalam workspace
              ini.
            </p>
          </div>
        ) : (
          /* TEMPORARY RENDERER (Lifecycle Check): Memastikan Data Mengalir Tanpa Crash */
          <div className="bg-gray-900/40 border border-gray-800 rounded-xl divide-y divide-gray-800/60">
            {files.map((file) => (
              <div
                key={file.id}
                className="p-4 flex items-center justify-between hover:bg-gray-900/80 transition group"
              >
                <div className="flex items-center space-x-4 min-w-0">
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg shrink-0">
                    <FileIcon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate group-hover:text-blue-400 transition">
                      {file.file_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 font-mono truncate">
                      Blob ID: {file.blob_id}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-gray-500 font-mono hidden sm:block shrink-0 pl-4">
                  {new Date(file.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
