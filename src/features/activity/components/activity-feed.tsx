"use client";

import { useEffect, useRef } from "react";
import { Activity } from "../types/activity.types";
import { ActivityItem } from "./activity-item";
import { ActivityEmpty } from "./activity-empty";
import { Loader2 } from "lucide-react";

interface ActivityFeedProps {
  activities: Activity[];
  isLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  filter: string;
}

export function ActivityFeed({
  activities,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  filter,
}: ActivityFeedProps) {
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.1 },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, isLoading, onLoadMore]);

  if (activities.length === 0 && !isLoading) {
    return <ActivityEmpty filter={filter} />;
  }

  return (
    <div className="space-y-3.5 pr-0.5 pb-6">
      {/* List Feed Mapping Layer */}
      {activities.map((item) => (
        <ActivityItem key={item.id} activity={item} />
      ))}

      {/* Bottom Invisible Observer Target Trigger Bar */}
      {hasNextPage && (
        <div ref={observerRef} className="py-4 flex justify-center w-full">
          {isFetchingNextPage && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
              <span>Loading more event history...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
