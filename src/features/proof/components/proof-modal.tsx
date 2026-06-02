"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Calendar,
  Cpu,
  User,
  ExternalLink,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useVerifyProof } from "../hooks/use-verify-proof";
import { WorkspaceFile } from "@/features/workspace/types/workspace.types";

interface ProofModalProps {
  file: WorkspaceFile | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  slug: string;
}

export function ProofModal({
  file,
  isOpen,
  onOpenChange,
  slug,
}: ProofModalProps) {
  const {
    mutate: verifyProof,
    isPending,
    data: updatedData,
  } = useVerifyProof(slug);

  // Gunakan data terbaru dari mutation jika ada, jika tidak pakai data bawaan file
  const currentFileState = updatedData?.data || file;

  if (!currentFileState) return null;

  const status = currentFileState.status || "pending";
  const txDigest =
    currentFileState.register_tx_digest || currentFileState.tx_digest;
  const blobId = currentFileState.blob_id;

  const handleStartAudit = () => {
    verifyProof({ fileId: currentFileState.id });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border border-border shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Cryptographic Audit Center
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* TAMPILAN STATUS STATUS BADGE BOX */}
          {status === "verified" ? (
            <div className="p-4 border border-emerald-500/30 bg-emerald-500/10 rounded-sm flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-emerald-400">
                  Integritas Terverifikasi
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Berkas ini telah terbukti secara kriptografis terdaftar di
                  jaringan blockchain Sui dan tersimpan aman di Walrus Storage.
                </p>
              </div>
            </div>
          ) : status === "failed" ? (
            <div className="p-4 border border-destructive/30 bg-destructive/10 rounded-sm flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-destructive">
                  Verifikasi Gagal
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Transaksi gagal diverifikasi atau tidak ditemukan di rantai
                  blok resmi. Silakan hubungi pengunggah berkas.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 border border-blue-500/30 bg-blue-500/10 rounded-sm flex items-start gap-3">
              <Loader2
                className={`h-5 w-5 text-blue-400 shrink-0 mt-0.5 ${isPending ? "animate-spin" : ""}`}
              />
              <div>
                <h4 className="text-sm font-bold text-blue-400">
                  Menunggu Verifikasi
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Metadata lokal tersedia. Anda perlu memicu panggilan jaringan
                  validator Sui untuk mencocokkan status jangkar bukti (*proof
                  anchor*).
                </p>
              </div>
            </div>
          )}

          {/* DETAIL KARTU AUDIT */}
          <div className="p-4 bg-muted/40 border border-border rounded-sm space-y-3 font-sans text-sm">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">Nama Berkas</span>
              <span className="font-semibold text-foreground truncate">
                {currentFileState.file_name}
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">
                Walrus Blob ID
              </span>
              <span className="font-mono text-xs text-foreground/90 break-all bg-background p-1.5 border border-border/60 rounded-xs">
                {blobId || "N/A"}
              </span>
            </div>

            {txDigest && (
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground">
                  Transaction Digest
                </span>
                <a
                  href={`https://suiscan.xyz/testnet/tx/${txDigest}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-xs text-primary hover:underline flex items-center gap-1 group w-fit"
                >
                  {txDigest.substring(0, 24)}...
                  <ExternalLink className="h-3 w-3 inline opacity-70 group-hover:opacity-100" />
                </a>
              </div>
            )}

            {status === "verified" && (
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/60">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-[11px] text-muted-foreground">
                      Sui Checkpoint
                    </span>
                    <span className="font-mono font-medium text-xs">
                      {currentFileState.checkpoint || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-[11px] text-muted-foreground">
                      Sender Wallet
                    </span>
                    <span className="font-mono font-medium text-xs">
                      {currentFileState.sender
                        ? `${currentFileState.sender.substring(0, 6)}...`
                        : "N/A"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-[11px] text-muted-foreground">
                      Verified Timestamp
                    </span>
                    <span className="text-xs font-medium">
                      {currentFileState.verified_at
                        ? new Date(
                            currentFileState.verified_at,
                          ).toLocaleDateString("id-ID", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AKSI BAWAH */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="cursor-pointer"
            >
              Tutup
            </Button>
            {status !== "verified" && (
              <Button
                size="sm"
                onClick={handleStartAudit}
                disabled={isPending}
                className="cursor-pointer gap-2 font-medium"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Auditing...
                  </>
                ) : (
                  "Jalankan Kriptografis Audit"
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
