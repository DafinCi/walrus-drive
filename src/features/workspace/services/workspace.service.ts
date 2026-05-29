// src/features/workspace/services/workspace.service.ts
import { CreateWorkspaceInput } from "../validations/create-workspace-schema";

export const workspaceService = {
  /**
   * Mengirim data onboard untuk membuat workspace baru beserta owner-nya
   */
  async createWorkspace(
    payload: CreateWorkspaceInput & { ownerAddress: string },
  ) {
    const response = await fetch("/api/workspace/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.error || "Gagal membuat workspace");
    }

    return result as { success: boolean; workspaceId: string; slug: string };
  },

  /**
   * Hit real-time API untuk mengecek apakah slug sudah dipakai atau belum
   */
  async checkSlugAvailability(slug: string): Promise<boolean> {
    if (!slug || slug.length < 3) return false;

    const response = await fetch(`/api/workspace/check-slug?slug=${slug}`);
    if (!response.ok) return false;

    const result = await response.json();
    return result.available === true;
  },
};
