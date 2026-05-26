import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface WorkspaceInvite {
  token: string;
  workspace_id: string;
  created_by: string;
  expires_at: string;
  created_at: string;
}

// -------------------------------------------------------------------------
// 1. HOOK: Mengambil Semua Tautan Undangan yang Aktif di Workspace
// -------------------------------------------------------------------------
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
    enabled: !!workspaceId, // Jalankan query hanya jika workspaceId valid
    staleTime: 1000 * 60 * 5, // Data dianggap segar selama 5 menit
  });
}

// -------------------------------------------------------------------------
// 2. HOOK: Mutasi untuk Membuat Tautan Undangan Baru
// -------------------------------------------------------------------------
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

      return result; // Mengembalikan { success: true, token, expiresAt }
    },
    onSuccess: (_, variables) => {
      // Reaktif: Otomatis paksa query list untuk fetch ulang data terbaru dari database
      queryClient.invalidateQueries({
        queryKey: ["workspace-invites", variables.workspaceId],
      });
    },
  });
}

// -------------------------------------------------------------------------
// 3. HOOK: Mutasi untuk Mencabut (Revoke/Hapus) Tautan Undangan
// -------------------------------------------------------------------------
interface RevokeInviteInput {
  token: string;
  workspaceId: string;
  walletAddress: string; // Dibutuhkan untuk security check di backend
}

export function useRevokeInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: RevokeInviteInput) => {
      const response = await fetch("/api/workspace/invite/revoke", {
        method: "POST",
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
      toast.success("Tautan Dicabut", {
        description: "Akses cryptographic token tersebut berhasil dimatikan.",
      });
      // Reaktif: Segarkan cache data di layar client seketika
      queryClient.invalidateQueries({
        queryKey: ["workspace-invites", variables.workspaceId],
      });
    },
    onError: (error: any) => {
      toast.error("Gagal Mencabut Tautan", {
        description: error.message || "Pastikan Anda memiliki hak akses admin.",
      });
    },
  });
}
