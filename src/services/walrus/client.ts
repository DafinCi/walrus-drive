// src/services/walrus/client.ts
import { SuiGrpcClient } from "@mysten/sui/grpc";
import { walrus } from "@mysten/walrus";

// 1. Inisialisasi SuiGrpcClient menggunakan Node Resmi Testnet Mysten (Sesuai Docs)
// Ini menjamin koneksi gRPC-Web dari browser aman dari error 'Failed to fetch'
const baseGrpcClient = new SuiGrpcClient({
  network: "testnet",
  baseUrl: "https://fullnode.testnet.sui.io:443",
});

// 2. Extend client dengan modul Walrus + Konfigurasi Upload Relay & WASM CDN
export const walrusClient = baseGrpcClient.$extend(
  walrus({
    // Konfigurasi Relay Node untuk menghemat request di browser
    uploadRelay: {
      host: "https://upload-relay.testnet.walrus.space",
      sendTip: {
        max: 10000, // Batas maksimal tip dalam satuan MIST
      },
    },
    // 🔥 PENTING UNTUK BROWSER: Muat modul WASM dari CDN Resmi agar proses encode lancar
    wasmUrl:
      "https://unpkg.com/@mysten/walrus-wasm@latest/web/walrus_wasm_bg.wasm",
  }),
);
