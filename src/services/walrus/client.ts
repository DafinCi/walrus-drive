// src/services/walrus/client.ts
import { SuiGrpcClient } from "@mysten/sui/grpc"; // (Atau sesuaikan import path jika ada perubahan di package Sui)
import { walrus } from "@mysten/walrus";

// Menggunakan pola Extension (Sui Client + Walrus Plugin)
export const walrusClient = new SuiGrpcClient({
  network: "testnet",
  baseUrl: "https://fullnode.testnet.sui.io:443",
}).$extend(
  walrus({
    uploadRelay: {
      host: "https://upload-relay.testnet.walrus.space",
      sendTip: {
        max: 10_000, // Biarkan SDK otomatis menghitung tip (max 10.000 MIST)
      },
    },
  }),
);
