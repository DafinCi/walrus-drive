import { activityLogger } from "@/features/activity/service/activity-logger";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface WorkspaceInvite {
  token: string;
  workspace_id: string;
  created_by: string;
  expires_at: string;
  created_at: string;
  role: string; // 🌟 TAMBAHAN: Biar tipe data invite di list juga tahu role-nya
}

// 1. HOOK: Fetch Daftar Invite Aktif
export function useGetWorkspaceInvites(workspaceId: string) {
  return useQuery<WorkspaceInvite[]>({
    queryKey: ["workspace-invites", workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];

      const response = await fetch(
        `/api/workspace/invite/list?workspaceId=${workspaceId}`,
      );
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Gagal mengambil daftar undangan.");
      }

      return result.invites;
    },
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 2,
  });
}

// 2. HOOK: Mutasi Pembuatan Tautan
interface CreateInviteInput {
  workspaceId: string;
  createdBy: string;
  expiresInHours: number;
  role: string; // 🌟 FIX 1: Wajib masukkan role ke dalam interface input frontend!
}

export function useCreateInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateInviteInput) => {
      const response = await fetch("/api/workspace/invite/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), // 🌟 FIX 2: Sekarang otomatis mengirimkan { workspaceId, createdBy, expiresInHours, role }
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Gagal memproses pembuatan undangan.");
      }

      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace-invites", variables.workspaceId],
      });

      // 🌟 TAMBAHAN: Refresh panel aktivitas & statistik
      queryClient.invalidateQueries({ queryKey: ["workspace-activity"] });
      queryClient.invalidateQueries({ queryKey: ["workspace-activity-stats"] });
    },
  });
}

// 3. HOOK: Mutasi Pencabutan Tautan
interface RevokeInviteInput {
  token: string;
  workspaceId: string;
  walletAddress: string;
}

export function useRevokeInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: RevokeInviteInput) => {
      const response = await fetch("/api/workspace/invite/revoke", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Gagal mencabut izin tautan.");
      }

      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace-invites", variables.workspaceId],
      });

      // 🌟 TAMBAHAN: Refresh panel aktivitas & statistik
      queryClient.invalidateQueries({ queryKey: ["workspace-activity"] });
      queryClient.invalidateQueries({ queryKey: ["workspace-activity-stats"] });
    },
  });
}
