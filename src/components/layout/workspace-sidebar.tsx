"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Home,
  Clock,
  FolderLock,
} from "lucide-react";
import { cn } from "@/lib/utils"; // Pastikan lu punya helper ini (biasanya bawaan shadcn)

export function WorkspaceSidebar() {
  const pathname = usePathname();
  const params = useParams();

  // Baca parameter dari URL. Jika ada workspaceId, berarti kita di dalam Level 2 (Detail).
  // Jika tidak ada, berarti kita di Level 1 (Hub).
  const workspaceId = params?.workspaceId as string | undefined;
  const isHubMode = !workspaceId;

  // Konfigurasi Navigasi Level 1 (Workspace Hub)
  const hubLinks = [
    { name: "Beranda Ruang", href: "/workspace", icon: Home },
    { name: "Aktivitas Terakhir", href: "/workspace/recent", icon: Clock },
  ];

  // Konfigurasi Navigasi Level 2 (Internal Workspace)
  const workspaceLinks = workspaceId
    ? [
        {
          name: "Dasbor Data",
          href: `/workspace/${workspaceId}`,
          icon: LayoutDashboard,
        },
        {
          name: "Verifikasi Bukti",
          href: `/workspace/${workspaceId}/verify`,
          icon: ShieldCheck,
        },
        {
          name: "Pengaturan Ruang",
          href: `/workspace/${workspaceId}/settings`,
          icon: Settings,
        },
      ]
    : [];

  const activeLinks = isHubMode ? hubLinks : workspaceLinks;

  return (
    <aside className="w-full h-full md:w-64 border-r border-border bg-card flex flex-col shrink-0 transition-all duration-300">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Label Contextual */}
        <div className="px-2 mb-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
            {isHubMode ? "Navigasi Global" : "Navigasi Ruang"}
          </p>
        </div>

        {/* Menu Navigasi */}
        <nav className="flex flex-col space-y-1">
          {activeLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bagian Bawah Opsional (Misal untuk status Walrus Storage dsb) */}
      <div className="p-4 border-t border-border/50">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-border/50">
          <FolderLock className="w-4 h-4 text-emerald-500" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold">Walrus Network</span>
            <span className="text-[9px] text-muted-foreground">
              Terkoneksi & Aman
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
