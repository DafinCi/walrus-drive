"use client";

import Link from "next/link";
import { ShieldX, HelpCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InviteErrorStateProps {
  type: "invalid" | "expired";
}

export function InviteErrorState({ type }: InviteErrorStateProps) {
  const isExpired = type === "expired";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] border border-border bg-card p-6 rounded-[6px] shadow-xl text-center space-y-5">
        <div className="mx-auto h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
          {isExpired ? (
            <ShieldX className="h-6 w-6" />
          ) : (
            <HelpCircle className="h-6 w-6" />
          )}
        </div>

        <div className="space-y-1.5">
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            {isExpired ? "Tautan Kedaluwarsa" : "Undangan Tidak Valid"}
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {isExpired
              ? "Masa aktif token cryptographic ini telah habis. Minta admin workspace untuk menerbitkan tautan baru."
              : "Token tidak dikenali oleh sistem atau sudah dicabut aksesnya oleh pengelola."}
          </p>
        </div>

        <Button
          asChild
          variant="outline"
          size="sm"
          className="w-full text-xs gap-2 cursor-pointer"
        >
          <Link href="/">
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke Beranda
          </Link>
        </Button>
      </div>
    </div>
  );
}
