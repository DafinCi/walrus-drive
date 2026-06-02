import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"; // Toast bawaan rekomendasi shadcn/ui terbaru

interface VerifyProofPayload {
  fileId: string;
}

export function useVerifyProof(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ fileId }: VerifyProofPayload) => {
      const res = await fetch("/api/proof", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileId }),
      });

      const data = await res.json();

      // Jika server mengembalikan status 202 (Masi Pending di Blockchain)
      if (res.status === 202) {
        throw new Error("PENDING_CHAIN");
      }

      if (!res.ok) {
        throw new Error(data.error || "Gagal memverifikasi file");
      }

      return data;
    },
    onMutate: () => {
      // Menampilkan loading toast yang interaktif
      return {
        toastId: toast.loading(
          "Memverifikasi cryptographic proof di Sui Network...",
        ),
      };
    },
    onSuccess: (data, variables, context) => {
      // 1. Update notifikasi menjadi sukses
      toast.success("Integritas kriptografis terverifikasi!", {
        id: context?.toastId,
        description: `Checkpoint: ${data.data.checkpoint}`,
      });

      // 2. 🌟 MAGIC TOUCH: Invalidation cache berdasarkan slug workspace!
      // Semua komponen yang berlangganan data file di workspace ini akan otomatis ke-refresh.
      queryClient.invalidateQueries({
        queryKey: ["workspace-files", slug],
      });

      // 2. 🌟 TAMBAHAN BARU: Otomatis refresh metrics di Verification Center!
      queryClient.invalidateQueries({
        queryKey: ["workspace-integrity", slug],
      });
    },
    onError: (error: any, variables, context) => {
      if (error.message === "PENDING_CHAIN") {
        toast.info("Transaksi masih diproses oleh validator Sui.", {
          id: context?.toastId,
          description:
            "Silakan coba klik verifikasi lagi beberapa saat kemudian.",
        });
      } else {
        toast.error("Verifikasi Gagal", {
          id: context?.toastId,
          description: error.message,
        });
      }
    },
  });
}
