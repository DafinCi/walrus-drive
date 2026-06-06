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
    logProgress("Preparing file and computing SHA-256 checksum...");
    const fileChecksum = await calculateFileChecksum(file); // 👈 HITUNG SEBELUM UPLOAD

    const fileBuffer = await file.arrayBuffer();
    const walrusFile = WalrusFile.from({
      contents: new Uint8Array(fileBuffer),
      identifier: file.name,
      tags: {
        "content-type": file.type || "application/octet-stream",
      },
    });

    logProgress("Step 1/5: Encoding data into local shards...");
    const flow = walrusClient.walrus.writeFilesFlow({ files: [walrusFile] });
    await flow.encode();

    logProgress(
      "Step 2/5: Registering Blob. Please approve the transaction in your wallet.",
    );
    const registerTx = flow.register({
      epochs: 1,
      owner: ownerAddress,
      deletable: true,
    });
    const registerResult = await signAndExecuteTransaction({
      transaction: registerTx,
    });

    logProgress("Waiting for SUI blockchain confirmation...");
    await suiClient.waitForTransaction({ digest: registerResult.digest });

    logProgress("Step 3/5: Uploading file shards to Walrus Relay Node...");
    await flow.upload({ digest: registerResult.digest });

    logProgress(
      "Step 4/5: Certifying Blob. Please approve the final wallet transaction.",
    );
    const certifyTx = flow.certify();
    const certifyResult = await signAndExecuteTransaction({
      transaction: certifyTx,
    });

    logProgress("Waiting for SUI blockchain certification confirmation...");
    await suiClient.waitForTransaction({ digest: certifyResult.digest });

    logProgress("Finalisasi: Mengambil manifes Blob ID...");
    const filesInfo = await flow.listFiles();
    const finalBlobId = filesInfo[0].blobId;

    logProgress("Step 5/5: Storing metadata in centralized database...");
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
        `Database error: failed to save metadata: ${errData.error || apiResponse.statusText}`,
      );
    }

    logProgress("Upload and storage successful.");

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
    return "Connection lost. Please try again.";
  if (errorMessage.includes("Rejected by user"))
    return "Transaction was cancelled.";
  return errorMessage || "Internal error occurred.";
}
