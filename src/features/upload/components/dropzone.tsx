"use client";

import { useState, useCallback } from "react";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { executeWalrusUpload } from "../services/upload.service";
import { UploadStatus, WalrusUploadResult } from "../types/upload.types";
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export function Dropzone() {
  const queryClient = useQueryClient();
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction();
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progressText, setProgressText] = useState<string>("");
  const [errorText, setErrorText] = useState<string | null>(null);
  const [result, setResult] = useState<WalrusUploadResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const resetState = () => {
    setStatus("idle");
    setProgressText("");
    setErrorText(null);
    setResult(null);
  };

  const processFile = async (file: File) => {
    if (!account) {
      setErrorText("Connect wallet Anda terlebih dahulu.");
      setStatus("error");
      return;
    }

    resetState();
    setStatus("preparing");

    try {
      // Jalankan core upload service (Di dalamnya sudah termasuk hitung checksum & save ke DB)
      const uploadResult = await executeWalrusUpload({
        file,
        ownerAddress: account.address,
        workspaceId: workspaceId,
        signAndExecuteTransaction,
        suiClient,
        onProgress: (msg) => {
          setProgressText(msg);
          if (
            msg.toLowerCase().includes("approve") ||
            msg.toLowerCase().includes("tanda tangan")
          ) {
            setStatus("action_required");
          } else {
            setStatus("processing");
          }
        },
      });

      // 🔥 FIX 1: COCOKKAN QUERY KEY DENGAN HOOK TANSTACK KITA
      // Ini memicu TanStack Query menarik ulang bundle data komplit (workspace, files, members)
      queryClient.invalidateQueries({
        queryKey: ["workspace-detail", workspaceId],
      });

      setResult(uploadResult);
      setStatus("success");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorText(err.message || "Terjadi kesalahan tidak terduga.");
      } else {
        setErrorText("Terjadi kesalahan tidak terduga.");
      }
      setStatus("error");
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (status === "processing" || status === "action_required") return;
      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
    [status, account, workspaceId],
  );

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const borderStyles = isDragging
    ? "border-blue-500 bg-blue-500/10"
    : status === "error"
      ? "border-red-500 bg-red-500/10"
      : status === "success"
        ? "border-green-500 bg-green-500/10"
        : "border-gray-600 bg-gray-900/50 hover:border-gray-400 hover:bg-gray-800/50";

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-all duration-200 ${borderStyles}`}
      >
        <input
          id="file-upload"
          type="file"
          onChange={onFileInput}
          className={`absolute inset-0 w-full h-full opacity-0 disabled:cursor-not-allowed ${
            status === "success" ? "hidden" : "cursor-pointer"
          }`}
          disabled={
            status === "processing" ||
            status === "action_required" ||
            status === "success" ||
            !account
          }
          title="Pilih file untuk diupload"
        />

        <div className="flex flex-col items-center space-y-3 pointer-events-none text-center">
          {status === "idle" && (
            <>
              <UploadCloud className="w-10 h-10 text-gray-400" />
              <div>
                <p className="font-semibold text-white">
                  Drag & drop file Anda ke sini
                </p>
                <p className="text-sm text-gray-400">
                  Atau klik untuk memilih file dari komputer
                </p>
              </div>
            </>
          )}

          {(status === "preparing" ||
            status === "processing" ||
            status === "action_required") && (
            <>
              <Loader2
                className={`w-10 h-10 ${status === "action_required" ? "text-yellow-400" : "text-blue-500"} animate-spin`}
              />
              <div>
                <p
                  className={`font-semibold ${status === "action_required" ? "text-yellow-400 animate-pulse" : "text-blue-400"}`}
                >
                  {status === "action_required"
                    ? "Menunggu Konfirmasi Wallet..."
                    : "Memproses..."}
                </p>
                <p className="text-xs text-gray-400 mt-2 max-w-xs">
                  {progressText}
                </p>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <AlertCircle className="w-10 h-10 text-red-500" />
              <div>
                <p className="font-semibold text-red-400">Upload Gagal</p>
                <p className="text-xs text-red-300 mt-2 max-w-xs">
                  {errorText}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  resetState();
                }}
                className="mt-4 px-4 py-2 text-xs bg-gray-800 text-white rounded pointer-events-auto hover:bg-gray-700"
              >
                Coba Lagi
              </button>
            </>
          )}

          {status === "success" && result && (
            <>
              <CheckCircle2 className="w-10 h-10 text-green-500" />
              <div>
                <p className="font-semibold text-green-400">Upload Sukses!</p>
                <div className="mt-3 p-3 bg-black/50 rounded-lg text-left text-xs space-y-1 overflow-hidden relative z-10 pointer-events-auto">
                  <p className="text-gray-400 truncate">
                    <span className="font-bold">File:</span>{" "}
                    {result.metadata.name}
                  </p>
                  <p className="text-blue-400 truncate">
                    <span className="font-bold text-gray-400">Blob ID:</span>{" "}
                    {result.blobId}
                  </p>
                  <p className="text-green-400 truncate">
                    <span className="font-bold text-gray-400">Checksum:</span>{" "}
                    {result.metadata.checksum.substring(0, 15)}...
                  </p>

                  <a
                    href={`https://aggregator.walrus-testnet.walrus.space/v1/blobs/${result.blobId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block mt-2 text-blue-400 underline hover:text-blue-300 font-mono"
                    onClick={(e) => e.stopPropagation()}
                  >
                    🔗 Buka File di Walrus Aggregator
                  </a>

                  {result.metadata.type.startsWith("image/") && (
                    <div className="mt-4 p-2 bg-black border border-gray-800 rounded-lg">
                      <p className="text-gray-500 mb-2 font-mono">
                        Live Preview:
                      </p>
                      <img
                        src={`https://aggregator.walrus-testnet.walrus.space/v1/blobs/${result.blobId}`}
                        alt="Walrus Blob Preview"
                        className="w-full h-auto max-h-48 object-contain rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  resetState();
                }}
                className="mt-4 px-4 py-2 text-xs bg-gray-800 text-white rounded pointer-events-auto hover:bg-gray-700 relative z-10"
              >
                Upload File Lain
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
