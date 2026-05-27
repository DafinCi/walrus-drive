"use client";

import { QueueUploadItem } from "../types/upload.types";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Wallet,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { UploadModal } from "./upload-modal";

interface UploadProgressProps {
  item: QueueUploadItem;
}

export function UploadProgress({ item }: UploadProgressProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileSizeInMB = (item.fileSize / (1024 * 1024)).toFixed(2);

  // Deteksi kondisi kritis: Kapan wallet butuh konfirmasi user?
  const isWalletActionRequired =
    item.status === "registering" || item.status === "certifying";
  const isProcessing = ["idle", "encoding", "uploading", "syncing_db"].includes(
    item.status,
  );

  const handleCopyBlobId = (e: React.MouseEvent, blobId: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(blobId);
    setCopied(true);
    toast.success("Blob ID disalin ke clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={() => setIsModalOpen(true)}
      className="p-3 rounded-lg bg-muted/40 border border-border/50 space-y-2 text-xs"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p
            className="font-medium text-foreground truncate"
            title={item.fileName}
          >
            {item.fileName}
          </p>
          <p className="text-[10px] text-muted-foreground">{fileSizeInMB} MB</p>
        </div>

        {/* Status Icon Indicator */}
        <div className="shrink-0">
          {isWalletActionRequired && (
            <Wallet className="h-4 w-4 text-amber-400 animate-pulse" />
          )}
          {isProcessing && (
            <Loader2 className="h-4 w-4 text-primary animate-spin" />
          )}
          {item.status === "completed" && (
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          )}
          {item.status === "failed" && (
            <AlertCircle className="h-4 w-4 text-destructive" />
          )}
        </div>
      </div>

      {/* Progress Message & Context Banner */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-[10px]">
          <span
            className={`font-medium ${
              isWalletActionRequired
                ? "text-amber-400 font-semibold animate-pulse"
                : item.status === "completed"
                  ? "text-emerald-400"
                  : item.status === "failed"
                    ? "text-destructive"
                    : "text-muted-foreground"
            }`}
          >
            {isWalletActionRequired
              ? "BUTUH APPROVE WALLET"
              : item.progressMessage}
          </span>
        </div>

        {/* Jalur Khusus Jika Sukses: Kasih Link Akses & Copy Blob ID */}
        {item.status === "completed" && item.blobId && (
          <div className="mt-2 pt-2 border-t border-border/30 flex items-center justify-between gap-2 text-[10px] text-muted-foreground">
            <span className="font-mono truncate max-w-[150px]">
              Blob: {item.blobId.slice(0, 10)}...
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={(e) => handleCopyBlobId(e, item.blobId!)}
                className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title="Salin Blob ID"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-emerald-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
              <a
                href={`https://aggregator.walrus-testnet.walrus.space/v1/blobs/${item.blobId}`}
                target="_blank"
                rel="noreferrer"
                className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-primary transition-colors"
                title="Buka di Walrus Aggregator"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        )}

        {/* Tampilkan Error Secara Spesifik */}
        {item.status === "failed" && item.error && (
          <p className="text-[10px] text-destructive/90 bg-destructive/10 p-1.5 rounded border border-destructive/20 line-clamp-2">
            {item.error}
          </p>
        )}
      </div>

      <UploadModal
        item={item}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
