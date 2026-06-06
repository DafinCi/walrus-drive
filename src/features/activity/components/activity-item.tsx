"use client";

import { useState, useEffect } from "react";
import {
  FileUp,
  ShieldCheck,
  UserPlus,
  ShieldAlert,
  UserMinus,
  PlusSquare,
  FileWarning,
  ShieldX,
  RefreshCw,
  FileCheck,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { Activity } from "../types/activity.types";

interface ActivityItemProps {
  activity: Activity;
  onFileClick?: (fileId: string) => void;
}

export function ActivityItem({ activity, onFileClick }: ActivityItemProps) {
  const { type, actor, metadata, createdAt } = activity;

  // 🌟 FIX 2: Pindahkan kalkulasi waktu ke state dan effect agar React Render tetap pure
  const [timeAgo, setTimeAgo] = useState<string>("just now");

  useEffect(() => {
    if (!createdAt) return;
    const diff = Date.now() - new Date(createdAt).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    let time: string;
    if (mins < 1) time = "now";
    else if (mins < 60) time = `${mins}m ago`;
    else if (hours < 24) time = `${hours}h ago`;
    else time = `${days}d ago`;

    setTimeAgo(time);
  }, [createdAt]);

  // 1. Helper: Truncate long Sui cryptographic wallet addresses
  const formatWallet = (addr: string) =>
    `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  // 3. Presentation Mapping Switch Engine
  const renderDetails = () => {
    switch (type) {
      // ==========================================
      // 📂 UPLOAD & WORKSPACE EVENTS
      // ==========================================
      case "workspace_created":
        return {
          title: "Workspace Initialized",
          desc: "Secure on-chain collaborative zone initialized successfully",
          icon: PlusSquare,
          iconClass: "bg-muted text-muted-foreground border-border",
        };
      case "file_uploaded":
        return {
          title: "File Uploaded",
          desc: `Uploaded ${metadata?.file_name || "a resource"}`,
          icon: FileUp,
          iconClass: "bg-blue-500/10 text-blue-400 border-blue-500/20",
          isFileEvent: true,
        };

      // ==========================================
      // 🛡️ PROOF & INTEGRITY EVENTS
      // ==========================================
      case "file_verified":
        return {
          title: "Proof Verified",
          desc: `Secured ${metadata?.file_name} at Checkpoint #${metadata?.checkpoint}`,
          icon: ShieldCheck,
          iconClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          isFileEvent: true,
        };
      case "file_verification_failed":
        return {
          title: "Verification Failed",
          desc: metadata?.reason
            ? `${metadata?.file_name}: ${metadata.reason}`
            : `Blockchain validation failed for ${metadata?.file_name}`,
          icon: ShieldX,
          iconClass: "bg-red-500/10 text-red-500 border-red-500/20",
          isFileEvent: true,
        };
      case "file_reverified":
        return {
          title: "Proof Re-verified",
          desc: `Re-confirmed ${metadata?.file_name} at Checkpoint #${metadata?.checkpoint}`,
          icon: RefreshCw,
          iconClass: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
          isFileEvent: true,
        };
      case "file_integrity_passed":
        return {
          title: "Integrity Passed",
          desc: `Cryptographic hash matched for ${metadata?.file_name}`,
          icon: FileCheck,
          iconClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          isFileEvent: true,
        };
      case "file_integrity_failed":
        return {
          title: "Integrity Alert",
          desc: `CRITICAL: Hash mismatch detected on ${metadata?.file_name}`,
          icon: AlertTriangle,
          iconClass:
            "bg-destructive/10 text-destructive border-destructive/20 shadow-[0_0_10px_rgba(220,38,38,0.2)]",
          isFileEvent: true,
        };

      // ==========================================
      // 👥 MEMBER & ROLE EVENTS
      // ==========================================
      case "invite_created":
        return {
          title: "Invitation Generated",
          desc: `Created team link authorized for role [${
            metadata?.invited_role || metadata?.role
          }]`,
          icon: UserPlus,
          iconClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        };
      case "member_joined":
        return {
          title: "Member Joined",
          desc: "Successfully registered via workspace secure link",
          icon: UserPlus,
          iconClass: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        };
      case "member_promoted":
        return {
          title: "Access Promoted",
          desc: `Elevated security from ${
            metadata?.old_role || metadata?.fromRole
          } to ${metadata?.new_role || metadata?.toRole}`,
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

      // ==========================================
      // ⚠️ FALLBACK
      // ==========================================
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

  // 🌟 FIX 1: Ambil ID dengan aman sesuai interface Activity lu.
  // Gunakan fallback "as any" untuk antisipasi jika hook API lu belum mapping raw row DB ke format target.id
  const targetEntityId =
    activity.target?.id ||
    (activity as any).entity_id ||
    (activity as any).entityId;

  // Handler untuk mendeteksi klik (Deep Link)
  const handleItemClick = () => {
    if (ui.isFileEvent && onFileClick && targetEntityId) {
      onFileClick(targetEntityId as string);
    }
  };

  return (
    <div
      onClick={handleItemClick}
      className={`flex gap-3 p-3 border border-border/40 bg-card/20 rounded-[6px] transition-all duration-200 group relative
        ${
          ui.isFileEvent && onFileClick
            ? "cursor-pointer hover:bg-accent/40 hover:-translate-y-[1px] hover:border-border/80"
            : "hover:bg-accent/20"
        }
      `}
    >
      {/* Dynamic Icon Container Wrapper */}
      <div
        className={`w-8 h-8 rounded-[6px] border flex items-center justify-center shrink-0 shadow-xs ${ui.iconClass}`}
      >
        <Icon className="w-4 h-4 stroke-[2]" />
      </div>

      {/* Narrative Context Layout Blocks */}
      <div className="flex flex-col min-w-0 flex-1 space-y-0.5 pr-6">
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
          {/* 🌟 Panggil state yang sudah bersih dari impurity */}
          <span>{timeAgo}</span>
        </div>
      </div>

      {/* Indikator Interaksi (Muncul saat hover jika ini adalah event file) */}
      {ui.isFileEvent && onFileClick && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
