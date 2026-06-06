import { WorkspaceFile } from "@/features/workspace/types/workspace.types";

export interface IntegrityDashboardPayload {
  success: boolean;
  meta: { workspaceName: string; slug: string };
  summary: {
    totalFiles: number;
    verified: number;
    pending: number;
    failed: number;
    integrityScore: number;
    integrityLabel: string;
  };
  health: {
    walrus: string;
    suiNetwork: string;
    tatumRpc: string;
    lastAuditAt: string;
  };
  history: WorkspaceFile[];
}

export const proofService = {
  /**
   * Mengambil data analitik integritas workspace secara agregat (Single Fetch)
   */
  getIntegrityDashboard: async (
    slug: string,
  ): Promise<IntegrityDashboardPayload> => {
    const res = await fetch(`/api/workspace/${slug}/integrity`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.error || "Unable to load workspace integrity dashboard",
      );
    }

    return res.json();
  },

  /**
   * 🌟 TAMBAHAN BARU: Memicu verifikasi file tunggal ke backend
   */
  verifyFileProof: async (
    slug: string,
    fileId: string,
    txDigest: string,
  ): Promise<{ success: boolean; message: string }> => {
    const res = await fetch(`/api/workspace/${slug}/files/${fileId}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ txDigest }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.error || "Failed to process blockchain verification",
      );
    }

    return res.json();
  },
};
