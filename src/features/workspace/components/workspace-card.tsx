"use client";

import Link from "next/link";
import {
  FolderSync,
  Users,
  ShieldCheck,
  ArrowUpRight,
  Calendar,
} from "lucide-react";
import { WorkspaceHubItem } from "../hooks/use-workspaces";

interface WorkspaceCardProps {
  workspace: WorkspaceHubItem;
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const getRoleBadgeStyles = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "admin":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const formattedDate = new Date(workspace.createdAt).toLocaleDateString(
    "id-ID",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );

  return (
    <Link
      href={`/workspace/${workspace.slug}`} // 🌟 PERBAIKAN: Gunakan slug untuk routing
      className="group relative flex flex-col justify-between p-5 bg-card border border-border/70 rounded-[6px] shadow-xs transition-all duration-300 hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 cursor-pointer overflow-hidden"
    >
      {/* Efek Garis Dekoratif Glossy saat Hover */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl transition-opacity opacity-0 group-hover:opacity-100" />

      <div className="space-y-4">
        {/* BARIS ATAS: Nama Workspace & Role Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-foreground tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
              {workspace.name}
            </h3>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Created {formattedDate}</span>
            </div>
          </div>

          <span
            className={`text-[9px] font-bold uppercase tracking-wider font-mono px-2 py-0.5 rounded-full border ${getRoleBadgeStyles(
              workspace.userRole,
            )}`}
          >
            {workspace.userRole}
          </span>
        </div>

        {/* BARIS TENGAH: Grid Statistik (Files & Members) */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40">
          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-[6px] border border-border/30">
            <FolderSync className="h-4 w-4 text-primary/80" />
            <div className="flex flex-col">
              <span className="font-mono text-xs font-bold text-foreground">
                {workspace.totalFiles}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium">
                File
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-[6px] border border-border/30">
            <Users className="h-4 w-4 text-primary/80" />
            <div className="flex flex-col">
              <span className="font-mono text-xs font-bold text-foreground">
                {workspace.totalMembers}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium">
                Member
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BARIS BAWAH: Akses Deklaratif */}
      <div className="flex items-center justify-between mt-5 pt-2 text-[11px] font-medium text-muted-foreground group-hover:text-primary transition-colors">
        <div className="flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          <span className="font-mono text-[10px] tracking-tight">
            ID: {workspace.id.substring(0, 8)}...
          </span>
        </div>

        <div className="flex items-center gap-0.5 bg-muted group-hover:bg-primary group-hover:text-primary-foreground p-1 rounded-[6px] transition-all duration-300">
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:rotate-45" />
        </div>
      </div>
    </Link>
  );
}
