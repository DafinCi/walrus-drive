import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface WorkspaceInvite {
  token: string;
  workspace_id: string;
  created_by: string;
  expires_at: string;
  created_at: string;
}

// 1. HOOK: Fetch Daftar Invite Aktif (Anti-Zombie Filtering ada di sisi API)
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
    staleTime: 1000 * 60 * 2, // Cache segar selama 2 menit
  });
}

// 2. HOOK: Mutasi Pembuatan Tautan (Murni tanpa side-effect Toast)
interface CreateInviteInput {
  workspaceId: string;
  createdBy: string;
  expiresInHours: number;
}

export function useCreateInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateInviteInput) => {
      const response = await fetch("/api/workspace/invite/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Gagal memproses pembuatan undangan.");
      }

      return result; // { success: true, token, expiresAt }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace-invites", variables.workspaceId],
      });
    },
  });
}

// 3. HOOK: Mutasi Pencabutan Tautan (Sekarang pakai HTTP DELETE Method)
interface RevokeInviteInput {
  token: string;
  workspaceId: string;
  walletAddress: string;
}

export function useRevokeInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: RevokeInviteInput) => {
      // Menggunakan METHOD: DELETE sesuai kaidah RESTful modern
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
    },
  });
}
