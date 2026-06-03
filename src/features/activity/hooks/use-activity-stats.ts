import { useQuery } from "@tanstack/react-query";
import { activityService } from "../service/activity.service";

export function useActivityStats(workspaceSlug: string) {
  const { data, isLoading, isError, refetch } = useQuery({
    // Cache key khusus untuk summary statistiknya
    queryKey: ["workspace-activity-stats", workspaceSlug],

    queryFn: () => activityService.getActivityStats(workspaceSlug),

    // Statistik 24 jam bersifat ringkas, kita set staleTime lebih longgar
    staleTime: 1000 * 60 * 2, // 2 Menit
    refetchInterval: 1000 * 60 * 5, // Auto-refresh data statistik di background tiap 5 menit
  });

  return {
    stats: data ?? { uploads: 0, verifications: 0, invites: 0, promotions: 0 },
    isLoading,
    isError,
    refetch,
  };
}
