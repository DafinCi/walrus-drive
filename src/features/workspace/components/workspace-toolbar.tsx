import {
  LayoutGrid,
  TableProperties,
  Upload,
  UserPlus,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface WorkspaceToolbarProps {
  view: "grid" | "table";
  onViewChange: (view: "grid" | "table") => void;
  onUploadClick: () => void;
  onInviteClick: () => void;
}

export function WorkspaceToolbar({
  view,
  onViewChange,
  onUploadClick,
  onInviteClick,
}: WorkspaceToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4">
      {/* SISI KIRI: Filter & Sort Controls */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Urutkan: Terbaru</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            <DropdownMenuItem className="cursor-pointer text-sm">
              Terbaru
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-sm">
              Terlama
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-sm">
              Nama (A-Z)
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-sm">
              Ukuran Terbesar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* SISI KANAN: View Toggle & Action Buttons */}
      <div className="flex items-center justify-end gap-3 self-end sm:self-auto w-full sm:w-auto">
        {/* Toggle Grid vs Table Layout */}
        <div className="flex items-center border border-border rounded-lg p-0.5 bg-muted/20">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewChange("grid")}
            className={`h-8 w-8 rounded-md transition-all ${
              view === "grid"
                ? "bg-muted text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-transparent"
            }`}
            title="Tampilan Grid"
            aria-label="Tampilan Grid"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewChange("table")}
            className={`h-8 w-8 rounded-md transition-all ${
              view === "table"
                ? "bg-muted text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-transparent"
            }`}
            title="Tampilan Tabel"
            aria-label="Tampilan Tabel"
          >
            <TableProperties className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-5 w-[1px] bg-border hidden sm:block" />

        {/* Invite Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onInviteClick}
          className="h-9 gap-2 text-sm font-medium border-border hover:bg-muted/50"
        >
          <UserPlus className="h-4 w-4 opacity-80" />
          <span className="hidden xs:inline">Undang</span>
        </Button>

        {/* Upload Button (Primary CTA) */}
        <Button
          size="sm"
          onClick={onUploadClick}
          className="h-9 gap-2 text-sm font-semibold tracking-wide bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/10 cursor-pointer"
        >
          <Upload className="h-4 w-4 stroke-[2.5]" />
          <span>Upload File</span>
        </Button>
      </div>
    </div>
  );
}
