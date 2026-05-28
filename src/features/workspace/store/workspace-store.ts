import { create } from "zustand";

interface WorkspaceState {
  // Ephemeral UI States (Detail)
  isUploadModalOpen: boolean;
  isInviteModalOpen: boolean;
  selectedFileId: string | null;

  // Ephemeral UI States (Hub)
  isCreateModalOpen: boolean;
  isJoinModalOpen: boolean;

  // Actions / Mutations
  setUploadModalOpen: (open: boolean) => void;
  setInviteModalOpen: (open: boolean) => void;
  setSelectedFileId: (id: string | null) => void;
  setCreateModalOpen: (open: boolean) => void;
  setJoinModalOpen: (open: boolean) => void;

  resetWorkspaceUI: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  isUploadModalOpen: false,
  isInviteModalOpen: false,
  selectedFileId: null,
  isCreateModalOpen: false,
  isJoinModalOpen: false,

  setUploadModalOpen: (open) => set({ isUploadModalOpen: open }),
  setInviteModalOpen: (open) => set({ isInviteModalOpen: open }),
  setSelectedFileId: (id) => set({ selectedFileId: id }),
  setCreateModalOpen: (open) => set({ isCreateModalOpen: open }),
  setJoinModalOpen: (open) => set({ isJoinModalOpen: open }),

  resetWorkspaceUI: () =>
    set({
      isUploadModalOpen: false,
      isInviteModalOpen: false,
      selectedFileId: null,
      isCreateModalOpen: false,
      isJoinModalOpen: false,
    }),
}));
