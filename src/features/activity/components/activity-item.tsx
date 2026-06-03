"use client";

import {
  FileUp,
  ShieldCheck,
  UserPlus,
  ShieldAlert,
  UserMinus,
  PlusSquare,
  FileWarning,
} from "lucide-react";
import { Activity } from "../types/activity.types";

interface ActivityItemProps {
  activity: Activity;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const { type, actor, metadata, createdAt } = activity;

  // 1. Helper: Truncate long Sui cryptographic wallet addresses
  const formatWallet = (addr: string) =>
    `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  // 2. Helper: Ultra-lightweight shorthand relative time parser
  const getRelativeTime = (isoString: string) => {
    const diff = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (mins < 1) return "now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // 3. Presentation Mapping Switch Engine
  const renderDetails = () => {
    switch (type) {
      case "file_uploaded":
        return {
          title: "File Uploaded",
          desc: `Uploaded ${metadata?.file_name || "a resource"}`,
          icon: FileUp,
          iconClass: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        };
      case "file_verified":
        return {
          title: "Proof Verified",
          desc: `Secured ${metadata?.file_name} at Checkpoint #${metadata?.checkpoint}`,
          icon: ShieldCheck,
          iconClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        };
      case "invite_created":
        return {
          title: "Invitation Generated",
          desc: `Created team link authorized for role [${metadata?.role}]`,
          icon: UserPlus,
          iconClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        };
      case "member_joined":
        return {
          title: "Member Joined",
          desc: "Successfully registered via workspace secure link",
          icon: UserPlus,
          iconClass: "bg-purple-500/10 text-primary border-primary/20",
        };
      case "member_promoted":
        return {
          title: "Access Promoted",
          desc: `Elevated security from ${metadata?.fromRole} to ${metadata?.toRole}`,
          icon: ShieldAlert,
          iconClass: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
        };
      case "member_removed":
        return {
          title: "Member Revoked",
          desc: "Access credentials detached from team ledger",
          icon: UserMinus,
          iconClass: "bg-destructive/10 text-destructive border-destructive/20",
        };
      case "workspace_created":
        return {
          title: "Workspace Initialized",
          desc: "Secure on-chain collaborative zone initialized successfully",
          icon: PlusSquare,
          iconClass: "bg-muted text-muted-foreground border-border",
        };
      default:
        return {
          title: "System Update",
          desc: "Workspace operational parameter logged",
          icon: FileWarning,
          iconClass: "bg-muted text-muted-foreground border-border",
        };
    }
  };

  const ui = renderDetails();
  const Icon = ui.icon;

  return (
    <div className="flex gap-3 p-3 border border-border/40 bg-card/20 rounded-[6px] hover:bg-accent/40 hover:-translate-y-[0.5px] transition-all duration-200 group">
      {/* Dynamic Icon Container Wrapper */}
      <div
        className={`w-8 h-8 rounded-[6px] border flex items-center justify-center shrink-0 shadow-xs ${ui.iconClass}`}
      >
        <Icon className="w-4 h-4 stroke-[2]" />
      </div>

      {/* Narrative Context Layout Blocks */}
      <div className="flex flex-col min-w-0 flex-1 space-y-0.5">
        <h4 className="text-xs font-bold tracking-tight text-foreground/90 font-heading">
          {ui.title}
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed break-words">
          {ui.desc}
        </p>

        {/* Author Operational Meta Anchor Row */}
        <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground/60 pt-1">
          <span className="font-semibold text-foreground/50 font-mono">
            {actor.name || formatWallet(actor.wallet)}
          </span>
          <span>•</span>
          <span>{getRelativeTime(createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
