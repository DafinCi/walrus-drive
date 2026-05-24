// src/features/upload/services/upload.service.ts
import { walrusClient } from "@/services/walrus/client";
import { WalrusFile, RetryableWalrusClientError } from "@mysten/walrus";

export interface WalrusUploadResult {
  blobId: string;
  txDigest: {
    register: string;
    certify: string;
  };
  metadata: {
    name: string;
    size: number;
    type: string;
    uploadedAt: number;
  };
  raw: {
    filesInfo: unknown;
    registerResult: unknown;
    certifyResult: unknown;
  };
}

// 1. TAMBAH: workspaceId di parameter
interface UploadParams {
  file: File;
  ownerAddress: string;
  workspaceId: string; // <--- Wajib ada sekarang
  signAndExecuteTransaction: (params: {
    transaction: any;
  }) => Promise<{ digest: string }>;
  suiClient: {
    waitForTransaction: (params: { digest: string }) => Promise<any>;
  };
  onProgress?: (status: string) => void;
}

export async function executeWalrusUpload({
  file,
  ownerAddress,
  workspaceId,
  signAndExecuteTransaction,
  suiClient,
  onProgress,
}: UploadParams): Promise<WalrusUploadResult> {
  const logProgress = (msg: string) => {
    console.log(`[WalrusService] ${msg}`);
    if (onProgress) onProgress(msg);
  };

  try {
    logProgress("Mempersiapkan dan mengonversi file ke format WalrusFile...");
    const fileBuffer = await file.arrayBuffer();
    const walrusFile = WalrusFile.from({
      contents: new Uint8Array(fileBuffer),
      identifier: file.name,
      tags: {
        "content-type": file.type || "application/octet-stream",
      },
    });

    logProgress("Langkah 1/5: Menghitung pecahan data lokal (Encoding)...");
    const flow = walrusClient.walrus.writeFilesFlow({ files: [walrusFile] });
    await flow.encode();

    logProgress(
      "Langkah 2/5: Mendaftarkan Blob... Tolong Approve transaksi di wallet Anda.",
    );
    const registerTx = flow.register({
      epochs: 1,
      owner: ownerAddress,
      deletable: true,
    });
    const registerResult = await signAndExecuteTransaction({
      transaction: registerTx,
    });

    logProgress("Menunggu konfirmasi pendaftaran di blockchain SUI...");
    await suiClient.waitForTransaction({ digest: registerResult.digest });

    logProgress(
      "Langkah 3/5: Mengirimkan fisik pecahan file ke Walrus Relay Node...",
    );
    await flow.upload({ digest: registerResult.digest });

    logProgress(
      "Langkah 4/5: Sertifikasi Blob... Tolong Approve transaksi TERAKHIR di wallet Anda.",
    );
    const certifyTx = flow.certify();
    const certifyResult = await signAndExecuteTransaction({
      transaction: certifyTx,
    });

    logProgress("Menunggu konfirmasi sertifikasi di blockchain SUI...");
    await suiClient.waitForTransaction({ digest: certifyResult.digest });

    logProgress("Finalisasi: Mengambil manifes Blob ID...");
    const filesInfo = await flow.listFiles();
    const finalBlobId = filesInfo[0].blobId;

    // 2. TAMBAH: Langkah ke-5 Persistence Database (API Route)
    logProgress("Langkah 5/5: Menyimpan metadata ke database...");
    const apiResponse = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        blobId: finalBlobId,
        registerTx: registerResult.digest,
        certifyTx: certifyResult.digest,
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        fileSize: file.size,
        walletAddress: ownerAddress,
        workspaceId: workspaceId,
      }),
    });

    if (!apiResponse.ok) {
      const errData = await apiResponse.json().catch(() => ({}));
      // Melempar error spesifik agar ditangkap catch block di bawah
      throw new Error(
        `[DB_ERROR] Gagal menyimpan metadata: ${errData.error || apiResponse.statusText}`,
      );
    }

    logProgress("Upload dan penyimpanan sukses 100%!");

    return {
      blobId: finalBlobId,
      txDigest: {
        register: registerResult.digest,
        certify: certifyResult.digest,
      },
      metadata: {
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: Date.now(),
      },
      raw: {
        filesInfo,
        registerResult,
        certifyResult,
      },
    };
  } catch (error: any) {
    const normalizedErrorMessage = parseWalrusError(error);
    throw new Error(normalizedErrorMessage);
  }
}

export function parseWalrusError(error: any): string {
  console.error("--- RAW ERROR DI CATCH ---", error);

  const errorMessage = error?.message || String(error);

  // Filter Error Database kita sendiri agar teksnya tidak ditimpa
  if (errorMessage.includes("[DB_ERROR]")) {
    return errorMessage.replace("[DB_ERROR] ", "");
  }

  if (error instanceof RetryableWalrusClientError) {
    try {
      walrusClient.walrus.reset();
    } catch (e) {}
    return "Koneksi ke node Walrus terputus karena perubahan siklus jaringan (Epoch). Sistem telah mereset client, silakan coba upload kembali.";
  }

  if (
    errorMessage.includes("Rejected by user") ||
    errorMessage.includes("User rejected") ||
    errorMessage.includes("Reject")
  ) {
    return "Transaksi dibatalkan. Anda harus menyetujui tanda tangan di wallet untuk melanjutkan upload.";
  }

  if (
    errorMessage.includes("Insufficient balance") ||
    errorMessage.includes("InsufficientBalance")
  ) {
    if (errorMessage.includes("wal::WAL") || errorMessage.includes("WAL")) {
      return "Saldo koin WAL Anda tidak cukup untuk membayar biaya sewa storage file ini.";
    }
    return "Saldo koin SUI Anda tidak cukup untuk membayar Gas Fee atau Tip Relay.";
  }

  if (
    errorMessage.includes("Failed to fetch") ||
    errorMessage.includes("Network Error")
  ) {
    return "Gagal menghubungi server Walrus Relay. Periksa koneksi internet Anda atau server Relay sedang overload.";
  }

  return (
    errorMessage ||
    "Terjadi kesalahan internal yang tidak diketahui saat mengunggah file ke Walrus."
  );
}
