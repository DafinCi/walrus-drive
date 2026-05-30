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
import { cn } from "@/lib/utils";

export function WorkspaceSidebar() {
  const pathname = usePathname();
  const params = useParams();

  // 🌟 PERBAIKAN: Baca parameter 'slug' dari URL, bukan 'workspaceId'.
  // Jika ada slug, berarti kita di dalam Level 2 (Detail).
  // Jika tidak ada, berarti kita di Level 1 (Hub).
  const slug = params?.slug as string | undefined;
  const isHubMode = !slug;

  // Konfigurasi Navigasi Level 1 (Workspace Hub)
  const hubLinks = [
    { name: "Beranda Ruang", href: "/workspace", icon: Home },
    { name: "Aktivitas Terakhir", href: "/workspace/recent", icon: Clock },
  ];

  // 🌟 PERBAIKAN: Konfigurasi Navigasi Level 2 menggunakan 'slug'
  const workspaceLinks = slug
    ? [
        {
          name: "Dasbor Data",
          href: `/workspace/${slug}`,
          icon: LayoutDashboard,
        },
        {
          name: "Verifikasi Bukti",
          href: `/workspace/${slug}/verify`,
          icon: ShieldCheck,
        },
        {
          name: "Pengaturan Ruang",
          href: `/workspace/${slug}/settings`,
          icon: Settings,
        },
      ]
    : [];

  const activeLinks = isHubMode ? hubLinks : workspaceLinks;

  return (
    <aside className="w-full h-full md:w-64 border-r border-border bg-background flex flex-col shrink-0 transition-all duration-300">
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
                  "flex items-center space-x-3 px-3 py-2.5 rounded-sm transition-all text-sm font-medium",
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
        <div className="flex items-center gap-2 p-2 rounded-sm bg-muted/50 border border-border/50">
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
