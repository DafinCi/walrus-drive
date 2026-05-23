"use client";

import {
  SuiClientProvider,
  WalletProvider,
  createNetworkConfig,
} from "@mysten/dapp-kit";
import type { ReactNode } from "react";

// createNetworkConfig returns a typed network map — keeps network switching
// easy later (mainnet, devnet) without restructuring the provider tree.
const { networkConfig } = createNetworkConfig({
  testnet: { url: "https://fullnode.testnet.sui.io:443" },
});

interface AppWalletProviderProps {
  children: ReactNode;
}

/**
 * AppWalletProvider
 *
 * Two-layer Sui provider stack:
 * - SuiClientProvider: manages RPC client per network (swappable via context)
 * - WalletProvider: manages wallet state, signing, accounts
 *
 * autoConnect: true — resumes a previously connected wallet on page reload,
 * which is standard UX for Web3 apps and avoids friction on every visit.
 *
 * Keeping this isolated as its own provider (rather than inlining into
 * app-provider.tsx) makes it independently replaceable and testable.
 */
export function AppWalletProvider({ children }: AppWalletProviderProps) {
  return (
    <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
      <WalletProvider autoConnect>{children}</WalletProvider>
    </SuiClientProvider>
  );
}
