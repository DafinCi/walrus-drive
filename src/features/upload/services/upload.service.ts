import { walrusClient } from "@/services/walrus/client";
import { WalrusFile, RetryableWalrusClientError } from "@mysten/walrus";

// Interface untuk standardisasi output yang akan dikonsumsi UI/Database
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
  }; // Menyimpan raw response utuh untuk kebutuhan audit/parsing masa depan
}

// Interface parameter yang dibutuhkan dari konteks browser wallet
interface UploadParams {
  file: File;
  ownerAddress: string;
  signAndExecuteTransaction: (params: {
    transaction: any;
  }) => Promise<{ digest: string }>;
  suiClient: {
    waitForTransaction: (params: { digest: string }) => Promise<any>;
  };
  onProgress?: (status: string) => void; // Callback opsional untuk update teks loading di UI
}

/**
 * Walrus Upload Service (Single Source of Truth)
 * Mengisolasi kompleksitas writeFilesFlow dari UI komponen.
 */
export async function executeWalrusUpload({
  file,
  ownerAddress,
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

    logProgress("Langkah 1/4: Menghitung pecahan data lokal (Encoding)...");
    const flow = walrusClient.walrus.writeFilesFlow({
      files: [walrusFile],
    });
    await flow.encode();

    logProgress(
      "Langkah 2/4: Mendaftarkan Blob... Tolong Approve transaksi di wallet Anda.",
    );
    const registerTx = flow.register({
      epochs: 1, // Default hackathon: 1 epoch biar hemat koin WAL
      owner: ownerAddress,
      deletable: true,
    });

    const registerResult = await signAndExecuteTransaction({
      transaction: registerTx,
    });
    logProgress("Menunggu konfirmasi pendaftaran di blockchain SUI...");
    await suiClient.waitForTransaction({ digest: registerResult.digest });

    logProgress(
      "Langkah 3/4: Mengirimkan fisik pecahan file ke Walrus Relay Node...",
    );
    await flow.upload({ digest: registerResult.digest });

    logProgress(
      "Langkah 4/4: Sertifikasi Blob... Tolong Approve transaksi TERAKHIR di wallet Anda.",
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

    // Return data yang sudah dinormalisasi dan siap pakai
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
    // Tangkap error, bersihkan lewat normalizer, lalu lempar kembali ke UI
    const normalizedErrorMessage = parseWalrusError(error);
    throw new Error(normalizedErrorMessage);
  }
}

/**
 * Error Normalizer Helper
 * Menerjemahkan error Web3/Sui/Walrus yang berantakan menjadi bahasa manusiawi untuk UI
 */
export function parseWalrusError(error: any): string {
  console.error("--- RAW WALRUS PROTOCOL ERROR ---", error);

  const errorMessage = error?.message || String(error);

  // Case 1: Jaringan/Epoch Walrus berubah di tengah jalan (Sesuai Docs)
  if (error instanceof RetryableWalrusClientError) {
    try {
      walrusClient.walrus.reset(); // Reset internal state client sesuai pakem docs
    } catch (resetErr) {
      console.error("Gagal mereset client:", resetErr);
    }
    return "Koneksi ke node Walrus terputus karena perubahan siklus jaringan (Epoch). Sistem telah mereset client, silakan coba upload kembali.";
  }

  // Case 2: User membatalkan tanda tangan di wallet (Sui Wallet / Suiet)
  if (
    errorMessage.includes("Rejected by user") ||
    errorMessage.includes("User rejected") ||
    errorMessage.includes("Reject")
  ) {
    return "Transaksi dibatalkan. Anda harus menyetujui tanda tangan di wallet untuk melanjutkan upload.";
  }

  // Case 3: Koin WAL atau SUI kurang
  if (
    errorMessage.includes("Insufficient balance") ||
    errorMessage.includes("InsufficientBalance")
  ) {
    if (errorMessage.includes("wal::WAL") || errorMessage.includes("WAL")) {
      return "Saldo koin WAL Anda tidak cukup untuk membayar biaya sewa storage file ini.";
    }
    return "Saldo koin SUI Anda tidak cukup untuk membayar Gas Fee atau Tip Relay.";
  }

  // Case 4: Masalah koneksi HTTP ke Relay
  if (
    errorMessage.includes("Failed to fetch") ||
    errorMessage.includes("Network Error")
  ) {
    return "Gagal menghubungi server Walrus Relay. Periksa koneksi internet Anda atau server Relay sedang overload.";
  }

  // Fallback untuk error tidak terduga lainnya
  return (
    errorMessage ||
    "Terjadi kesalahan internal yang tidak diketahui saat mengunggah file ke Walrus."
  );
}
