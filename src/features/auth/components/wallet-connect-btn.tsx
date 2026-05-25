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
import {
  Wallet,
  LogOut,
  ChevronDown,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react"; // 🔥 Tambahkan useEffect di sini

function shortenAddress(address: string): string {
  if (address.length < 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function WalletConnectButton() {
  const account = useCurrentAccount();
  const wallets = useWallets();
  const { mutate: connect, isPending: isConnecting } = useConnectWallet();
  const { mutate: disconnect } = useDisconnectWallet();
  const [copied, setCopied] = useState(false);

  // 🔥 1. Tambahkan state guard untuk mendeteksi status mount di client
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 🔥 2. Jika masih di fase SSR atau hidrasi awal, tampilkan skeleton/loading state yang konsisten
  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className="gap-2 min-w-[120px]"
      >
        <Loader2 className="h-3.5 w-3.5 animate-spin opacity-50" />
        <span>Memuat...</span>
      </Button>
    );
  }

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
