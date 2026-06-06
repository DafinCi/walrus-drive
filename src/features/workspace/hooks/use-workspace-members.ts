// workspace/hooks/use-workspace-members.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WorkspaceMember } from "../types/member.types";
import { toast } from "sonner";

// 1. Hook GET: Ambil Daftar Anggota (Sudah dibuat sebelumnya)
export function useWorkspaceMembers(workspaceId: string) {
  return useQuery<WorkspaceMember[]>({
    queryKey: ["workspace-members", workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];
      const response = await fetch(
        `/api/workspace/members?workspaceId=${workspaceId}`,
      );
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Unable to load collaborators.");
      }
      return result.members;
    },
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 3,
  });
}

// 2. Hook POST: Mempromosikan Member Menjadi Admin
export function usePromoteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      workspaceId: string;
      targetWallet: string;
      actorWallet: string;
    }) => {
      const response = await fetch("/api/workspace/members/promote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to update member permissions.");
      }
      return result;
    },
    onSuccess: (_, variables) => {
      // Mengusir cache lama dan memaksa UI me-render ulang daftar member terbaru
      queryClient.invalidateQueries({
        queryKey: ["workspace-members", variables.workspaceId],
      });
      // 🌟 INJEKSI CACHE: Segarkan Activity Feed!
      queryClient.invalidateQueries({ queryKey: ["workspace-activity"] });
      queryClient.invalidateQueries({ queryKey: ["workspace-activity-stats"] });
    },
  });
}

// 3. Hook POST: Mengeluarkan Member dari Workspace
export function useRemoveMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      workspaceId: string;
      targetWallet: string;
      actorWallet: string;
    }) => {
      const response = await fetch("/api/workspace/members/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Unable to remove member.");
      }
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace-members", variables.workspaceId],
      });
      // 🌟 INJEKSI CACHE: Segarkan Activity Feed!
      queryClient.invalidateQueries({ queryKey: ["workspace-activity"] });
      queryClient.invalidateQueries({ queryKey: ["workspace-activity-stats"] });
    },
  });
}
