import { useQuery } from "@tanstack/react-query";
import {
  WorkspaceFullPayload,
  Workspace,
  WorkspaceFile,
  WorkspaceMember,
} from "../types/workspace.types";

// Core Fetcher Function
async function fetchWorkspaceFullData(
  slug: string, // 🌟 PERBAIKAN: Ubah parameter jadi slug
): Promise<WorkspaceFullPayload> {
  const response = await fetch(`/api/workspace/${slug}`);
  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Gagal memuat data workspace");
  }

  return result.data;
}

/**
 * 1. HOOK UTAMA: Mengambil semua data utuh workspace (Metadata, Files, Members)
 * Bagus dipakai di level Orchestrator Component (workspace-dashboard.tsx)
 */
export function useWorkspaceQuery(slug: string) {
  return useQuery({
    queryKey: ["workspace-detail", slug], // 🌟 PERBAIKAN: Gunakan slug sebagai cache key
    queryFn: () => fetchWorkspaceFullData(slug),
    enabled: !!slug, // Hanya jalan jika slug valid
    staleTime: 1000 * 60 * 2, // Data dianggap segar selama 2 menit
  });
}

/**
 * 2. HOOK KHUSUS FILES: Mengambil sub-data files secara terisolasi
 * Memanfaatkan selektor cache TanStack Query tanpa memicu request API ganda
 */
export function useWorkspaceFiles(slug: string) {
  return useQuery({
    queryKey: ["workspace-detail", slug],
    queryFn: () => fetchWorkspaceFullData(slug),
    enabled: !!slug,
    select: (data): WorkspaceFile[] => data.files, // 🔥 Mengambil array files saja
  });
}

/**
 * 3. HOOK KHUSUS MEMBERS: Mengambil sub-data daftar anggota kolaborator
 */
export function useWorkspaceMembers(slug: string) {
  return useQuery({
    queryKey: ["workspace-detail", slug],
    queryFn: () => fetchWorkspaceFullData(slug),
    enabled: !!slug,
    select: (data): WorkspaceMember[] => data.members, // 🔥 Mengambil array members saja
  });
}
