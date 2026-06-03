"use client";

export function ActivitySkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="flex gap-3 p-3 border border-border/40 rounded-[6px] bg-muted/10"
        >
          <div className="w-8 h-8 rounded-[6px] bg-muted shrink-0" />
          <div className="space-y-2 w-full">
            <div className="h-3.5 w-1/3 bg-muted rounded-sm" />
            <div className="h-3 w-3/4 bg-muted/60 rounded-sm" />
            <div className="h-2.5 w-24 bg-muted/40 rounded-sm pt-1" />
          </div>
        </div>
      ))}
    </div>
  );
}
