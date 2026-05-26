import { useQuery, useMutation } from "@tanstack/react-query";

export interface ValidateInviteResponse {
  success: boolean;
  invite: { valid: boolean; expired: boolean };
  workspace: { id: string; name: string; owner_address: string } | null;
  membership: { alreadyMember: boolean; role: string | null };
}

// Hook Validasi Tautan (Re-run otomatis setiap walletAddress berubah)
export function useValidateInvite(token: string, walletAddress?: string) {
  return useQuery<ValidateInviteResponse>({
    queryKey: ["invite-validation", token, walletAddress || "guest"],
    queryFn: async () => {
      const url = walletAddress
        ? `/api/workspace/invite/validate/${token}?walletAddress=${walletAddress}`
        : `/api/workspace/invite/validate/${token}`;

      const response = await fetch(url);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Gagal memproses otentikasi tautan.");
      }
      return result;
    },
    enabled: !!token,
    staleTime: 0, // Validasi wajib real-time, jangan andalkan cache usang
  });
}

// Hook Mutasi Aksi Bergabung ke Workspace
interface JoinWorkspaceInput {
  token: string;
  walletAddress: string;
}

export function useJoinWorkspace() {
  return useMutation({
    mutationFn: async (payload: JoinWorkspaceInput) => {
      const response = await fetch("/api/workspace/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Gagal mendaftarkan diri Anda.");
      }
      return result; // Mengembalikan { success: true, workspaceId }
    },
  });
}
