export type VerificationStatus = "verified" | "pending" | "failed";

export interface VerificationResult {
  status: VerificationStatus;
  checkpoint?: string;
  gas_used?: string;
  sender?: string;
  verified_at?: string;
}
