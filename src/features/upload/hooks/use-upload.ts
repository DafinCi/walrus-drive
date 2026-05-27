import { useQueryClient } from "@tanstack/react-query";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { executeWalrusUpload } from "../services/upload.service";
import { useUploadStore } from "../store/upload-store";

export function useUpload() {
  const queryClient = useQueryClient();
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction();

  // Ambil actions dari store (tanpa subscribe ke array uploads untuk menghindari re-render di hook ini)
  const addUpload = useUploadStore((state) => state.addUpload);
  const updateUpload = useUploadStore((state) => state.updateUpload);

  const startUpload = async (file: File, workspaceId: string) => {
    if (!account) {
      throw new Error("Wallet belum terhubung. Silakan hubungkan wallet Anda.");
    }

    // 1. Buat ID unik untuk tracking antrean & daftarkan ke Store
    const uploadId = crypto.randomUUID();
    addUpload({
      id: uploadId,
      workspaceId,
      fileName: file.name,
      fileSize: file.size,
      status: "idle",
      progressMessage: "Memulai proses...",
      createdAt: Date.now(),
    });

    try {
      // 2. Eksekusi Service dengan injeksi callback untuk update status
      const result = await executeWalrusUpload({
        file,
        ownerAddress: account.address,
        workspaceId,
        signAndExecuteTransaction,
        suiClient,
        onProgress: (msg) => {
          // Mapping otomatis status granular berdasarkan isi log dari service lu
          let status: any = "uploading";
          if (msg.includes("Encoding")) status = "encoding";
          if (msg.includes("Mendaftarkan")) status = "registering";
          if (msg.includes("Sertifikasi")) status = "certifying";
          if (msg.includes("Menyimpan metadata")) status = "syncing_db";

          updateUpload(uploadId, { progressMessage: msg, status });
        },
      });

      // 3. Mark Completed
      updateUpload(uploadId, {
        status: "completed",
        blobId: result.blobId,
        progressMessage: "Upload berhasil!",
      });

      // 4. INVALIDATE CACHE! (Spesifik per workspace)
      // Ini yang bikin dashboard langsung auto-refresh tanpa reload halaman
      queryClient.invalidateQueries({
        queryKey: ["workspace-files", workspaceId],
      });

      return result;
    } catch (error: any) {
      // 5. Mark Failed
      updateUpload(uploadId, {
        status: "failed",
        error: error.message || "Gagal mengunggah file.",
      });
      throw error;
    }
  };

  return { startUpload };
}
