// src/features/workspace/types/member.types.ts

import { WorkspaceRole } from "@/features/auth/types/auth.types";

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
