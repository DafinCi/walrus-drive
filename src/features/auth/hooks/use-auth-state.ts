"use client";

import { useCurrentAccount, useCurrentWallet } from "@mysten/dapp-kit";

export interface AuthState {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  shortAddress: string | null;
  rawAccount: ReturnType<typeof useCurrentAccount>;
}

export function useAuthState(): AuthState {
  const account = useCurrentAccount();
  const { isConnecting } = useCurrentWallet();

  const getShortAddress = (addr: string): string => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return {
    isConnected: !!account,
    isConnecting,
    address: account?.address || null,
    shortAddress: account?.address ? getShortAddress(account.address) : null,
    rawAccount: account,
  };
}
