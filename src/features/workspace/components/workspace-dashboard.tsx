"use client";

import { useWorkspaceQuery } from "../hooks/use-workspace-query";
import { Dropzone } from "@/features/upload/components/dropzone";
import { Loader2, FileIcon, ExternalLink } from "lucide-react";

export function WorkspaceDashboard({ workspaceId }: { workspaceId: string }) {
  const { data: files, isLoading, error } = useWorkspaceQuery(workspaceId);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-8">
      {/* Zona Upload */}
      <div className="bg-gray-900/40 p-6 rounded-xl border border-gray-800">
        <h2 className="text-lg font-semibold mb-4 text-gray-200">
          Upload File Baru
        </h2>
        <Dropzone />
      </div>

      {/* Zona Rendering File */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-200">Daftar File</h2>

        {isLoading ? (
          <div className="flex justify-center py-12 border border-gray-800 rounded-xl bg-gray-900/20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-red-400 p-4 bg-red-900/20 border border-red-900/50 rounded-xl">
            Gagal memuat file:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </div>
        ) : !files || files.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-800 rounded-xl bg-gray-900/20">
            <p className="text-gray-500 text-sm">
              Belum ada file di workspace ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-gray-700 transition-all"
              >
                <div className="flex items-center space-x-4 overflow-hidden pr-4">
                  <div className="p-2.5 bg-blue-500/10 rounded-lg text-blue-400 shrink-0">
                    <FileIcon className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-medium text-sm text-gray-200 truncate">
                      {file.file_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatSize(file.file_size)} • {file.mime_type}
                    </p>
                  </div>
                </div>
                <a
                  href={`https://aggregator.walrus-testnet.walrus.space/v1/blobs/${file.blob_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs font-medium rounded-lg text-gray-300 transition shrink-0"
                >
                  <span>Buka</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
