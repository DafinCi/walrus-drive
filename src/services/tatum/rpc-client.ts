// src/services/tatum/rpc-client.ts
import { SuiJsonRpcClient } from "@mysten/sui/jsonRpc";
import { SuiGrpcClient } from "@mysten/sui/grpc";
import { env } from "@/lib/env";

// 1. JSON-RPC Client - Gunakan ini untuk Browser/Frontend karena aman dari CORS
export const tatumSuiRpcClient = new SuiJsonRpcClient({
  url: env.NEXT_PUBLIC_TATUM_RPC_URL, // https://sui-testnet.gateway.tatum.io
  headers: {
    "x-api-key": env.NEXT_PUBLIC_TATUM_API_KEY,
  },
});

// Base Client murni untuk interaksi on-chain Sui
export const tatumSuiClient = new SuiGrpcClient({
  network: "testnet",
  baseUrl: `${env.NEXT_PUBLIC_TATUM_GRPC_URL}:443`,
  headers: {
    "x-api-key": env.NEXT_PUBLIC_TATUM_API_KEY,
  },
});
