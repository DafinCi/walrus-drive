"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// Import Presentational Components & Hooks
import {
  useValidateInvite,
  useJoinWorkspace,
} from "@/features/invite/hooks/use-join-workspace";
import { InviteErrorState } from "@/features/invite/components/invite-error-state";
import { JoinWorkspaceCard } from "@/features/invite/components/join-workspace-card";

export default function JoinWorkspaceContent() {
  const params = useParams();
  const router = useRouter();
  const account = useCurrentAccount();
  const token = params.token as string;

  // Jalankan query validasi secara langsung tanpa hambatan hydration
  const { data, isLoading, isError } = useValidateInvite(
    token,
    account?.address,
  );
  const joinMutation = useJoinWorkspace();

  // 🔥 Auto-Redirect Aman tanpa cascading render error
  useEffect(() => {
    if (isLoading || !data) return;

    if (data.membership?.alreadyMember && data.workspace?.id) {
      toast.info("Akses Terdeteksi", {
        description: `Anda sudah menjadi anggota di ${data.workspace.name}. Mengalihkan langsung...`,
      });
      router.replace(`/workspace/${data.workspace.id}`);
    }
  }, [data, isLoading, router]);

  // Loading State saat mengambil data token
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-6 w-6 text-primary animate-spin" />
        <p className="text-xs text-muted-foreground font-medium animate-pulse">
          Memverifikasi tanda enkripsi undangan...
        </p>
      </div>
    );
  }

  // Error Fallback State jika server bermasalah
  if (isError || !data) {
    return <InviteErrorState type="invalid" />;
  }

  // Jika token terbukti rusak / tidak terdaftar
  if (!data.invite.valid) {
    return <InviteErrorState type="invalid" />;
  }

  // Jika token terbukti kedaluwarsa
  if (data.invite.expired) {
    return <InviteErrorState type="expired" />;
  }

  // Handler Eksekusi Pendaftaran Member Baru
  const handleExecuteJoin = () => {
    if (!account?.address) return;

    joinMutation.mutate(
      {
        token,
        walletAddress: account.address,
      },
      {
        onSuccess: (result) => {
          toast.success("Berhasil Bergabung!", {
            description: "Kunci akses ruang kerja Anda telah dikonfigurasi.",
          });
          router.replace(`/workspace/${result.workspaceId}`);
        },
        onError: (err: any) => {
          toast.error("Gagal Masuk", {
            description:
              err.message || "Terjadi galat tak terduga saat registrasi.",
          });
        },
      },
    );
  };

  return (
    <JoinWorkspaceCard
      workspaceName={data.workspace?.name || "Unknown Workspace"}
      ownerAddress={data.workspace?.owner_address || ""}
      isConnected={!!account}
      isJoining={joinMutation.isPending}
      onJoin={handleExecuteJoin}
    />
  );
}
