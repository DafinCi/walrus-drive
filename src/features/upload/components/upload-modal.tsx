"use client";

import { useState } from "react";
import { QueueUploadItem } from "../types/upload.types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Hash,
  Link2,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Clock,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { formatTruncateWallet } from "@/lib/formatters";
import { useCurrentAccount } from "@mysten/dapp-kit"; // 🌟 TAMBAHAN

interface UploadModalProps {
  item: QueueUploadItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UploadModal({ item, isOpen, onClose }: UploadModalProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const account = useCurrentAccount();

  if (!item) return null;

  const fileSizeInMB = (item.fileSize / (1024 * 1024)).toFixed(2);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success("Berhasil disalin ke clipboard");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-card border-border text-xs text-foreground shadow-2xl z-[70]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm font-bold text-foreground">
            <FileText className="h-4 w-4 text-primary" />
            Meta Inspector Berkas
          </DialogTitle>
          <DialogDescription className="text-[11px] text-muted-foreground">
            Audit data integritas kriptografi dan manifes on-chain Sui & Walrus.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2 z-50">
          {/* Section 1: Keterangan Berkas */}
          <div className="p-3 bg-muted/40 border border-border/50 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Nama Berkas:</span>
              <span
                className="font-medium text-right truncate max-w-[200px]"
                title={item.fileName}
              >
                {item.fileName}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Ukuran:</span>
              <span className="font-medium">{fileSizeInMB} MB</span>
            </div>

            {/* 🌟 TAMBAHAN: Penggunaan formatTruncateWallet */}
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Pengunggah:</span>
              <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-[11px] flex items-center gap-1.5 border border-border">
                <Wallet className="w-3 h-3 text-muted-foreground" />
                {account?.address
                  ? formatTruncateWallet(account.address)
                  : "Tidak diketahui"}
              </span>
            </div>

            <div className="flex justify-between items-center pt-1 border-t border-border/40 mt-1">
              <span className="text-muted-foreground">Status Siklus:</span>
              <span className="font-mono uppercase text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">
                {item.status}
              </span>
            </div>
          </div>

          {/* Section 2: Data Kriptografi On-Chain */}
          <div className="space-y-2.5">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Manifes Kriptografi & Blockchain
            </p>

            {/* Blob ID */}
            {item.blobId && (
              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-500" /> Walrus
                  Blob ID
                </label>
                <div className="flex items-center gap-2 bg-background border border-border/60 p-2 rounded-md">
                  <code className="font-mono text-[10px] text-emerald-400 truncate flex-1">
                    {item.blobId}
                  </code>
                  <button
                    onClick={() => handleCopy(item.blobId!, "blob")}
                    className="p-1 hover:bg-muted rounded text-muted-foreground cursor-pointer"
                  >
                    {copiedKey === "blob" ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <a
                    href={`https://aggregator.walrus-testnet.walrus.space/v1/blobs/${item.blobId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-primary"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* Waktu Masuk Antrean */}
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground pt-1">
              <Clock className="h-3 w-3" />
              <span>
                Didaftarkan pada:{" "}
                {new Date(item.createdAt).toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-border/40">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-8 cursor-pointer text-xs"
          >
            Tutup Panel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
