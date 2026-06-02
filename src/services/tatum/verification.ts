// 🌟 WAJIB SERVER-ONLY: File ini akan dipakai di API Routes / Server Actions lu
import "server-only";

import { tatumServerClient } from "./rpc-client";

// Tipe balikan (return type) yang konsisten agar enak dipakai di UI/DB
export interface TransactionVerificationResult {
  isVerified: boolean;
  status: "success" | "failure" | "pending" | "not_found";
  checkpoint?: string;
  timestamp?: string; // dalam milidetik (ms)
  gasUsed?: string; // Total gas dalam bentuk MIST
  sender?: string;
  errorMsg?: string;
}

/**
 * Memverifikasi transaksi ke jaringan Sui via Tatum RPC Premium.
 * Menggunakan "Lazy Verification" yang ringan dan hemat RPS.
 */
export async function verifyBlobTransaction(
  txDigest: string,
): Promise<TransactionVerificationResult> {
  try {
    // Menarik data transaksi lengkap beserta efek dan inputnya
    const txBlock = await tatumServerClient.getTransactionBlock({
      digest: txDigest,
      options: {
        showEffects: true,
        showInput: true,
      },
    });

    const executionStatus = txBlock.effects?.status?.status;

    // Jika belum ada status, berarti transaksi masih pending di mempool
    if (!executionStatus) {
      return { isVerified: false, status: "pending" };
    }

    if (executionStatus === "success") {
      // Kalkulasi total gas yang digunakan (Computation + Storage - Rebate)
      let totalGasStr = "0";
      if (txBlock.effects?.gasUsed) {
        const { computationCost, storageCost, storageRebate } =
          txBlock.effects.gasUsed;
        const totalGas =
          BigInt(computationCost) + BigInt(storageCost) - BigInt(storageRebate);
        totalGasStr = totalGas.toString();
      }

      return {
        isVerified: true,
        status: "success",
        checkpoint: txBlock.checkpoint ?? undefined,
        timestamp: txBlock.timestampMs ?? undefined,
        gasUsed: totalGasStr,
        sender: txBlock.transaction?.data.sender,
      };
    } else {
      // Transaksi tereksekusi tapi gagal (misal: gas habis, logic error di smart contract)
      return {
        isVerified: false,
        status: "failure",
        errorMsg: txBlock.effects?.status?.error,
      };
    }
  } catch (error: any) {
    // Mengamankan dari error jika tx belum masuk blok atau salah digest
    console.error(`[Tatum] Gagal memverifikasi tx ${txDigest}:`, error.message);

    // Asumsi: Jika dilempar error, transaksi tidak ditemukan
    return {
      isVerified: false,
      status: "not_found",
      errorMsg: error.message,
    };
  }
}
