"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronDown, Layers, Plus, Loader2, Check } from "lucide-react";
import { useWorkspaceQuery } from "../hooks/use-workspace-query";
import { useWorkspaces } from "../hooks/use-workspaces";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useCurrentAccount } from "@mysten/dapp-kit";

export function WorkspaceSwitcher() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const account = useCurrentAccount();

  // 1. Ambil data workspace SAAT INI
  const { data: currentData, isLoading: isLoadingCurrent } =
    useWorkspaceQuery(slug);

  // 2. Ambil data LIST SEMUA WORKSPACE milik user
  const { data: allWorkspaces, isLoading: isLoadingList } = useWorkspaces(
    account?.address,
  );

  // 🌟 PERBAIKAN: Sortir array agar workspace yang sedang aktif berada di urutan pertama
  const sortedWorkspaces = useMemo(() => {
    if (!allWorkspaces) return [];

    return [...allWorkspaces].sort((a, b) => {
      if (a.slug === slug) return -1; // Tarik ke atas jika slug cocok
      if (b.slug === slug) return 1; // Tarik ke atas jika slug cocok
      return 0; // Biarkan sisanya sesuai urutan aslinya
    });
  }, [allWorkspaces, slug]);

  const workspaceInfo = currentData?.workspace;

  const getInitials = (name: string) => {
    if (!name) return "WS";
    return name.slice(0, 2).toUpperCase();
  };

  const isLoading = isLoadingCurrent || isLoadingList;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={isLoading}
          className="h-9 gap-2 px-2 font-medium text-sm text-foreground hover:bg-muted/60 focus-visible:ring-0 cursor-pointer disabled:opacity-100"
        >
          <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/20 text-primary shrink-0">
            {isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Layers className="h-3.5 w-3.5" />
            )}
          </div>

          {isLoading ? (
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          ) : (
            <span className="truncate max-w-[140px] font-semibold tracking-wide">
              {workspaceInfo?.name || "Unknown Workspace"}
            </span>
          )}

          <ChevronDown className="h-3.5 w-3.5 opacity-50 shrink-0" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-64 mt-1 border-border bg-popover text-popover-foreground rounded-[6px]"
      >
        <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Workspace List
        </DropdownMenuLabel>

        {/* 🌟 PERBAIKAN: Render list dari sortedWorkspaces, bukan allWorkspaces */}
        <div className="max-h-[300px] overflow-y-auto py-1">
          {sortedWorkspaces.map((ws) => (
            <DropdownMenuItem
              key={ws.id}
              onClick={() => router.push(`/workspace/${ws.slug}`)}
              className="gap-2 cursor-pointer font-medium text-sm focus:bg-muted rounded-[6px] mb-0.5"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-primary text-[10px] font-bold">
                {getInitials(ws.name)}
              </div>
              <div className="flex flex-col flex-1 truncate">
                <span className="truncate">{ws.name}</span>
              </div>
              {ws.slug === slug && (
                <Check className="h-3.5 w-3.5 text-primary shrink-0" />
              )}
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator className="bg-border" />

        {/* 🌟 PERBAIKAN: Ubah aksi onClick untuk redirect ke halaman create */}
        <DropdownMenuItem
          onClick={() => router.push("/workspace/create")}
          className="gap-2 cursor-pointer text-muted-foreground hover:text-foreground text-sm focus:bg-muted font-medium rounded-[6px]"
        >
          <Plus className="h-3.5 w-3.5 text-primary" />
          Create New Workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
