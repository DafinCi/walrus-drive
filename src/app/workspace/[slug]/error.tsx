"use client";

import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

export default function WorkspaceError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error ini bisa lu pantau di console browser pas testing
    console.error("Workspace Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-4 p-8 text-center">
      <AlertCircle className="w-12 h-12 text-red-500" />
      <h2 className="text-xl font-bold text-gray-200">
        Oops, an error occurred!
      </h2>
      <p className="text-sm text-gray-400 max-w-md">
        {error.message || "Gagal memuat halaman workspace."}
      </p>
      <button
        onClick={() => reset()}
        className="mt-4 px-6 py-2 border border-gray-700 bg-gray-900 hover:bg-gray-800 text-white rounded-[6px] transition"
      >
        Try Reload
      </button>
    </div>
  );
}
