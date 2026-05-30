// src/features/auth/types/auth.types.ts

export type WorkspaceRole = "owner" | "admin" | "member";

// Matrix lengkap semua tindakan yang bisa dilakukan di Workspace
export type WorkspacePermission =
  | "workspace:update"
  | "workspace:delete"
  | "workspace:invite"
  | "member:remove"
  | "member:promote"
  | "file:upload";
