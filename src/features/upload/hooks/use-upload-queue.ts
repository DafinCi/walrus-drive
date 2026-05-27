import { useUploadStore } from "../store/upload-store";

export function useUploadQueue() {
  const uploads = useUploadStore((state) => state.uploads);
  const clearCompleted = useUploadStore((state) => state.clearCompleted);
  const removeUpload = useUploadStore((state) => state.removeUpload);

  // Derivasi data supaya komponen UI gampang pakainya
  const activeUploads = uploads.filter(
    (u) => u.status !== "completed" && u.status !== "failed",
  );
  const completedUploads = uploads.filter((u) => u.status === "completed");
  const failedUploads = uploads.filter((u) => u.status === "failed");

  const hasActiveUploads = activeUploads.length > 0;

  return {
    uploads,
    activeUploads,
    completedUploads,
    failedUploads,
    hasActiveUploads,
    clearCompleted,
    removeUpload,
  };
}
