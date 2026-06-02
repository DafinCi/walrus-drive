"use client";

import {
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
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuthState } from "../hooks/use-auth-state";

// ── 1. KOMPONEN INNER (Logika Web3, hanya di-render di client) ──────────────
function WalletConnectInner() {
  const { isConnected, isConnecting, address, shortAddress } = useAuthState();
  const wallets = useWallets(); // Sekarang aman dipanggil, tidak akan bentrok dengan SSR
  const { mutate: connect } = useConnectWallet();
  const { mutate: disconnect } = useDisconnectWallet();
  const [copied, setCopied] = useState(false);

  if (isConnected && address) {
    const handleCopy = async () => {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="lg" className="font-mono gap-2">
            <Wallet className="h-3.5 w-3.5" />
            {shortAddress}
            <ChevronDown className="h-3.5 w-3.5 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem className="font-mono text-xs text-muted-foreground cursor-default select-all">
            {address.slice(0, 20)}...
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

  if (wallets.length === 0) {
    return (
      <Button variant="outline" size="sm" disabled className="gap-2">
        <Wallet className="h-3.5 w-3.5" />
        No wallet found
      </Button>
    );
  }

  if (wallets.length === 1) {
    return (
      <Button
        size="lg"
        className="gap-2"
        disabled={isConnecting}
        onClick={() => connect({ wallet: wallets[0] })}
      >
        <Wallet className="h-3.5 w-3.5" />
        {isConnecting ? "Connecting…" : "Connect Wallet"}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="lg" disabled={isConnecting} className="gap-2">
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
              <Image
                src={wallet.icon}
                alt={wallet.name}
                width={16}
                height={16}
                className="rounded-[6px]"
              />
            )}
            {wallet.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ── 2. KOMPONEN WRAPPER (Penjaga Hydration / SSR) ───────────────────────────
export function WalletConnectButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Selama server render atau hydration belum selesai, berikan skeleton yang persis sama
  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="lg"
        disabled
        className="gap-2 min-w-[120px]"
      >
        <Loader2 className="h-3.5 w-3.5 animate-spin opacity-50" />
        <span>Memuat...</span>
      </Button>
    );
  }

  // Jika sudah mounted sempurna di browser, lepas komponen Web3-nya!
  return <WalletConnectInner />;
}
