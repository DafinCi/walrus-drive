import { ComponentType } from "react";

/**
 * 🌟 Core Event Types for Workspace Activity Log
 * Acts as the single source of truth for all activity logs.
 */
export type ActivityType =
  | "workspace_created"
  | "file_uploaded"
  | "file_verified"
  | "file_verification_failed" // 🌟 TAMBAHAN
  | "file_reverified" // 🌟 TAMBAHAN
  | "file_integrity_passed" // 🌟 TAMBAHAN
  | "file_integrity_failed" // 🌟 TAMBAHAN
  | "invite_created"
  | "member_joined"
  | "member_promoted"
  | "member_removed";

/**
 * 🌟 Filter Options available in the Activity Panel UI
 */
export type ActivityFilter = "all" | "uploads" | "verification" | "members";

/**
 * 🌟 The Actor who triggered the activity
 */
export interface ActivityActor {
  wallet: string;
  name?: string;
  avatarUrl?: string; // Optional but ready for professional UI profile circles
}

/**
 * 🌟 The Entity that is being acted upon
 * Enhanced with resource identification for secure click-to-navigate UX.
 */
export interface ActivityTarget {
  id: string;
  name: string;
  type: "file" | "member" | "workspace" | "invite";
}

/**
 * 🌟 Strict Metadata Typing Per Event (DX & Type Safety Boost)
 * Keeps code clean without creating dozens of separate entity interfaces.
 */
export type ActivityMetadata =
  | { type: "workspace_created"; size?: never; checkpoint?: never }
  | { type: "file_uploaded"; size: number; mimeType?: string }
  | {
      type: "file_verified";
      checkpoint: string;
      txDigest: string;
      network: "sui-mainnet" | "sui-testnet";
    }
  | { type: "invite_created"; expiresIn: string; role: string }
  | { type: "member_joined"; joinedVia: "link" | "direct" }
  | { type: "member_promoted"; fromRole: string; toRole: string }
  | { type: "member_removed"; reason?: string };

/**
 * 🌟 Main Activity Log Entity Structure
 */
export interface Activity {
  id: string;
  workspaceId: string;
  type: ActivityType;
  actor: ActivityActor;
  target?: ActivityTarget;
  metadata?: ActivityMetadata & Record<string, unknown>; // Safe fallback for generic access
  createdAt: string; // ISO Timestamp string
}

/**
 * 🌟 UI Presentation Model
 * Transformed representation optimized for direct UI rendering.
 */
export interface ActivityPresentation {
  title: string;
  description: string;
  iconName:
    | "plus"
    | "upload"
    | "shield"
    | "mail"
    | "user-plus"
    | "user-cog"
    | "user-minus"
    | "default";
}

/**
 * 🌟 Input Structure for creating a new activity log
 * Aligned with camelCase frontend and mapped to snake_case database columns.
 */
export interface CreateActivityInput {
  workspaceId: string;
  actorWalletAddress: string;
  action:
    | "FILE_UPLOADED"
    | "FILE_VERIFIED"
    | "FILE_VERIFICATION_FAILED"
    | "FILE_REVERIFIED" // 🌟 TAMBAHAN
    | "FILE_INTEGRITY_PASSED" // 🌟 TAMBAHAN
    | "FILE_INTEGRITY_FAILED" // 🌟 TAMBAHAN
    | "MEMBER_INVITED"
    | "MEMBER_JOINED"
    | "INVITE_CREATED"
    | "MEMBER_PROMOTED"
    | "MEMBER_REMOVED"
    | "WORKSPACE_CREATED";
  entityType: "file" | "member" | "workspace" | "invite" | "verification";
  entityId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * 🌟 Paginated API Response Shape for TanStack useInfiniteQuery
 */
export interface PaginatedActivityResponse {
  data: Activity[];
  nextCursor: string | null; // Will return the createdAt timestamp of the last item, or null if end of feed
}

/**
 * 🌟 Activity Summary Statistics for the past 24 hours
 */
export interface ActivityStats {
  uploads: number;
  verifications: number;
  invites: number;
  promotions: number;
}
