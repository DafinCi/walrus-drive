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

  const addUpload = useUploadStore((state) => state.addUpload);
  const updateUpload = useUploadStore((state) => state.updateUpload);

  const startUpload = async (file: File, workspaceId: string) => {
    if (!account) {
      throw new Error("Wallet belum terhubung. Silakan hubungkan wallet Anda.");
    }

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
      const result = await executeWalrusUpload({
        file,
        ownerAddress: account.address,
        workspaceId,
        signAndExecuteTransaction,
        suiClient,
        onProgress: (msg) => {
          let status: any = "uploading";
          if (msg.includes("Encoding")) status = "encoding";
          if (msg.includes("Mendaftarkan")) status = "registering";
          if (msg.includes("Sertifikasi")) status = "certifying";
          if (msg.includes("Menyimpan metadata")) status = "syncing_db";

          updateUpload(uploadId, { progressMessage: msg, status });
        },
      });

      updateUpload(uploadId, {
        status: "completed",
        blobId: result.blobId,
        progressMessage: "Upload berhasil!",
      });

      // 🌟 PERBAIKAN: Invalidate secara "fuzzy" (cukup prefix-nya saja)
      // Karena dashboard sekarang pakai 'slug', kalau kita tembak ID spesifik, cache nggak ker-reset.
      // Dengan cara ini, semua cache list file & detail workspace akan di-refresh otomatis.
      queryClient.invalidateQueries({ queryKey: ["workspace-files"] });
      queryClient.invalidateQueries({ queryKey: ["workspace-detail"] });

      return result;
    } catch (error: any) {
      updateUpload(uploadId, {
        status: "failed",
        error: error.message || "Gagal mengunggah file.",
      });
      throw error;
    }
  };

  return { startUpload };
}
