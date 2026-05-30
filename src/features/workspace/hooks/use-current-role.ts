// src/features/workspace/hooks/use-current-role.ts
"use client";

import { useAuthState } from "@/features/auth/hooks/use-auth-state";
import { useWorkspaceMembers } from "./use-workspace-members";
import { WorkspaceRole } from "@/features/auth/types/auth.types";

export function useCurrentRole(workspaceId: string) {
  const { address } = useAuthState();
  const { data: members, isLoading: isLoadingMembers } =
    useWorkspaceMembers(workspaceId);

  // Cari member yang wallet-nya sama dengan wallet user yang sedang login
  const currentMember = members?.find(
    (m) => m.wallet_address.toLowerCase() === address?.toLowerCase(),
  );

  return {
    role: (currentMember?.role as WorkspaceRole) || null,
    isLoading: isLoadingMembers,
  };
}
