"use client";

import { useState, useEffect } from "react";
import {
  Copy,
  Check,
  Clock,
  Trash2,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react"; // 🌟 Tambah icon shield
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface InviteLinkCardProps {
  token: string;
  expiresAt: string;
  role?: string; // 🌟 TAMBAHAN: Terima prop role dari parent (.map di modal)
  onRevoke?: (token: string) => void;
  isRevoking?: boolean;
}

export function InviteLinkCard({
  token,
  expiresAt,
  role = "member", // 🌟 Default ke member jika tidak ada
  onRevoke,
  isRevoking = false,
}: InviteLinkCardProps) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    Promise.resolve().then(() => setIsMounted(true));
  }, []);

  const inviteUrl = isMounted
    ? `${window.location.origin}/workspace/join/${token}`
    : "";

  useEffect(() => {
    if (!isMounted) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiration = new Date(expiresAt).getTime();
      const difference = expiration - now;

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft("Expired");
        return;
      }

      setIsExpired(false);
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 24) {
        const days = Math.floor(hours / 24);
        setTimeLeft(`${days} days left`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m left`);
      } else {
        setTimeLeft(`${minutes} min left`);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, [expiresAt, isMounted]);

  const handleCopy = async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      toast.success("Copied!", {
        description: "Link copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin", err);
    }
  };

  if (!isMounted) return null;

  return (
    <div
      className={`flex flex-col gap-2 p-3 rounded-[6px] border ${isExpired ? "bg-muted/30 border-border/50 opacity-60" : "bg-muted/50 border-border"} transition-all`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 bg-background border border-border/60 rounded-[6px] h-8 px-2.5 flex items-center min-w-0 overflow-hidden">
          <span
            className={`text-xs font-mono truncate select-all ${isExpired ? "text-muted-foreground" : "text-foreground"}`}
          >
            {inviteUrl || "Memuat tautan..."}
          </span>
        </div>

        <div className="flex shrink-0 gap-1.5">
          <Button
            size="icon"
            variant="secondary"
            onClick={handleCopy}
            disabled={isExpired}
            className="h-8 w-8 cursor-pointer"
            title="Salin Tautan"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-primary" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>

          {onRevoke && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onRevoke(token)}
              disabled={isRevoking || isExpired}
              className="h-8 w-8 text-destructive hover:bg-destructive/10 cursor-pointer"
              title="Cabut Tautan"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Expiration & Role Info */}
      <div className="flex items-center justify-between gap-1.5 px-0.5">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <Clock
            className={`h-3 w-3 ${isExpired ? "text-muted-foreground" : "text-amber-500"}`}
          />
          <span
            className={`text-[11px] font-medium truncate ${isExpired ? "text-muted-foreground" : "text-amber-500"}`}
          >
            {timeLeft}
            {!isExpired && (
              <span className="text-muted-foreground font-normal ml-1">
                • Kedaluwarsa{" "}
                {new Date(expiresAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </span>
        </div>

        {/* 🌟 TAMBAHAN UI: Badge Otoritas Role Link */}
        {!isExpired && (
          <div
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase select-none shrink-0 ${
              role === "admin"
                ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                : "bg-primary/10 text-primary border border-primary/20"
            }`}
          >
            {role === "admin" ? (
              <>
                <ShieldAlert className="h-2.5 w-2.5" /> Admin
              </>
            ) : (
              <>
                <ShieldCheck className="h-2.5 w-2.5" /> Member
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
