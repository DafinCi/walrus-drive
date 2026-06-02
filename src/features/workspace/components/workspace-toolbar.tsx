import {
  LayoutGrid,
  TableProperties,
  Upload,
  UserPlus,
  ArrowUpDown,
  Check, // 🌟 TAMBAHAN: Untuk indikator aktif
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RoleGuard } from "@/features/auth/components/role-guard";
import { FILE_SORT_CONFIG } from "../constants/sort-config"; // 🌟 TAMBAHAN
import { FileSortOption } from "../store/workspace-store"; // 🌟 TAMBAHAN

export interface WorkspaceToolbarProps {
  view: "grid" | "table";
  workspaceId: string;
  currentSort: FileSortOption; // 🌟 TAMBAHAN: State sorting saat ini
  onSortChange: (sort: FileSortOption) => void; // 🌟 TAMBAHAN: Handler pengubah sorting
  onViewChange: (view: "grid" | "table") => void;
  onUploadClick: () => void;
  onInviteClick: () => void;
}

export function WorkspaceToolbar({
  workspaceId,
  view,
  currentSort, // 🌟 Destructure
  onSortChange, // 🌟 Destructure
  view: currentView,
  onViewChange,
  onUploadClick,
  onInviteClick,
}: WorkspaceToolbarProps) {
  // Dapatkan label dinamis berdasarkan opsi yang sedang aktif
  const activeSortLabel = FILE_SORT_CONFIG[currentSort]?.label || "Terbaru";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4">
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              {/* 🌟 UX DINAMIS: Mengikuti preferensi state */}
              <span className="text-xs font-medium">
                Urutkan: {activeSortLabel}
              </span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-48">
            {/* 🌟 LOOPING CONFIG: Bersih tanpa if-else */}
            {Object.entries(FILE_SORT_CONFIG).map(([key, config]) => {
              const isSelected = currentSort === key;
              return (
                <DropdownMenuItem
                  key={key}
                  onClick={() => onSortChange(key as FileSortOption)}
                  className={`cursor-pointer text-sm flex items-center justify-between dynamic-sort-item ${
                    isSelected
                      ? "text-primary font-semibold bg-primary/5 focus:bg-primary/5"
                      : ""
                  }`}
                >
                  <span>{config.label}</span>
                  {/* 🌟 ACTIVE INDICATOR: Tanda centang jika terpilih */}
                  {isSelected && (
                    <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                  )}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* SISI KANAN: View Toggle & Action Buttons */}
      <div className="flex items-center justify-end gap-3 self-end sm:self-auto w-full sm:w-auto">
        <div className="flex items-center border border-border rounded-[6px] p-0.5 bg-muted/20">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewChange("grid")}
            className={`h-8 w-8 rounded-[6px] transition-all ${currentView === "grid" ? "bg-muted text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-transparent"}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewChange("table")}
            className={`h-8 w-8 rounded-[6px] transition-all ${currentView === "table" ? "bg-muted text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-transparent"}`}
          >
            <TableProperties className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-5 w-[1px] bg-border hidden sm:block" />

        <RoleGuard workspaceId={workspaceId} permission="workspace:invite">
          <Button
            variant="outline"
            size="sm"
            onClick={onInviteClick}
            className="h-9 gap-2 text-sm font-medium border-border hover:bg-muted/50"
          >
            <UserPlus className="h-4 w-4 opacity-80" />
            <span className="hidden xs:inline">Undang</span>
          </Button>
        </RoleGuard>

        <RoleGuard workspaceId={workspaceId} permission="file:upload">
          <Button
            size="sm"
            onClick={onUploadClick}
            className="h-9 gap-2 text-sm font-semibold tracking-wide bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/10 cursor-pointer"
          >
            <Upload className="h-4 w-4 stroke-[2.5]" />
            <span>Upload File</span>
          </Button>
        </RoleGuard>
      </div>
    </div>
  );
}
