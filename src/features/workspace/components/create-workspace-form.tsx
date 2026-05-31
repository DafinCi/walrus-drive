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
import { Loader2, Check, AlertTriangle } from "lucide-react";

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
  const currentDescription = watch("description") || "";
  const debouncedSlug = useDebounce(currentSlug, 400);

  React.useEffect(() => {
    if (!isSlugEditable && currentName) {
      setValue("slug", generateSlug(currentName), { shouldValidate: true });
    }
  }, [currentName, isSlugEditable, setValue]);

  React.useEffect(() => {
    async function checkSlug() {
      if (!debouncedSlug || debouncedSlug.length < 3) {
        setIsSlugAvailable(null);
        return;
      }

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
    if (isSlugAvailable === false) return;
    mutation.mutate(data, {
      onError: (err: any) => {
        form.setError("root", { message: err.message });
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
        {formState.errors.root && (
          <div className="p-3 text-xs bg-destructive/5 border border-destructive/20 text-destructive rounded-sm font-medium flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{formState.errors.root.message}</span>
          </div>
        )}

        {/* 1. NAME FIELD */}
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-xs font-semibold text-foreground">
                Workspace Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Acme Corp"
                  className="h-9 bg-background rounded-sm border-input text-xs"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-[11px]" />
            </FormItem>
          )}
        />

        {/* 2. COMPOSITE SLUG FIELD (NO OVERLAPPING LOGIC) */}
        <FormField
          control={control}
          name="slug"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <div className="flex items-center justify-between">
                <FormLabel className="text-xs font-semibold text-foreground">
                  Workspace URL
                </FormLabel>
                {!isSlugEditable && currentName && (
                  <button
                    type="button"
                    onClick={() => setIsSlugEditable(true)}
                    className="text-[10px] text-muted-foreground hover:text-foreground font-mono underline underline-offset-2"
                  >
                    Edit Manual
                  </button>
                )}
              </div>

              <FormControl>
                <div className="flex rounded-sm shadow-none">
                  {/* Prefix Box Ganti Posisi Absolute */}
                  <span className="inline-flex items-center px-3 rounded-l-sm border border-r-0 border-input bg-muted text-muted-foreground text-[11px] font-mono select-none">
                    WalSpace.io/
                  </span>

                  {/* Input Box murni sebelah kanan */}
                  <div className="relative flex-1">
                    <Input
                      className="rounded-r-sm rounded-l-none border-l-0 h-9 bg-background font-mono text-xs pr-9"
                      disabled={!isSlugEditable && !!currentName}
                      placeholder="acme-corp"
                      {...field}
                      onChange={(e) => {
                        setIsSlugEditable(true);
                        field.onChange(e);
                      }}
                    />
                    {/* Status Indicator inside right input edge */}
                    <div className="absolute inset-y-0 right-2.5 flex items-center">
                      {slugChecking && (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                      )}
                      {!slugChecking && isSlugAvailable === true && (
                        <Check className="h-3.5 w-3.5 text-emerald-500 stroke-[3]" />
                      )}
                      {!slugChecking && isSlugAvailable === false && (
                        <span className="text-[10px] text-destructive font-bold font-mono">
                          TAKEN
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </FormControl>
              <FormMessage className="text-[11px]" />
            </FormItem>
          )}
        />

        {/* 3. DESCRIPTION FIELD */}
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <div className="flex justify-between items-baseline">
                <FormLabel className="text-xs font-semibold text-foreground">
                  Description{" "}
                  <span className="text-[10px] text-muted-foreground font-normal">
                    (Optional)
                  </span>
                </FormLabel>
                <span className="text-[10px] font-mono text-muted-foreground/60">
                  {currentDescription.length}/160
                </span>
              </div>
              <FormControl>
                <Input
                  placeholder="Repository for shared organization assets."
                  className="h-9 bg-background rounded-sm text-xs"
                  maxLength={160}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-[11px]" />
            </FormItem>
          )}
        />

        {/* SELECTORS GRID */}
        <div className="flex gap-4 border-t border-border pt-4 mt-2 ">
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

        {/* SUBMIT BUTTON */}
        <Button
          type="submit"
          className="w-full h-9 font-semibold text-xs rounded-sm shadow-none mt-2 uppercase tracking-wider"
          disabled={
            mutation.isPending || isSlugAvailable === false || !walletAddress
          }
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              Deploying Container...
            </>
          ) : !walletAddress ? (
            "Wallet Disconnected"
          ) : (
            "Initialize Workspace"
          )}
        </Button>
      </form>
    </Form>
  );
}
