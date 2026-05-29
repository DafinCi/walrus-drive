// src/features/workspace/components/create-workspace-form.tsx
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  createWorkspaceSchema,
  type CreateWorkspaceInput,
} from "../validations/create-workspace-schema";
import { generateSlug } from "../utils/slug";
import { WorkspaceVisibilitySelect } from "./workspace-visibility-select";
import { WorkspaceUploadPolicySelect } from "./workspace-upload-policy-select";
import { useCreateWorkspace } from "../hooks/use-create-workspace";
import { workspaceService } from "../services/workspace.service";
import { useDebounce } from "@/hooks/use-debounce";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

interface CreateWorkspaceFormProps {
  walletAddress: string | undefined;
}

export function CreateWorkspaceForm({
  walletAddress,
}: CreateWorkspaceFormProps) {
  const mutation = useCreateWorkspace(walletAddress);
  const [isSlugEditable, setIsSlugEditable] = React.useState(false);
  const [slugChecking, setSlugChecking] = React.useState(false);
  const [isSlugAvailable, setIsSlugAvailable] = React.useState<boolean | null>(
    null,
  );

  const form = useForm<CreateWorkspaceInput>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      visibility: "private",
      upload_policy: "members_only",
    },
  });

  const { watch, setValue, control, handleSubmit, formState } = form;

  const currentName = watch("name");
  const currentSlug = watch("slug");
  const debouncedSlug = useDebounce(currentSlug, 500);

  // Efek 1: Auto-generate slug dari nama secara real-time jika user belum meng-custom manual
  React.useEffect(() => {
    if (!isSlugEditable && currentName) {
      setValue("slug", generateSlug(currentName), { shouldValidate: true });
    }
  }, [currentName, isSlugEditable, setValue]);

  // Efek 2: Debounced Checker untuk ketersediaan slug via backend endpoint
  React.useEffect(() => {
    async function checkSlug() {
      if (!debouncedSlug || debouncedSlug.length < 3) {
        setIsSlugAvailable(null);
        return;
      }

      // Ambil validasi format dasar dari Regex Zod sebelum hit API
      const isValidFormat = /^[a-z0-9-]+$/.test(debouncedSlug);
      if (!isValidFormat) {
        setIsSlugAvailable(false);
        return;
      }

      setSlugChecking(true);
      try {
        const isAvailable =
          await workspaceService.checkSlugAvailability(debouncedSlug);
        setIsSlugAvailable(isAvailable);
      } catch {
        setIsSlugAvailable(null);
      } finally {
        setSlugChecking(false);
      }
    }

    checkSlug();
  }, [debouncedSlug]);

  const onSubmit = (data: CreateWorkspaceInput) => {
    if (isSlugAvailable === false) return; // Kunci submit jika slug bentrok
    mutation.mutate(data, {
      onError: (err: any) => {
        form.setError("root", { message: err.message });
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
        {formState.errors.root && (
          <div className="p-3 text-sm bg-destructive/10 border border-destructive/20 text-destructive rounded-lg font-medium">
            ⚠️ {formState.errors.root.message}
          </div>
        )}

        {/* 1. INPUT FIELD: NAMA WORKSPACE */}
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">
                Workspace Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Tresto Labs"
                  className="h-11 bg-background/50"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Gunakan nama brand, tim, atau proyek desentralisasi lu.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 2. INPUT FIELD: SLUG URL (WITH INLINE AVAILABILITY INDICATOR) */}
        <FormField
          control={control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm font-semibold">
                  Custom Slug URL
                </FormLabel>
                {!isSlugEditable && currentName && (
                  <button
                    type="button"
                    onClick={() => setIsSlugEditable(true)}
                    className="text-xs text-primary font-medium hover:underline"
                  >
                    Edit Manual
                  </button>
                )}
              </div>
              <FormControl>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-sm text-muted-foreground/60 select-none">
                    trestospace.io/
                  </span>
                  <Input
                    className="pl-[104px] pr-10 h-11 bg-background/50 font-mono text-sm"
                    disabled={!isSlugEditable && !!currentName}
                    placeholder="tresto-labs"
                    {...field}
                    onChange={(e) => {
                      setIsSlugEditable(true);
                      field.onChange(e);
                    }}
                  />
                  {/* Blok Aksesoris UI Status Ketersediaan Slug */}
                  <div className="absolute right-3">
                    {slugChecking && (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                    {!slugChecking && isSlugAvailable === true && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    )}
                    {!slugChecking && isSlugAvailable === false && (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                </div>
              </FormControl>
              {isSlugAvailable === false && (
                <p className="text-xs font-medium text-destructive mt-1">
                  Slug ini sudah diklaim oleh wallet lain.
                </p>
              )}
              <FormDescription>
                Alamat publik unik yang akan digunakan untuk berbagi tautan
                workspace.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 3. INPUT FIELD: DESKRIPSI ORGANISASI */}
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">
                Description{" "}
                <span className="text-xs text-muted-foreground/60">
                  (Opsional)
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Build secure collaborative storage..."
                  className="h-11 bg-background/50"
                  maxLength={160}
                  {...field}
                />
              </FormControl>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Ringkasan singkat fungsi workspace lu.</span>
                <span className="font-mono">
                  {(currentDescription || "").length}/160
                </span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-muted-foreground/10 pt-5">
          {/* 4. VISIBILITY SELECTOR */}
          <FormField
            control={control}
            name="visibility"
            render={({ field }) => (
              <WorkspaceVisibilitySelect
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />

          {/* 5. UPLOAD POLICY SELECTOR */}
          <FormField
            control={control}
            name="upload_policy"
            render={({ field }) => (
              <WorkspaceUploadPolicySelect
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />
        </div>

        {/* BUTTON SUBMIT DENGAN PERLINDUNGAN STATUS CONNECTION & MUTATION */}
        <Button
          type="submit"
          className="w-full h-11 font-medium mt-2"
          disabled={
            mutation.isPending || isSlugAvailable === false || !walletAddress
          }
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyebarkan Kontainer Workspace...
            </>
          ) : !walletAddress ? (
            "Harap Hubungkan Wallet Lu"
          ) : (
            "Buat Workspace Baru"
          )}
        </Button>
      </form>
    </Form>
  );
}

// Helper internal kecil agar form tidak crash menghitung karakter deskripsi yang kosong
const currentDescription = "";
