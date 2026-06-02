export interface Workspace {
  id: string;
  slug: string;
  name: string;
  description: string | null; // Tambahan Baru: Deskripsi opsional organisasi
  avatar_url: string | null; // Tambahan Baru: URL otomatis untuk identitas visual switcher
  owner_address: string;
  is_public: boolean;
  upload_policy: "owner_only" | "admins_only" | "members_only" | "public"; // Pengganti allow_public_upload (Lebih Scalable)
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

  status?: "pending" | "verified" | "failed";
  checkpoint?: string | null;
  gas_used?: string | null;
  verified_at?: string | null;
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
