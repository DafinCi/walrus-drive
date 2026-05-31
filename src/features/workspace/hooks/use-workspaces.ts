"use client";

import { useQuery } from "@tanstack/react-query";
import { WorkspaceSortOption } from "../store/workspace-store"; // 🌟 TAMBAHAN: Import tipe data sort

export interface WorkspaceHubItem {
  id: string;
  slug: string;
  name: string;
  ownerAddress: string;
  createdAt: string;
  userRole: "owner" | "admin" | "member";
  joinedAt: string;
  totalMembers: number;
  totalFiles: number;
}

// 🌟 PERUBAHAN: Menerima parameter sort
export function useWorkspaces(
  walletAddress: string | undefined,
  sort: WorkspaceSortOption,
) {
  return useQuery<WorkspaceHubItem[]>({
    // 🌟 PERUBAHAN: Masukkan sort ke queryKey agar TanStack Query tahu kapan harus fetch ulang
    queryKey: ["user-workspaces", walletAddress, sort],
    queryFn: async () => {
      if (!walletAddress) return [];

      // 🌟 PERUBAHAN: Suntikkan parameter &sort= ke dalam URL fetch
      const res = await fetch(
        `/api/workspace/list?wallet=${walletAddress}&sort=${sort}`,
      );

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
