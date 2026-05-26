export type WorkspaceRole = "owner" | "admin" | "member";

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  wallet_address: string;
  role: WorkspaceRole;
  joined_at: string;
}

export interface WorkspaceMemberWithMeta extends WorkspaceMember {
  isCurrentUser: boolean;
}
