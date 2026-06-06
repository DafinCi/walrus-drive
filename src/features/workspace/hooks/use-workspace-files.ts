import { useQuery } from "@tanstack/react-query";
import { FileSortOption } from "../store/workspace-store";

// Definisikan tipe sesuai balikan API
interface FetchFilesResponse {
  success: boolean;
  files: any[]; // Sesuaikan dengan tipe File lu (Database['public']['Tables']['files']['Row'])
}

export function useWorkspaceFiles(slug: string, sort: FileSortOption) {
  return useQuery({
    // Cache key dinamis, akan fetch ulang otomatis jika 'sort' berubah
    queryKey: ["workspace-files", slug, sort],
    queryFn: async () => {
      const response = await fetch(`/api/workspace/${slug}/files?sort=${sort}`);

      if (!response.ok) {
        throw new Error("Unable to load file data.");
      }

      const data: FetchFilesResponse = await response.json();
      return data.files;
    },
    enabled: !!slug, // Pastikan tidak meledak jika slug kosong
  });
}
