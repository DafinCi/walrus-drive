import { create } from "zustand";

interface ActivityStore {
  isActivityOpen: boolean;
  toggleActivity: () => void;
  openActivity: () => void;
  closeActivity: () => void;
}

export const useActivityStore = create<ActivityStore>((set) => ({
  isActivityOpen: false,
  toggleActivity: () =>
    set((state) => ({ isActivityOpen: !state.isActivityOpen })),
  openActivity: () => set({ isActivityOpen: true }),
  closeActivity: () => set({ isActivityOpen: false }),
}));
