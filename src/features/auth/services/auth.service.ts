// src/features/auth/services/auth.service.ts

import { WorkspaceRole, WorkspacePermission } from "../types/auth.types";

// 1. Permission Matrix
const PERMISSION_MATRIX: Record<WorkspaceRole, WorkspacePermission[]> = {
  owner: [
    "workspace:update",
    "workspace:delete",
    "workspace:invite",
    "member:remove",
    "member:promote",
    "file:upload",
  ],
  admin: ["workspace:invite", "member:remove", "file:upload"],
  member: ["file:upload"],
};

// 2. Permission Resolver
export function hasPermission(
  role: WorkspaceRole,
  permission: WorkspacePermission,
): boolean {
  return PERMISSION_MATRIX[role]?.includes(permission) ?? false;
}

// 3. Role Hierarchy (Menggantikan canPromote & canRemove yang terpisah)
export function canManageRole(
  actorRole: WorkspaceRole,
  targetRole: WorkspaceRole,
): boolean {
  if (actorRole === "owner" && targetRole !== "owner") return true; // Owner bisa manage admin/member
  if (actorRole === "admin" && targetRole === "member") return true; // Admin cuma bisa manage member
  return false; // Sisanya ditolak
}

// 4. Role Checkers (Biar UI bersih dari hardcode string "owner")
export const isOwner = (role: WorkspaceRole) => role === "owner";
export const isAdmin = (role: WorkspaceRole) => role === "admin";
export const isMember = (role: WorkspaceRole) => role === "member";
