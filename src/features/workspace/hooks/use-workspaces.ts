"use client";

import { useQuery } from "@tanstack/react-query";

export interface WorkspaceHubItem {
  id: string;
  name: string;
  ownerAddress: string;
  createdAt: string;
  userRole: "owner" | "admin" | "member";
  joinedAt: string;
  totalMembers: number;
  totalFiles: number;
}

export function useWorkspaces(walletAddress: string | undefined) {
  return useQuery<WorkspaceHubItem[]>({
    queryKey: ["user-workspaces", walletAddress],
    queryFn: async () => {
      if (!walletAddress) return [];
      const res = await fetch(`/api/workspace/list?wallet=${walletAddress}`);
      if (!res.ok) {
        throw new Error("Gagal memuat daftar ruang kerja.");
      }
      return res.json();
    },
    // Query hanya akan menembak jika wallet address benar-benar ada/terkoneksi
    enabled: !!walletAddress,
    staleTime: 1000 * 60 * 5, // Cache aman selama 5 menit
  });
}
