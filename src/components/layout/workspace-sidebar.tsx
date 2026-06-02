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
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkspaceSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function WorkspaceSidebar({
  isCollapsed,
  onToggle,
}: WorkspaceSidebarProps) {
  const pathname = usePathname();
  const params = useParams();

  const slug = params?.slug as string | undefined;
  const isHubMode = !slug;

  // Level 1 Navigation (Workspace Hub)
  const hubLinks = [
    { name: "Workspace Hub", href: "/workspace", icon: Home },
    { name: "Recent Activity", href: "/workspace/recent", icon: Clock },
  ];

  // Level 2 Navigation (Workspace Specific)
  const workspaceLinks = slug
    ? [
        {
          name: "Data Dashboard",
          href: `/workspace/${slug}`,
          icon: LayoutDashboard,
        },
        {
          name: "Proof Verification",
          href: `/workspace/${slug}/verify`,
          icon: ShieldCheck,
        },
        {
          name: "Space Settings",
          href: `/workspace/${slug}/settings`,
          icon: Settings,
        },
      ]
    : [];

  const activeLinks = isHubMode ? hubLinks : workspaceLinks;

  return (
    <aside
      className={cn(
        "h-full border-r border-border bg-background flex flex-col shrink-0 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[70px]" : "w-64",
      )}
    >
      {/* ─── SIDEBAR HEADER WITH TOGGLE BUTTON ─── */}
      <div
        className={cn(
          "h-14 border-b border-border/60 flex items-center px-4 shrink-0",
          isCollapsed ? "justify-center" : "justify-between",
        )}
      >
        {!isCollapsed && (
          <span className="text-xs font-black tracking-wider text-foreground uppercase font-heading">
            WalSpace
          </span>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-[6px] text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-4 h-4 text-primary" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* ─── MIDDLE NAVIGATION AREA ─── */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
        {/* Contextual Section Label */}
        <div className={cn("px-2", isCollapsed ? "text-center" : "")}>
          {isCollapsed ? (
            <div className="h-[1px] w-full bg-border/60 my-2" />
          ) : (
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              {isHubMode ? "Global Nav" : "Space Nav"}
            </p>
          )}
        </div>

        {/* Navigation Menus */}
        <nav className="flex flex-col space-y-1">
          {activeLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center rounded-[6px] transition-all text-sm font-medium group",
                  isCollapsed ? "justify-center p-2.5" : "px-3 py-2.5 gap-3",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
                title={isCollapsed ? link.name : undefined}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0 transition-transform group-hover:scale-105",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                />
                {!isCollapsed && (
                  <span className="truncate animate-in fade-in duration-200">
                    {link.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ─── BOTTOM APP BADGE (WALRUS NETWORK STATUS) ─── */}
      <div className="p-3 border-t border-border/50">
        <div
          className={cn(
            "flex items-center rounded-[6px] bg-muted/30 border border-border/50 transition-all",
            isCollapsed ? "justify-center p-2.5" : "p-2 gap-2.5",
          )}
          title="Walrus Protocol Network Status"
        >
          <div className="relative shrink-0">
            <FolderLock className="w-4 h-4 text-emerald-500" />
            {/* Pulsing online status indicator anchor */}
            <span className="absolute -top-0.5 -right-0.5 flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
          </div>

          {!isCollapsed && (
            <div className="flex flex-col truncate animate-in fade-in duration-200">
              <span className="text-[10px] font-bold text-foreground leading-tight">
                Walrus Network
              </span>
              <span className="text-[9px] text-muted-foreground leading-none mt-0.5">
                Connected & Secured
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
