"use client";

import Link from "next/link";
import { WorkspaceSwitcher } from "@/features/workspace/components/workspace-switcher";
import { SearchInput } from "@/components/shared/search-input";
import { WalletConnectButton } from "@/features/auth/components/wallet-connect-btn";
import { Box } from "lucide-react";

export function WorkspaceNavbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 gap-4">
        {/* LEFT SECTION: Branding & Context Switcher */}
        <div className="flex items-center space-x-3 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background">
              <Box className="h-4 w-4" />
            </div>
            <span className="font-heading font-bold text-base tracking-tight hidden sm:block">
              TrestoSpace
            </span>
          </Link>
          <div className="h-4 w-[1px] bg-border hidden sm:block" />
          <WorkspaceSwitcher />
        </div>

        {/* CENTER SECTION: Global Explorer Search Input */}
        <div className="flex-1 max-w-md mx-auto hidden md:block">
          <SearchInput />
        </div>

        {/* RIGHT SECTION: Authenticated Wallet Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <WalletConnectButton />
        </div>
      </div>
    </header>
  );
}
