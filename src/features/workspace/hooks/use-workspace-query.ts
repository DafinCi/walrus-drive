import { useQuery } from "@tanstack/react-query";

// Sesuai dengan struktur tabel Supabase lu
export interface WorkspaceFile {
  id: string;
  blob_id: string;
  file_name: string;
  mime_type: string;
  file_size: number;
  wallet_address: string;
  created_at: string;
}

export function useWorkspaceQuery(workspaceId: string) {
  return useQuery({
    queryKey: ["workspace-files", workspaceId],
    queryFn: async (): Promise<WorkspaceFile[]> => {
      const response = await fetch(`/api/workspace/${workspaceId}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Gagal mengambil data files");
      }

      return result.data;
    },
    // Opsional: refetch data setiap kali user fokus ke tab browser
    refetchOnWindowFocus: true,
  });
}
