// 🌟 PERTAHANAN BACKEND: Wajib server-only karena memuat operasi penulisan admin langsung ke DB
import "server-only";
import { createClient } from "@supabase/supabase-js";
import { CreateActivityInput } from "../types/activity.types";

// Inisialisasi Supabase Admin khusus internal server
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

class ActivityLogger {
  /**
   * Core execution engine untuk memasukkan log ke Supabase.
   * Mengubah camelCase frontend menjadi snake_case database.
   */
  private async insertLog(input: CreateActivityInput) {
    try {
      const { error } = await supabaseAdmin.from("activities").insert({
        workspace_id: input.workspaceId,
        actor_wallet_address: input.actorWalletAddress,
        action: input.action,
        entity_type: input.entityType,
        entity_id: input.entityId,
        metadata: input.metadata || {},
      });

      if (error) throw error;
    } catch (err: any) {
      // Logger gagal tidak boleh membuat flow utama (seperti upload file) ikut crash,
      // kita log ke console server sebagai warning audit trail.
      console.error(
        `[ActivityLogger Error] Gagal mencatat aksi ${input.action}:`,
        err.message,
      );
    }
  }

  /**
   * Logging khusus untuk modul Upload File
   */
  async logFileUpload(params: {
    workspaceId: string;
    walletAddress: string;
    fileId: string;
    fileName: string;
    fileSize: number;
    mimeType?: string;
  }) {
    await this.insertLog({
      workspaceId: params.workspaceId,
      actorWalletAddress: params.walletAddress,
      action: "FILE_UPLOADED",
      entityType: "file",
      entityId: params.fileId,
      metadata: {
        file_name: params.fileName,
        size: params.fileSize,
        mimeType: params.mimeType,
      },
    });
  }

  /**
   * Logging khusus untuk modul Verifikasi Bukti Blockchain (Tatum Node)
   */
  async logFileVerification(params: {
    workspaceId: string;
    walletAddress: string;
    fileId: string;
    fileName: string;
    checkpoint: string;
    txDigest: string;
    network: "sui-mainnet" | "sui-testnet";
  }) {
    await this.insertLog({
      workspaceId: params.workspaceId,
      actorWalletAddress: params.walletAddress,
      action: "FILE_VERIFIED",
      entityType: "verification",
      entityId: params.fileId,
      metadata: {
        file_name: params.fileName,
        checkpoint: params.checkpoint,
        txDigest: params.txDigest,
        network: params.network,
      },
    });
  }
}

export const activityLogger = new ActivityLogger();
