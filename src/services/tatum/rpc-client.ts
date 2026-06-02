// 🌟 PERTAHANAN LAPIS 1: File ini wajib hanya berjalan di Server!
import "server-only";

import { SuiJsonRpcClient, JsonRpcHTTPTransport } from "@mysten/sui/jsonRpc";

const TATUM_RPC_URL =
  process.env.NEXT_TATUM_RPC_URL || "https://sui-testnet.gateway.tatum.io";
const TATUM_API_KEY = process.env.NEXT_TATUM_API_KEY;

if (!TATUM_API_KEY) {
  console.warn("⚠️ TATUM_API_KEY belum dipasang di environment server!");
}

// 🌟 PERTAHANAN LAPIS 2: Menggunakan Custom Transport sesuai Docs Mysten terbaru
export const tatumServerClient = new SuiJsonRpcClient({
  network: "testnet",
  transport: new JsonRpcHTTPTransport({
    url: TATUM_RPC_URL,
    rpc: {
      headers: {
        "x-api-key": TATUM_API_KEY || "",
      },
    },
  }),
});
