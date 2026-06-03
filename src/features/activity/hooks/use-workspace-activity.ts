import { useInfiniteQuery } from "@tanstack/react-query";
import { activityService } from "../service/activity.service";
import { ActivityFilter } from "../types/activity.types";

interface UseWorkspaceActivityProps {
  workspaceSlug: string;
  filter?: ActivityFilter;
  limit?: number;
}

export function useWorkspaceActivity({
  workspaceSlug,
  filter = "all",
  limit = 20,
}: UseWorkspaceActivityProps) {
  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    // ⚡ CACHE KEY OPTIMAL: Otomatis cache terisolasi per workspace DAN per jenis filter
    queryKey: ["workspace-activity", workspaceSlug, filter],

    // ⚡ PAGINATION CONTROL: pageParam akan diisi otomatis oleh getNextPageParam sebagai kursor
    queryFn: ({ pageParam }) =>
      activityService.getWorkspaceActivities({
        workspaceSlug,
        filter,
        limit,
        cursor: pageParam as string | undefined,
      }),

    initialPageParam: undefined as string | undefined,

    // ⚡ CURSOR MATCHER: Membaca nextCursor dari backend untuk token query berikutnya
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,

    // Mencegah hit ulang konstan saat window focus jika tidak diperlukan
    refetchOnWindowFocus: false,
    staleTime: 1000 * 30, // Data dianggap segar selama 30 detik
  });

  // 🌟 FLATTEN DATA LAYER: Mengubah susunan pages menjadi satu single array siap pakai di UI
  const activities = data?.pages.flatMap((page) => page.data) ?? [];

  return {
    activities,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  };
}
