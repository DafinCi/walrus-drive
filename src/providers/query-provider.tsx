"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

/**
 * makeQueryClient
 *
 * Factory function — called once per client, once per SSR request.
 * Keeping defaults conservative:
 * - staleTime 60s: avoids hammer-refetching on tab focus for blockchain data
 *   (most Sui/Walrus reads don't need sub-second freshness)
 * - retry 1: one retry is enough; avoid repeated failed RPC calls
 * - refetchOnWindowFocus false: blockchain state isn't a live feed;
 *   manual invalidation is more predictable in a Web3 context
 */
function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0, // Never auto-retry mutations (wallet tx signing is not idempotent)
      },
    },
  });
}

// Browser-side singleton — prevents QueryClient from being recreated on
// every render while still working correctly with SSR (server always gets
// a fresh instance per request to avoid cross-request state leakage).
let browserQueryClient: QueryClient | undefined;

function getQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

interface AppQueryProviderProps {
  children: ReactNode;
}

/**
 * AppQueryProvider
 *
 * useState initializer pattern (not useMemo) — React's useState initializer
 * is only called once per component mount, which is the correct behaviour
 * for a singleton client in App Router where the component may be rendered
 * both on server and client.
 */
export function AppQueryProvider({ children }: AppQueryProviderProps) {
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
