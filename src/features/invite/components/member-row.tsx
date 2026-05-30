"use client";

import { useParams } from "next/navigation";
import { useCurrentAccount } from "@mysten/dapp-kit";
import {
  Loader2,
  MoreVertical,
  ShieldCheck,
  User,
  Star,
  Trash2,
  ArrowUpCircleIcon,
} from "lucide-react";
import { toast } from "sonner";

import {
  WorkspaceMemberWithMeta,
  WorkspaceRole,
} from "@/features/workspace/types/member.types";
import {
  usePromoteMember,
  useRemoveMember,
} from "@/features/workspace/hooks/use-workspace-members";
import { formatTruncateWallet, formatTimeAgo } from "@/lib/formatters";
import {
  canManageRole,
  isOwner as checkIsOwner,
  isAdmin as checkIsAdmin,
} from "@/features/auth/services/auth.service"; // 🔥 Import dari auth.service
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface MemberRowProps {
  member: WorkspaceMemberWithMeta;
  currentUserRole: WorkspaceRole;
}

function getDeterministicGradient(address: string) {
  const gradients = [
    "from-blue-500 to-indigo-600",
    "from-emerald-400 to-teal-600",
    "from-purple-500 to-deeppurple-600",
    "from-rose-400 to-pink-600",
    "from-amber-400 to-orange-600",
  ];
  const charCodeSum = address
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return gradients[charCodeSum % gradients.length];
}

export function MemberRow({ member, currentUserRole }: MemberRowProps) {
  const params = useParams();
  const account = useCurrentAccount();
  const workspaceId = params.workspaceId as string;
  const actorWallet = account?.address;

  const promoteMutation = usePromoteMember();
  const removeMutation = useRemoveMember();
  const isMutating = promoteMutation.isPending || removeMutation.isPending;
  const gradientClass = getDeterministicGradient(member.wallet_address);
  const initials = member.wallet_address.slice(2, 4).toUpperCase();

  // 🔥 Pakai helper dari auth.service
  const isOwner = checkIsOwner(member.role);
  const isAdmin = checkIsAdmin(member.role);

  // 🔥 Logic permission UI jauh lebih bersih
  const canManage =
    !member.isCurrentUser && canManageRole(currentUserRole, member.role);

  const handlePromote = () => {
    if (!actorWallet || isMutating) return;
    promoteMutation.mutate(
      { workspaceId, targetWallet: member.wallet_address, actorWallet },
      {
        onSuccess: (res) =>
          toast.success("Otoritas Diperbarui", { description: res.message }),
        onError: (err) =>
          toast.error("Gagal Mempromosikan", { description: err.message }),
      },
    );
  };

  const handleRemove = () => {
    if (!actorWallet || isMutating) return;
    toast.loading("Memutuskan akses kriptografi...", {
      id: `remove-${member.id}`,
    });
    removeMutation.mutate(
      { workspaceId, targetWallet: member.wallet_address, actorWallet },
      {
        onSuccess: () =>
          toast.success("Akses Dicabut", {
            id: `remove-${member.id}`,
            description:
              "Kolaborator berhasil dikeluarkan dari struktur organisasi.",
          }),
        onError: (err) =>
          toast.error("Aksi Gagal", {
            id: `remove-${member.id}`,
            description: err.message,
          }),
      },
    );
  };

  return (
    <div className="flex items-center justify-between p-2.5 rounded-sm border border-border/40 bg-background/50 hover:bg-muted/30 transition-all duration-150 group">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`h-8 w-8 rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center text-[10px] font-bold text-white shadow-sm shrink-0 select-none`}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono font-medium text-foreground truncate">
              {formatTruncateWallet(member.wallet_address, 5)}
            </span>
            {member.isCurrentUser && (
              <span className="text-[10px] bg-primary/10 text-primary px-1 rounded font-sans font-medium select-none">
                Anda
              </span>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground">
            {formatTimeAgo(member.joined_at)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {isOwner ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full select-none">
            <Star className="h-2.5 w-2.5 fill-amber-500" /> Owner
          </span>
        ) : isAdmin ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full select-none">
            <ShieldCheck className="h-2.5 w-2.5" /> Admin
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-muted border border-border/50 px-2 py-0.5 rounded-full select-none">
            <User className="h-2.5 w-2.5" /> Member
          </span>
        )}

        {canManage && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                disabled={isMutating}
                size="icon"
                variant="ghost"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 transition-opacity duration-150 cursor-pointer disabled:opacity-50"
              >
                {isMutating ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                ) : (
                  <MoreVertical className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-card border-border text-xs w-44 shadow-lg"
            >
              {member.role === "member" && currentUserRole === "owner" && (
                <DropdownMenuItem
                  onClick={handlePromote}
                  className="gap-2 cursor-pointer text-foreground py-1.5 focus:bg-muted"
                >
                  <ArrowUpCircleIcon className="h-3.5 w-3.5 text-primary" />{" "}
                  Promote to Admin
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={handleRemove}
                className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 py-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" /> Keluarkan Member
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
