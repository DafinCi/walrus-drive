import { create } from "zustand";
import { QueueUploadItem } from "../types/upload.types";

interface UploadStore {
  uploads: QueueUploadItem[];
  addUpload: (upload: QueueUploadItem) => void;
  updateUpload: (id: string, updates: Partial<QueueUploadItem>) => void;
  removeUpload: (id: string) => void;
  clearCompleted: () => void;
}

export const useUploadStore = create<UploadStore>((set) => ({
  uploads: [],

  addUpload: (upload) =>
    set((state) => ({
      uploads: [upload, ...state.uploads],
    })),

  updateUpload: (id, updates) =>
    set((state) => ({
      uploads: state.uploads.map((item) =>
        item.id === id ? { ...item, ...updates } : item,
      ),
    })),

  removeUpload: (id) =>
    set((state) => ({
      uploads: state.uploads.filter((item) => item.id !== id),
    })),

  clearCompleted: () =>
    set((state) => ({
      uploads: state.uploads.filter((item) => item.status !== "completed"),
    })),
}));
