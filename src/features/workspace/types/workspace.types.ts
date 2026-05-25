export interface Workspace {
  id: string;
  name: string;
  owner_address: string;
  is_public: boolean;
  allow_public_upload: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceFile {
  id: string;
  workspace_id: string;
  blob_id: string;
  file_name: string;
  mime_type: string;
  file_size: number;
  wallet_address: string;
  checksum: string;
  storage_epoch: number | null;
  register_tx_digest: string | null;
  certify_tx_digest: string | null;
  created_at: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  wallet_address: string;
  role: "owner" | "admin" | "member";
  joined_at: string;
}

export interface WorkspaceFullPayload {
  workspace: Workspace;
  files: WorkspaceFile[];
  members: WorkspaceMember[];
}
