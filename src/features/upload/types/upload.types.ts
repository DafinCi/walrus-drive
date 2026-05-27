// Status mesin state lokal untuk UI Dropzone
export type UploadStatus =
  | "idle"
  | "preparing"
  | "action_required" // Saat nunggu user nge-klik Approve di Wallet
  | "processing" // Encoding / Uploading
  | "success"
  | "error";

// Metadata standar yang akan kita simpan
export interface UploadMetadata {
  name: string;
  size: number;
  type: string;
  uploadedAt: number;
}

// Hasil akhir dari service (Bisa dipakai bareng dengan upload.service.ts)
export interface WalrusUploadResult {
  blobId: string;
  txDigest: {
    register: string;
    certify: string;
  };
  metadata: UploadMetadata;
  raw?: any;
}

// --- GLOBAL UPLOAD QUEUE TYPES ---

// Status granular untuk tracking background upload
export type QueueUploadStatus =
  | "idle"
  | "encoding"
  | "registering"
  | "uploading"
  | "certifying"
  | "syncing_db"
  | "completed"
  | "failed";

// Bentuk data antrean yang kaya untuk Global Zustand Store
export interface QueueUploadItem {
  id: string; // ID unik untuk tracking antrean (UUID)
  workspaceId: string;
  fileName: string;
  fileSize: number;
  status: QueueUploadStatus;
  progressMessage: string; // Menyimpan string log dari upload.service.ts
  blobId?: string;
  error?: string;
  createdAt: number;
}
