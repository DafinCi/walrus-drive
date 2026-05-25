import { walrusClient } from "@/services/walrus/client";
import { WalrusFile, RetryableWalrusClientError } from "@mysten/walrus";
import { calculateFileChecksum } from "@/lib/checksum";

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
    checksum: string;
  };
  raw: {
    filesInfo: unknown;
    registerResult: unknown;
    certifyResult: unknown;
  };
}

interface UploadParams {
  file: File;
  ownerAddress: string;
  workspaceId: string;
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
    logProgress(
      "Mempersiapkan file dan menghitung Integrity Checksum SHA-256...",
    );
    const fileChecksum = await calculateFileChecksum(file); // 👈 HITUNG SEBELUM UPLOAD

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

    logProgress("Langkah 5/5: Menyimpan metadata ke database terpusat...");
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
        checksum: fileChecksum, // 👈 KIRIM CHECKSUM KE API
        storageEpoch: 1, // 👈 KIRIM METADATA WALRUS EPOCH
      }),
    });

    if (!apiResponse.ok) {
      const errData = await apiResponse.json().catch(() => ({}));
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
        type: file.type || "application/octet-stream",
        uploadedAt: Date.now(),
        checksum: fileChecksum, // 👈 MASUKKAN KE RESULT OBJECT
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
  if (errorMessage.includes("[DB_ERROR]"))
    return errorMessage.replace("[DB_ERROR] ", "");
  if (error instanceof RetryableWalrusClientError)
    return "Koneksi node terputus, silakan coba kembali.";
  if (errorMessage.includes("Rejected by user"))
    return "Transaksi dibatalkan oleh pengguna.";
  return errorMessage || "Terjadi kesalahan internal.";
}
