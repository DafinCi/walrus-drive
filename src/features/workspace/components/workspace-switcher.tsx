"use client";

import { useParams, useRouter } from "next/navigation";
import { ChevronDown, Layers, Plus, Loader2 } from "lucide-react";
import { useWorkspaceQuery } from "../hooks/use-workspace-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function WorkspaceSwitcher() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspaceId as string;

  // 🔥 1. Ambil data payload utuh dari TanStack Query
  const { data, isLoading, error } = useWorkspaceQuery(workspaceId);

  // 🔥 2. Ekstrak sub-objek metadata workspace-nya saja biar aman dan type-safe
  const workspaceInfo = data?.workspace;

  // Helper untuk memotong inisial nama (contoh: "Hackathon Alpha" -> "HA")
  const getInitials = (name: string) => {
    if (!name) return "WS";
    return name.slice(0, 2).toUpperCase();
  };

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

          {/* Efek Skeleton Loading jika data belum siap */}
          {isLoading ? (
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          ) : error ? (
            <span className="text-destructive text-xs">Error memuat</span>
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
        className="w-56 mt-1 border-border bg-popover text-popover-foreground"
      >
        <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Workspace Saat Ini
        </DropdownMenuLabel>

        {!isLoading && workspaceInfo && (
          <DropdownMenuItem className="gap-2 cursor-default font-medium text-sm focus:bg-transparent">
            <div className="flex h-4 w-4 items-center justify-center rounded bg-primary/20 text-primary text-[10px] font-bold">
              {getInitials(workspaceInfo.name)}
            </div>
            <span className="truncate">{workspaceInfo.name}</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator className="bg-border" />

        <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-normal">
          Workspace Lainnya (Static Placeholder)
        </DropdownMenuLabel>
        <DropdownMenuItem className="gap-2 cursor-pointer text-muted-foreground text-sm opacity-60">
          <div className="flex h-4 w-4 items-center justify-center rounded bg-muted text-muted-foreground text-[10px] font-bold">
            DE
          </div>
          Development Environment
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-border" />

        <DropdownMenuItem
          onClick={() => router.push("/workspace/create")}
          className="gap-2 cursor-pointer text-muted-foreground hover:text-foreground text-sm focus:bg-muted"
        >
          <Plus className="h-3.5 w-3.5" />
          Buat Workspace Baru
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
