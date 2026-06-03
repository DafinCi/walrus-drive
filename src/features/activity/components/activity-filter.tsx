"use client";

import { ActivityFilter as FilterType } from "../types/activity.types";
import { cn } from "@/lib/utils";

interface ActivityFilterProps {
  current: FilterType;
  onChange: (filter: FilterType) => void;
}

export function ActivityFilter({ current, onChange }: ActivityFilterProps) {
  const options: { label: string; value: FilterType }[] = [
    { label: "All", value: "all" },
    { label: "Files", value: "uploads" },
    { label: "Proofs", value: "verification" },
    { label: "Members", value: "members" },
  ];

  return (
    <div className="flex items-center gap-1.5 p-2 bg-muted/30 border-b border-border/50 overflow-x-auto no-scrollbar shrink-0">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "px-2.5 py-1 text-[11px] font-semibold rounded-[6px] transition-all cursor-pointer select-none border whitespace-nowrap",
            current === opt.value
              ? "bg-primary/10 text-primary border-primary/20 shadow-xs"
              : "bg-transparent text-muted-foreground border-transparent hover:bg-muted hover:text-foreground",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
