"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Muat komponen konten secara asinkronus murni di sisi client browser
const JoinWorkspaceContent = dynamic(() => import("./join-content"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
      <Loader2 className="h-6 w-6 text-primary animate-spin" />
      <p className="text-xs text-muted-foreground font-medium">
        Memuat modul otentikasi dApp...
      </p>
    </div>
  ),
});

export default function JoinWorkspacePage() {
  return <JoinWorkspaceContent />;
}
