import {
  Activity,
  ActivityFilter,
  ActivityStats,
  CreateActivityInput,
  PaginatedActivityResponse,
} from "../types/activity.types";

class ActivityService {
  /**
   * 1. CREATE ACTIVITY LOG
   * Triggers a log entry creation. Usually called inside other API routes
   * (like upload completion or verification success callbacks).
   */
  async createActivity(input: CreateActivityInput): Promise<Activity> {
    const response = await fetch(`/api/workspace/internal/activity`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error("Failed to compile workspace activity log");
    }

    return response.json();
  }

  /**
   * 2. FETCH WORKSPACE ACTIVITIES WITH CURSOR PAGINATION & FILTERING
   * Perfectly optimized for TanStack Query's useInfiniteQuery hook.
   */
  async getWorkspaceActivities(params: {
    workspaceSlug: string;
    filter?: ActivityFilter;
    cursor?: string; // ISO Timestamp string used as cursor
    limit?: number;
  }): Promise<PaginatedActivityResponse> {
    const { workspaceSlug, filter = "all", cursor, limit = 20 } = params;

    // Build clean query string parameters
    const queryParams = new URLSearchParams();
    queryParams.append("limit", limit.toString());
    queryParams.append("filter", filter);
    if (cursor) {
      queryParams.append("cursor", cursor);
    }

    const response = await fetch(
      `/api/workspace/${workspaceSlug}/activity?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to retrieve workspace activities");
    }

    return response.json();
  }

  /**
   * 3. FETCH ACTIVITY STATS (Past 24 Hours Metrics)
   * Feeds data to the high-level summary inside the Activity Panel Header.
   */
  async getActivityStats(workspaceSlug: string): Promise<ActivityStats> {
    const response = await fetch(
      `/api/workspace/${workspaceSlug}/activity/stats`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to compute workspace activity statistics");
    }

    return response.json();
  }
}

export const activityService = new ActivityService();
