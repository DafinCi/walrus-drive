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
import { Separator } from "@/components/ui/separator";

// Import Hooks dan Presentational Card yang telah direfaktorisasi
import { InviteLinkCard } from "./invite-link-card";
import {
  useGetWorkspaceInvites,
  useCreateInvite,
  useRevokeInvite,
} from "@/features/invite/hooks/use-invite";

interface InviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteModal({ open, onOpenChange }: InviteModalProps) {
  const params = useParams();
  const account = useCurrentAccount();
  const workspaceId = params.workspaceId as string;

  // State Management untuk form pembuatan
  const [expiresInHours, setExpiresInHours] = useState("24");
  const [inviteUrl, setInviteUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [expiresAtDate, setExpiresAtDate] = useState<string | null>(null);

  // 1. CONSUME LAYER DATA (TanStack Query)
  const { data: invites = [], isLoading: isLoadingInvites } =
    useGetWorkspaceInvites(workspaceId);
  const createInviteMutation = useCreateInvite();
  const revokeInviteMutation = useRevokeInvite();

  // Membaca status loading mutasi
  const isGenerating = createInviteMutation.isPending;

  // 2. HANDLER: Membuat Tautan Baru
  const handleGenerateLink = () => {
    if (!account?.address) {
      toast.error("Aksi Ditolak", {
        description: "Hubungkan wallet Sui Anda terlebih dahulu.",
      });
      return;
    }

    setInviteUrl(""); // Reset display tautan lama

    createInviteMutation.mutate(
      {
        workspaceId,
        createdBy: account.address,
        expiresInHours: Number(expiresInHours),
      },
      {
        onSuccess: (result) => {
          const origin = window.location.origin;
          setInviteUrl(`${origin}/workspace/join/${result.token}`);
          setExpiresAtDate(result.expiresAt);

          toast.success("Tautan Undangan Aktif!", {
            description: "Berhasil didaftarkan ke kluster database.",
          });
        },
        onError: (error) => {
          toast.error("Gagal Membuat Undangan", {
            description:
              error.message || "Pastikan Anda adalah Owner atau Admin.",
          });
        },
      },
    );
  };

  // 3. HANDLER: Mencabut / Revoke Tautan (HTTP DELETE)
  const handleRevokeLink = (token: string) => {
    if (!account?.address) return;

    revokeInviteMutation.mutate(
      {
        token,
        workspaceId,
        walletAddress: account.address,
      },
      {
        onSuccess: () => {
          toast.success("Tautan Dicabut", {
            description:
              "Akses cryptographic token tersebut berhasil dimatikan.",
          });
          // Jika tautan yang sedang di-display di atas adalah yang dihapus, bersihkan display
          if (inviteUrl.endsWith(token)) {
            setInviteUrl("");
            setExpiresAtDate(null);
          }
        },
        onError: (error) => {
          toast.error("Gagal Mencabut Tautan", {
            description: error.message || "Terjadi kendala otoritas hak akses.",
          });
        },
      },
    );
  };

  // 4. HANDLER: Salin ke Clipboard
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

  // Reset state pembuatan saat modal ditutup user
  const handleClose = (v: boolean) => {
    if (isGenerating) return;
    onOpenChange(v);
    if (!v) {
      setTimeout(() => {
        setInviteUrl("");
        setExpiresAtDate(null);
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[460px] bg-card border border-border shadow-2xl flex flex-col max-h-[90vh]">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Link2 className="h-5 w-5 text-primary" />
            Undang Kolaborator
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs leading-relaxed">
            Hasilkan tautan undangan cryptographic unik. Hanya wallet dengan
            alamat yang memegang tautan ini yang dapat mendaftar masuk.
          </DialogDescription>
        </DialogHeader>

        {/* CONTAINER FORM UTAMA & LIST */}
        <div className="flex-1 overflow-y-auto space-y-5 py-3 my-1 pr-1 scrollbar-thin">
          {/* SECTION 1: PEMBUATAN LINK BARU */}
          <div className="space-y-4">
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

            {inviteUrl && (
              <div className="space-y-3 animate-in fade-in-50 slide-in-from-bottom-2 duration-200">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/80">
                    Tautan Undangan Baru Anda
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

                {expiresAtDate && (
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-500 font-medium bg-amber-500/5 border border-amber-500/10 rounded-md p-2">
                    <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">
                      Kedaluwarsa otomatis:{" "}
                      {new Date(expiresAtDate).toLocaleString("id-ID", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <Separator className="bg-border/60" />

          {/* SECTION 2: LIST ACTIVE INVITES (Option A Layout) */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider select-none">
              Tautan Aktif Saat Ini ({invites.length})
            </h4>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-0.5">
              {isLoadingInvites ? (
                <div className="flex flex-col items-center justify-center py-6 gap-2">
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  <span className="text-xs text-muted-foreground">
                    Memuat manifest token...
                  </span>
                </div>
              ) : invites.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-border rounded-lg bg-muted/10">
                  <p className="text-xs text-muted-foreground">
                    Tidak ada tautan undangan aktif.
                  </p>
                </div>
              ) : (
                invites.map((invite) => (
                  <InviteLinkCard
                    key={invite.token}
                    token={invite.token}
                    expiresAt={invite.expires_at}
                    onRevoke={handleRevokeLink}
                    isRevoking={
                      revokeInviteMutation.isPending &&
                      revokeInviteMutation.variables?.token === invite.token
                    }
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* TOMBOL AKSI UTAMA DI BAWAH MODAL */}
        <div className="flex justify-end gap-3 pt-3 border-t border-border/40 shrink-0">
          <Button
            type="button"
            variant="outline"
            disabled={isGenerating}
            onClick={() => handleClose(false)}
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
                  Membuat...
                </>
              ) : (
                "Buat Tautan"
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
