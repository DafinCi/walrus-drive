"use client";

import { LucideIcon } from "lucide-react";

interface VerificationStatCardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  iconColorClass?: string;
  borderColorClass?: string;
}

export function VerificationStatCard({
  title,
  value,
  description,
  icon: Icon,
  iconColorClass = "text-muted-foreground",
  borderColorClass = "border-border/50",
}: VerificationStatCardProps) {
  return (
    <div
      className={`p-4 bg-card/60 border ${borderColorClass} rounded-sm flex items-center justify-between shadow-xs transition-all duration-200 hover:shadow-md hover:bg-card`}
    >
      <div className="space-y-1 min-w-0">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider select-none">
          {title}
        </p>
        <h3 className="text-2xl font-bold tracking-tight text-foreground font-mono">
          {value}
        </h3>
        <p className="text-[11px] text-muted-foreground truncate">
          {description}
        </p>
      </div>

      <div
        className={`p-2.5 bg-muted/40 border border-border/40 rounded-sm ${iconColorClass} shrink-0`}
      >
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
}
