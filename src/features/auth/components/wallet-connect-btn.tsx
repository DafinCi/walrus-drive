"use client";

import {
  useCurrentAccount,
  useConnectWallet,
  useDisconnectWallet,
  useWallets,
} from "@mysten/dapp-kit";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Wallet, LogOut, ChevronDown, Copy, Check } from "lucide-react";
import { useState } from "react";

/**
 * Shorten a Sui address for display.
 * e.g. 0x1234...abcd
 */
function shortenAddress(address: string): string {
  if (address.length < 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * WalletConnectButton
 *
 * Two states:
 * 1. Disconnected — shows available wallets as connect targets
 * 2. Connected — shows shortened address with copy + disconnect actions
 *
 * useWallets() returns all wallets registered via the Wallet Standard.
 * We render each wallet as a separate connect option rather than auto-picking
 * wallet[0] — this gives users control and avoids silently connecting to
 * the wrong wallet in multi-wallet environments (Slippage, Suiet, etc).
 *
 * useConnectWallet / useDisconnectWallet are mutation hooks — they expose
 * .mutate() for fire-and-forget and .mutateAsync() for awaited flows.
 * We use .mutate() here since we don't need post-connect navigation.
 */
export function WalletConnectButton() {
  const account = useCurrentAccount();
  const wallets = useWallets();
  const { mutate: connect, isPending: isConnecting } = useConnectWallet();
  const { mutate: disconnect } = useDisconnectWallet();
  const [copied, setCopied] = useState(false);

  // ── Connected state ─────────────────────────────────────────────────────
  if (account) {
    const handleCopy = async () => {
      await navigator.clipboard.writeText(account.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="font-mono gap-2">
            <Wallet className="h-3.5 w-3.5" />
            {shortenAddress(account.address)}
            <ChevronDown className="h-3.5 w-3.5 opacity-50" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem className="font-mono text-xs text-muted-foreground cursor-default select-all">
            {account.address.slice(0, 20)}...
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleCopy}
            className="gap-2 cursor-pointer"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            {copied ? "Copied!" : "Copy address"}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => disconnect()}
            className="gap-2 cursor-pointer text-destructive focus:text-destructive"
          >
            <LogOut className="h-3.5 w-3.5" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // ── Disconnected — no wallets detected ──────────────────────────────────
  if (wallets.length === 0) {
    return (
      <Button variant="outline" size="sm" disabled className="gap-2">
        <Wallet className="h-3.5 w-3.5" />
        No wallet found
      </Button>
    );
  }

  // ── Disconnected — single wallet ─────────────────────────────────────────
  if (wallets.length === 1) {
    return (
      <Button
        size="sm"
        className="gap-2"
        disabled={isConnecting}
        onClick={() => connect({ wallet: wallets[0] })}
      >
        <Wallet className="h-3.5 w-3.5" />
        {isConnecting ? "Connecting…" : "Connect Wallet"}
      </Button>
    );
  }

  // ── Disconnected — multiple wallets ──────────────────────────────────────
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" disabled={isConnecting} className="gap-2">
          <Wallet className="h-3.5 w-3.5" />
          {isConnecting ? "Connecting…" : "Connect Wallet"}
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {wallets.map((wallet) => (
          <DropdownMenuItem
            key={wallet.name}
            className="gap-2 cursor-pointer"
            onClick={() => connect({ wallet })}
          >
            {wallet.icon && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={wallet.icon}
                alt={wallet.name}
                className="h-4 w-4 rounded-sm"
              />
            )}
            {wallet.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
