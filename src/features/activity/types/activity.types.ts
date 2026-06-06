import { ComponentType } from "react";

/**
 * 🌟 Core Event Types for Workspace Activity Log
 * Acts as the single source of truth for all activity logs.
 */
export type ActivityType =
  | "workspace_created"
  | "file_uploaded"
  | "file_verified"
  | "file_verification_failed"
  | "file_reverified"
  | "file_integrity_passed"
  | "file_integrity_failed"
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
  type: "file" | "member" | "workspace" | "invite" | "verification";
}

/**
 * 🌟 Strict Metadata Typing Per Event (DX & Type Safety Boost)
 * Updated to match the snake_case data injected by ActivityLogger.
 */
export type ActivityMetadata =
  | { type: "workspace_created"; size?: never; checkpoint?: never }
  | {
      type: "file_uploaded";
      file_name: string;
      size: number;
      mimeType?: string;
    }
  | {
      type: "file_verified";
      file_name: string;
      checkpoint: string;
      tx_digest: string;
      network?: "sui-mainnet" | "sui-testnet";
    }
  | {
      type: "file_verification_failed";
      file_name: string;
      reason: string;
      tx_digest?: string;
    }
  | { type: "file_reverified"; file_name: string; checkpoint: string }
  | { type: "file_integrity_passed"; file_name: string }
  | { type: "file_integrity_failed"; file_name: string; severity?: string }
  | { type: "invite_created"; invited_role: string; expiresIn?: string }
  | { type: "member_joined"; role: string; joinedVia?: "link" | "direct" }
  | {
      type: "member_promoted";
      old_role: string;
      new_role: string;
      target_wallet?: string;
    }
  | { type: "member_removed"; target_wallet?: string; reason?: string };

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
    | "FILE_REVERIFIED"
    | "FILE_INTEGRITY_PASSED"
    | "FILE_INTEGRITY_FAILED"
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
