"use client";

import { useState } from "react";
import { useParams } from "next/navigation"; // To read the route's current slug
import { X, Layers } from "lucide-react";
import { useActivityStore } from "../store/activity-store";
import { useWorkspaceActivity } from "../hooks/use-workspace-activity";
import { ActivityFilter } from "./activity-filter";
import { ActivityFeed } from "./activity-feed";
import { ActivitySkeleton } from "./activity-skeloton";
import { ActivityFilter as FilterType } from "../types/activity.types";
import { cn } from "@/lib/utils";

export function ActivityPanel() {
  const params = useParams();
  const workspaceSlug = params?.slug as string | undefined;

  const { isActivityOpen, closeActivity } = useActivityStore();
  const [filter, setFilter] = useState<FilterType>("all");

  // Query state pipelines connected directly to the custom hook layer
  const {
    activities,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useWorkspaceActivity({
    workspaceSlug: workspaceSlug || "",
    filter: filter,
    limit: 20,
  });

  return (
    <aside
      className={cn(
        "absolute top-0 right-0 h-full w-full sm:w-[420px] md:w-[450px] max-w-[500px]",
        "border-l border-border bg-background flex flex-col z-30",
        "transition-all duration-300 ease-in-out transform shadow-2xl",
        isActivityOpen
          ? "translate-x-0"
          : "translate-x-full pointer-events-none",
      )}
    >
      {/* PANEL HEADER BLOCK */}
      <div className="h-14 border-b border-border/60 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" />
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-foreground font-heading">
              Workspace Activity
            </span>
            <span className="text-[10px] text-muted-foreground leading-none">
              Recent events from your workspace
            </span>
          </div>
        </div>

        <button
          onClick={closeActivity}
          className="p-1.5 rounded-[6px] text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer"
          title="Close panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* FILTER BUTTON TABS BAR */}
      <ActivityFilter current={filter} onChange={setFilter} />

      {/* INDEPENDENT INTERNAL SCROLLING STREAM FEED BOX */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {isLoading ? (
          <ActivitySkeleton />
        ) : (
          <ActivityFeed
            activities={activities}
            isLoading={isLoading}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onLoadMore={fetchNextPage}
            filter={filter}
          />
        )}
      </div>
    </aside>
  );
}
