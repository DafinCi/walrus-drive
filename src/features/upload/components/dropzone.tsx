"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { UploadCloud } from "lucide-react";
import { useUpload } from "../hooks/use-upload";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { toast } from "sonner";

export function Dropzone() {
  const params = useParams();
  const account = useCurrentAccount();
  const { startUpload } = useUpload();

  const workspaceId = params.workspaceId as string;
  const [isDragging, setIsDragging] = useState(false);

  const processFile = async (file: File) => {
    if (!account) {
      toast.error("Koneksi Diperlukan", {
        description: "Silakan hubungkan wallet Sui Anda terlebih dahulu.",
      });
      return;
    }

    try {
      // Tembak ke core orchestrator, biarkan antrean Zustand yang mengelola sisanya
      await startUpload(file, workspaceId);
    } catch (err: any) {
      // Error esensial awal (misal wallet putus di tengah jalan)
      console.error("Dropzone trigger error:", err);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
    [account, workspaceId],
  );

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-xl transition-all duration-200 min-h-[180px] ${
          isDragging
            ? "border-primary bg-primary/10 scale-[1.01]"
            : "border-border bg-muted/20 hover:border-muted-foreground/40 hover:bg-muted/40"
        }`}
      >
        <input
          id="file-upload"
          type="file"
          onChange={onFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          disabled={!account}
          title="Pilih file untuk diupload"
        />

        <div className="flex flex-col items-center space-y-3 pointer-events-none text-center select-none">
          <UploadCloud
            className={`w-10 h-10 transition-colors ${isDragging ? "text-primary" : "text-muted-foreground"}`}
          />
          <div>
            <p className="font-medium text-sm text-foreground">
              Drag & drop file Anda ke sini
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Atau klik untuk menelusuri berkas komputer
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
