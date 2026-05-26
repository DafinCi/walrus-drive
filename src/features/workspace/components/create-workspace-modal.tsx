"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

// Import Shadcn UI Components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// 1. Skema Validasi Zod (Sesuai Aturan Kriteria Form)
const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Nama workspace minimal berdurasi 3 karakter." })
    .max(32, { message: "Nama workspace maksimal 32 karakter." })
    .trim(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateWorkspaceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateWorkspaceModal({
  open,
  onOpenChange,
}: CreateWorkspaceModalProps) {
  const router = useRouter();
  const account = useCurrentAccount();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. Inisialisasi React Hook Form dengan Zod Resolver
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  // 3. Handler Submit Aksi Utama
  const onSubmit = async (values: FormValues) => {
    // Proteksi Web3 guard di sisi client
    if (!account?.address) {
      toast.error("Aksi Ditolak", {
        description: "Hubungkan wallet Sui Anda terlebih dahulu di navbar.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/workspace/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          ownerAddress: account.address,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Gagal membuat runtime workspace.");
      }

      // Notifikasi Sukses
      toast.success("Workspace Berhasil Dibuat!", {
        description: `Kamar kolaborasi "${values.name}" siap digunakan.`,
      });

      // Reset form state dan tutup modal portal
      form.reset();
      onOpenChange(false);

      // REDIRECT LANGSUNG KE WORKSPACE BARU (Sesuai Aturan Tanggung Jawab)
      router.push(`/workspace/${result.workspaceId}`);
      router.refresh();
    } catch (error: any) {
      console.error("Form Submit Error:", error);
      toast.error("Pembuatan Gagal", {
        description:
          error.message || "Terjadi kesalahan pada internal cluster server.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !isSubmitting && onOpenChange(v)}>
      <DialogContent className="sm:max-w-[420px] bg-card border border-border shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Workspace Baru
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs leading-relaxed">
            Buat ruang enkripsi baru untuk mendistribusikan berkas
            terdesentralisasi Anda ke Walrus Protocol.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 pt-2"
          >
            {/* Input Nama Workspace */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs font-semibold text-foreground/80">
                    Nama Workspace
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contoh: Project Alpha DeFi"
                      disabled={isSubmitting}
                      className="bg-background border-border focus-visible:ring-1 focus-visible:ring-primary text-sm h-10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[11px] font-medium text-destructive" />
                </FormItem>
              )}
            />

            {/* Tombol Eksekusi */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => onOpenChange(false)}
                className="text-xs h-9 cursor-pointer"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !account}
                className="text-xs h-9 font-semibold gap-2 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Membuat...
                  </>
                ) : (
                  "Buat Workspace"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
