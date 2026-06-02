import { WorkspaceFile } from "@/features/workspace/types/workspace.types";

export interface IntegrityDashboardPayload {
  success: boolean;
  meta: {
    workspaceName: string;
    slug: string;
  };
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
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.error || "Gagal memuat dashboard integritas workspace",
      );
    }

    return res.json();
  },
};
