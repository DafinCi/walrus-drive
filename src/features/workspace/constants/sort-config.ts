import { FileSortOption, WorkspaceSortOption } from "../store/workspace-store";

export const FILE_SORT_CONFIG: Record<
  FileSortOption,
  { label: string; column: string; ascending: boolean }
> = {
  newest: { label: "Terbaru", column: "created_at", ascending: false },
  oldest: { label: "Terlama", column: "created_at", ascending: true },
  name_asc: { label: "Nama A-Z", column: "file_name", ascending: true },
  name_desc: { label: "Nama Z-A", column: "file_name", ascending: false },
  size_desc: {
    label: "Ukuran Terbesar",
    column: "file_size",
    ascending: false,
  },
  size_asc: { label: "Ukuran Terkecil", column: "file_size", ascending: true },
};

// 🌟 TAMBAHAN BARU: Konfigurasi khusus pengurutan Workspace Hub
export const WORKSPACE_SORT_CONFIG: Record<
  WorkspaceSortOption,
  { label: string; column: string; ascending: boolean }
> = {
  newest: {
    label: "Terbaru bergabung",
    column: "created_at",
    ascending: false,
  },
  oldest: { label: "Terlama bergabung", column: "created_at", ascending: true },
  name_asc: { label: "Nama A-Z", column: "name", ascending: true },
  name_desc: { label: "Nama Z-A", column: "name", ascending: false },
};
