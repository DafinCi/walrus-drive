import { FileSortOption, WorkspaceSortOption } from "../store/workspace-store";

export const FILE_SORT_CONFIG: Record<
  FileSortOption,
  { label: string; column: string; ascending: boolean }
> = {
  newest: { label: "Newest", column: "created_at", ascending: false },
  oldest: { label: "Earliest", column: "created_at", ascending: true },
  name_asc: { label: "Name A-Z", column: "file_name", ascending: true },
  name_desc: { label: "Name Z-A", column: "file_name", ascending: false },
  size_desc: {
    label: "Largest Size",
    column: "file_size",
    ascending: false,
  },
  size_asc: { label: "Smallest Size", column: "file_size", ascending: true },
};

// 🌟 TAMBAHAN BARU: Konfigurasi khusus pengurutan Workspace Hub
export const WORKSPACE_SORT_CONFIG: Record<
  WorkspaceSortOption,
  { label: string; column: string; ascending: boolean }
> = {
  newest: {
    label: "Recently joined",
    column: "created_at",
    ascending: false,
  },
  oldest: { label: "Terlama bergabung", column: "created_at", ascending: true },
  name_asc: { label: "Name A-Z", column: "name", ascending: true },
  name_desc: { label: "Name Z-A", column: "name", ascending: false },
};
