// src/features/workspace/hooks/use-create-workspace.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { workspaceService } from "../services/workspace.service";
import { CreateWorkspaceInput } from "../validations/create-workspace-schema";

export function useCreateWorkspace(walletAddress: string | undefined) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (formData: CreateWorkspaceInput) => {
      if (!walletAddress) {
        throw new Error("Please connect your wallet first.");
      }
      return workspaceService.createWorkspace({
        ...formData,
        ownerAddress: walletAddress,
      });
    },
    onSuccess: (data) => {
      // Refresh cache daftar workspace milik user saat ini
      queryClient.invalidateQueries({
        queryKey: ["user-workspaces", walletAddress],
      });

      // Momentum UX: Langsung tendang masuk ke workspace baru berbasis slug!
      router.push(`/workspace/${data.slug}`);
    },
  });
}
