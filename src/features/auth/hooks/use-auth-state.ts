"use client";

import { useCurrentAccount } from "@mysten/dapp-kit";

export interface AuthState {
  isConnected: boolean;
  address: string | null;
  shortAddress: string | null;
  rawAccount: ReturnType<typeof useCurrentAccount>;
}

/**
 * Global Web3 Authentication Abstraction Hook
 * Menjaga komponen UI bersih dari dependensi primitif Wallet SDK
 */
export function useAuthState(): AuthState {
  const account = useCurrentAccount();

  // Helper untuk memotong alamat wallet (e.g., 0x1234...abcd)
  const getShortAddress = (addr: string): string => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return {
    isConnected: !!account,
    address: account?.address || null,
    shortAddress: account?.address ? getShortAddress(account.address) : null,
    rawAccount: account,
  };
}
