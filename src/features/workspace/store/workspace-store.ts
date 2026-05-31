import { create } from "zustand";
import { persist } from "zustand/middleware";

export type FileSortOption =
  | "newest"
  | "oldest"
  | "name_asc"
  | "name_desc"
  | "size_desc"
  | "size_asc";
export type WorkspaceSortOption =
  | "newest"
  | "oldest"
  | "name_asc"
  | "name_desc";

interface WorkspaceState {
  // UI States
  isUploadModalOpen: boolean;
  isInviteModalOpen: boolean;
  selectedFileId: string | null;
  isCreateModalOpen: boolean;
  isJoinModalOpen: boolean;

  // 🌟 TAMBAHAN: Sorting Preferences
  fileSort: FileSortOption;
  workspaceSort: WorkspaceSortOption;

  // Actions
  setUploadModalOpen: (open: boolean) => void;
  setInviteModalOpen: (open: boolean) => void;
  setSelectedFileId: (id: string | null) => void;
  setCreateModalOpen: (open: boolean) => void;
  setJoinModalOpen: (open: boolean) => void;

  // 🌟 TAMBAHAN: Sorting Actions
  setFileSort: (sort: FileSortOption) => void;
  setWorkspaceSort: (sort: WorkspaceSortOption) => void;

  resetWorkspaceUI: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      isUploadModalOpen: false,
      isInviteModalOpen: false,
      selectedFileId: null,
      isCreateModalOpen: false,
      isJoinModalOpen: false,

      fileSort: "newest", // Default value
      workspaceSort: "newest", // Default value

      setUploadModalOpen: (open) => set({ isUploadModalOpen: open }),
      setInviteModalOpen: (open) => set({ isInviteModalOpen: open }),
      setSelectedFileId: (id) => set({ selectedFileId: id }),
      setCreateModalOpen: (open) => set({ isCreateModalOpen: open }),
      setJoinModalOpen: (open) => set({ isJoinModalOpen: open }),

      setFileSort: (sort) => set({ fileSort: sort }),
      setWorkspaceSort: (sort) => set({ workspaceSort: sort }),

      resetWorkspaceUI: () =>
        set({
          isUploadModalOpen: false,
          isInviteModalOpen: false,
          selectedFileId: null,
          isCreateModalOpen: false,
          isJoinModalOpen: false,
        }),
    }),
    {
      name: "tresto-workspace-storage", // Nama key di localStorage
      // Opsional: Hanya simpan state sorting, abaikan modal agar tidak aneh saat refresh
      partialize: (state) => ({
        fileSort: state.fileSort,
        workspaceSort: state.workspaceSort,
      }),
    },
  ),
);
