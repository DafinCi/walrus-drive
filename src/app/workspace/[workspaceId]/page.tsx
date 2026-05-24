// src/app/workspace/[workspaceId]/page.tsx
import { supabaseAdmin } from "@/services/supabase/admin";
import { Dropzone } from "@/features/upload/components/dropzone";
import { HardDrive, FileIcon, ExternalLink } from "lucide-react";

interface WorkspacePageProps {
  params: {
    workspaceId: string;
  };
}

// Fungsi untuk mengambil data file dari Supabase berdasarkan Workspace ID
async function getWorkspaceFiles(workspaceId: string) {
  const { data, error } = await supabaseAdmin
    .from("files")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal mengambil data file:", error);
    return [];
  }
  return data;
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  // Sesuai prinsip Next.js App Router, params di-unwrap langsung
  const { workspaceId } = await params;
  const files = await getWorkspaceFiles(workspaceId);

  // Helper untuk konversi ukuran byte ke MB/KB yang rapi
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Dashboard */}
        <div className="flex items-center space-x-3 border-b border-gray-800 pb-5">
          <HardDrive className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Decentralized Workspace
            </h1>
            <p className="text-sm text-gray-400 font-mono text-xs">
              ID: {workspaceId}
            </p>
          </div>
        </div>

        {/* Zona Upload (Dropzone Lu) */}
        <div className="bg-gray-900/40 p-6 rounded-xl border border-gray-800">
          <h2 className="text-lg font-semibold mb-4 text-gray-200">
            Upload File Baru ke Walrus
          </h2>
          <Dropzone />
        </div>

        {/* Tampilan Retrieval List File (Google Drive Layer) */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-200">
            Daftar File di Workspace Ini
          </h2>

          {files.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-800 rounded-xl bg-gray-900/20">
              <p className="text-gray-500 text-sm">
                Belum ada file di workspace ini. Silakan drag & drop file di
                atas!
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
                        Size: {formatSize(file.file_size)} • Type:{" "}
                        {file.mime_type}
                      </p>
                      <p className="text-[10px] text-blue-400/80 font-mono truncate mt-1">
                        Blob ID: {file.blob_id}
                      </p>
                    </div>
                  </div>

                  {/* Tombol Aksi Buka via Walrus Aggregator Resmi */}
                  <a
                    href={`https://aggregator.walrus-testnet.walrus.space/v1/blobs/${file.blob_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs font-medium rounded-lg text-gray-300 transition shrink-0"
                  >
                    <span>Buka File</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
