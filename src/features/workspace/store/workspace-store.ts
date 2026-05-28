import { create } from "zustand";

interface WorkspaceState {
  // Ephemeral UI States
  isUploadModalOpen: boolean;
  isInviteModalOpen: boolean;
  selectedFileId: string | null;

  // Actions / Mutations
  setUploadModalOpen: (open: boolean) => void;
  setInviteModalOpen: (open: boolean) => void;
  setSelectedFileId: (id: string | null) => void;

  // Reset helper (berguna jika user keluar dari workspace)
  resetWorkspaceUI: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  isUploadModalOpen: false,
  isInviteModalOpen: false,
  selectedFileId: null,

  setUploadModalOpen: (open) => set({ isUploadModalOpen: open }),
  setInviteModalOpen: (open) => set({ isInviteModalOpen: open }),
  setSelectedFileId: (id) => set({ selectedFileId: id }),

  resetWorkspaceUI: () =>
    set({
      isUploadModalOpen: false,
      isInviteModalOpen: false,
      selectedFileId: null,
    }),
}));
