// src/lib/env.ts
import { z } from "zod";

const envSchema = z.object({
  // URL JSON-RPC Tatum untuk UI & dApp Kit (Default ke Testnet)
  NEXT_PUBLIC_TATUM_RPC_URL: z
    .string()
    .url("Format URL Tatum RPC tidak valid")
    .default("https://sui-testnet.gateway.tatum.io"),

  // URL gRPC Tatum untuk Walrus Engine
  NEXT_PUBLIC_TATUM_GRPC_URL: z
    .string()
    .url("Format URL Tatum gRPC tidak valid")
    .default("https://sui-testnet-grpc.gateway.tatum.io"),

  // API Key Tatum (Wajib ada)
  NEXT_PUBLIC_TATUM_API_KEY: z
    .string()
    .min(1, "Tatum API Key wajib diisi di .env!"),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_TATUM_RPC_URL: process.env.NEXT_PUBLIC_TATUM_RPC_URL,
  NEXT_PUBLIC_TATUM_GRPC_URL: process.env.NEXT_PUBLIC_TATUM_GRPC_URL,
  NEXT_PUBLIC_TATUM_API_KEY: process.env.NEXT_PUBLIC_TATUM_API_KEY,
});
