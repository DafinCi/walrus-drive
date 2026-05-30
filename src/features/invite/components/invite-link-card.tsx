"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface InviteLinkCardProps {
  token: string;
  expiresAt: string;
  onRevoke?: (token: string) => void;
  isRevoking?: boolean;
}

export function InviteLinkCard({
  token,
  expiresAt,
  onRevoke,
  isRevoking = false,
}: InviteLinkCardProps) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  // State untuk menandakan komponen sudah sukses di-render di browser (Client-side)
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    Promise.resolve().then(() => setIsMounted(true));
  }, []);

  // 🔥 SOLUSI: Derived State.
  // Kita langsung bangun URL di sini tanpa perlu useState atau useEffect tambahan!
  // Pastikan window aman dibaca dengan mengandalkan isMounted.
  const inviteUrl = isMounted
    ? `${window.location.origin}/workspace/join/${token}`
    : "";

  // Effect khusus untuk Kalkulasi Timer Berjalan
  useEffect(() => {
    if (!isMounted) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiration = new Date(expiresAt).getTime();
      const difference = expiration - now;

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft("Kedaluwarsa");
        return;
      }

      setIsExpired(false);
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 24) {
        const days = Math.floor(hours / 24);
        setTimeLeft(`Sisa ${days} hari`);
      } else if (hours > 0) {
        setTimeLeft(`Sisa ${hours}j ${minutes}m`);
      } else {
        setTimeLeft(`Sisa ${minutes} menit`);
      }
    };

    // Jalankan kalkulasi pertama kali
    calculateTimeLeft();

    // Set interval untuk update setiap 1 menit (60000ms)
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, [expiresAt, isMounted]);

  const handleCopy = async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      toast.success("Tersalin!", {
        description: "Tautan disalin ke clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin", err);
    }
  };

  // Mencegah hydration error: Jangan render tampilan kompleks sebelum client siap
  if (!isMounted) return null;

  return (
    <div
      className={`flex flex-col gap-2 p-3 rounded-sm border ${isExpired ? "bg-muted/30 border-border/50 opacity-60" : "bg-muted/50 border-border"} transition-all`}
    >
      <div className="flex items-center justify-between gap-2">
        {/* Tautan Box */}
        <div className="flex-1 bg-background border border-border/60 rounded-sm h-8 px-2.5 flex items-center min-w-0 overflow-hidden">
          <span
            className={`text-xs font-mono truncate select-all ${isExpired ? "text-muted-foreground" : "text-foreground"}`}
          >
            {inviteUrl || "Memuat tautan..."}
          </span>
        </div>

        {/* Action Buttons */}
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

      {/* Expiration Info */}
      <div className="flex items-center gap-1.5 px-0.5">
        <Clock
          className={`h-3 w-3 ${isExpired ? "text-muted-foreground" : "text-amber-500"}`}
        />
        <span
          className={`text-[11px] font-medium ${isExpired ? "text-muted-foreground" : "text-amber-500"}`}
        >
          {timeLeft}
          {!isExpired && (
            <span className="text-muted-foreground font-normal ml-1 flex-1 truncate">
              • Kedaluwarsa pada{" "}
              {new Date(expiresAt).toLocaleString("id-ID", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
