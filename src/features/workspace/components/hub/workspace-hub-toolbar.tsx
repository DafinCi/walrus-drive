"use client";

import { Search, Plus, LogIn, ArrowUpDown, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WORKSPACE_SORT_CONFIG } from "../../constants/sort-config";
import { WorkspaceSortOption } from "../../store/workspace-store";

interface WorkspaceHubToolbarProps {
  searchQuery: string;
  currentSort: WorkspaceSortOption; // 🌟 TAMBAHAN
  onSortChange: (sort: WorkspaceSortOption) => void; // 🌟 TAMBAHAN
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
  onJoinClick: () => void;
}

export function WorkspaceHubToolbar({
  searchQuery,
  currentSort, // 🌟 Destructure
  onSortChange, // 🌟 Destructure
  onSearchChange,
  onCreateClick,
  onJoinClick,
}: WorkspaceHubToolbarProps) {
  const activeSortLabel =
    WORKSPACE_SORT_CONFIG[currentSort]?.label || "Terbaru";

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
      {/* KIRI: Sektor Input Pencarian & Dropdown Urutan */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari ruang kerja..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-card border-border/70 focus-visible:ring-primary/50"
          />
        </div>

        {/* 🌟 TAMBAHAN: Dropdown Urutan Workspace */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-auto h-10 gap-2 text-muted-foreground hover:text-foreground justify-center shrink-0 px-4"
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span className="text-xs font-medium whitespace-nowrap">
                Urutkan: {activeSortLabel}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {Object.entries(WORKSPACE_SORT_CONFIG).map(([key, config]) => {
              const isSelected = currentSort === key;
              return (
                <DropdownMenuItem
                  key={key}
                  onClick={() => onSortChange(key as WorkspaceSortOption)}
                  className={`cursor-pointer text-sm flex items-center justify-between ${
                    isSelected
                      ? "text-primary font-semibold bg-primary/5 focus:bg-primary/5"
                      : ""
                  }`}
                >
                  <span>{config.label}</span>
                  {isSelected && (
                    <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                  )}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ACTION BUTTONS (Kanan) */}
      <div className="flex items-center w-full md:w-auto gap-3 shrink-0">
        <Button
          variant="outline"
          onClick={onJoinClick}
          className="w-full sm:w-auto gap-2 text-xs font-semibold h-10"
        >
          <LogIn className="h-4 w-4" />
          Gabung
        </Button>
        <Button
          onClick={onCreateClick}
          className="w-full sm:w-auto gap-2 text-xs font-semibold h-10"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          Buat Baru
        </Button>
      </div>
    </div>
  );
}
