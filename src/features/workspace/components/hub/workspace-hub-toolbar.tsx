"use client";

import { Search, Plus, LogIn } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface WorkspaceHubToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
  onJoinClick: () => void;
}

export function WorkspaceHubToolbar({
  searchQuery,
  onSearchChange,
  onCreateClick,
  onJoinClick,
}: WorkspaceHubToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
      {/* Search Input (Kiri) */}
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari ruang kerja..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-card border-border/70 focus-visible:ring-primary/50"
        />
      </div>

      {/* Action Buttons (Kanan) */}
      <div className="flex items-center w-full sm:w-auto gap-3">
        <Button
          variant="outline"
          onClick={onJoinClick}
          className="w-full sm:w-auto gap-2 text-xs font-semibold"
        >
          <LogIn className="h-4 w-4" />
          Gabung
        </Button>
        <Button
          onClick={onCreateClick}
          className="w-full sm:w-auto gap-2 text-xs font-semibold"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          Buat Baru
        </Button>
      </div>
    </div>
  );
}
