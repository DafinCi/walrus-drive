"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Copy, Check, Clock, Loader2, Link2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

// Import Shadcn UI Components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteModal({ open, onOpenChange }: InviteModalProps) {
  const params = useParams();
  const account = useCurrentAccount();
  const workspaceId = params.workspaceId as string;

  // State Management
  const [expiresInHours, setExpiresInHours] = useState("24");
  const [isGenerating, setIsGenerating] = useState(false);
  const [inviteUrl, setInviteUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [expiresAtDate, setExpiresAtDate] = useState<string | null>(null);

  // Handler Generate Invite Token
  const handleGenerateLink = async () => {
    if (!account?.address) {
      toast.error("Aksi Ditolak", {
        description: "Hubungkan wallet Sui Anda terlebih dahulu.",
      });
      return;
    }

    setIsGenerating(true);
    setInviteUrl(""); // Reset tautan lama jika ada

    try {
      const response = await fetch("/api/workspace/invite/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workspaceId,
          createdBy: account.address,
          expiresInHours: Number(expiresInHours),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Gagal membuat token undangan.");
      }

      // Bangun URL absolut untuk join workspace
      const origin = window.location.origin;
      const fullLink = `${origin}/workspace/join/${result.token}`;

      setInviteUrl(fullLink);
      setExpiresAtDate(result.expiresAt);

      toast.success("Tautan Undangan Aktif!", {
        description: "Silakan salin dan bagikan ke kolaborator target.",
      });
    } catch (error: any) {
      console.error("Generate Invite Error:", error);
      toast.error("Gagal Membuat Undangan", {
        description:
          error.message ||
          "Pastikan Anda adalah Owner atau Admin di workspace ini.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Handler Salin ke Clipboard
  const handleCopy = async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      toast.success("Tersalin!", {
        description: "Tautan undangan disalin ke clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !isGenerating && onOpenChange(v)}>
      <DialogContent className="sm:max-w-[440px] bg-card border border-border shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Link2 className="h-5 w-5 text-primary" />
            Undang Kolaborator
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs leading-relaxed">
            Hasilkan tautan undangan cryptographic unik. Hanya wallet dengan
            alamat yang memegang tautan ini yang dapat mendaftar masuk.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-3">
          {/* KONFIGURASI: Pilih Masa Berlaku Tautan */}
          {!inviteUrl && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                Masa Berlaku Tautan
              </label>
              <Select
                value={expiresInHours}
                onValueChange={setExpiresInHours}
                disabled={isGenerating}
              >
                <SelectTrigger className="w-full bg-background border-border text-sm h-10">
                  <SelectValue placeholder="Pilih masa kedaluwarsa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Jam</SelectItem>
                  <SelectItem value="12">12 Jam</SelectItem>
                  <SelectItem value="24">1 Hari (24 Jam)</SelectItem>
                  <SelectItem value="168">7 Hari (1 Minggu)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* DISPLAY TAUTAN: Muncul Berdasarkan Kondisi Sukses Fetch */}
          {inviteUrl && (
            <div className="space-y-3 animate-in fade-in-50 slide-in-from-bottom-2 duration-200">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80">
                  Tautan Undangan Anda
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-muted/50 border border-border rounded-lg h-10 px-3 flex items-center min-w-0">
                    <span className="text-xs font-mono text-foreground/90 truncate select-all">
                      {inviteUrl}
                    </span>
                  </div>
                  <Button
                    size="icon"
                    onClick={handleCopy}
                    className="h-10 w-10 shrink-0 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Info Kedaluwarsa Dinamis */}
              {expiresAtDate && (
                <div className="flex items-center gap-1.5 text-[11px] text-amber-500 font-medium bg-amber-500/5 border border-amber-500/10 rounded-md p-2">
                  <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    Tautan ini kedaluwarsa otomatis pada:{" "}
                    {new Date(expiresAtDate).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* TOMBOL AKSI UTAMA */}
          <div className="flex justify-end gap-3 pt-2 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              disabled={isGenerating}
              onClick={() => {
                onOpenChange(false);
                setTimeout(() => setInviteUrl(""), 2000);
              }}
              className="text-xs h-9 cursor-pointer"
            >
              {inviteUrl ? "Selesai" : "Batal"}
            </Button>

            {!inviteUrl && (
              <Button
                type="button"
                disabled={isGenerating || !account}
                onClick={handleGenerateLink}
                className="text-xs h-9 font-semibold gap-2 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Membuat Tautan...
                  </>
                ) : (
                  "Buat Tautan"
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
