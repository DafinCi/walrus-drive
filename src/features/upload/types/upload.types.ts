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
  raw?: unknown;
}
