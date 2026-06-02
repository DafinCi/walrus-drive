"use client";

import { Layers, Plus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WorkspaceListEmptyProps {
  onCreateClick: () => void;
}

export function WorkspaceListEmpty({ onCreateClick }: WorkspaceListEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] max-w-md mx-auto text-center p-8 border border-border/60 bg-muted/10 rounded-[6px] shadow-sm">
      <div className="p-4 bg-primary/10 rounded-full mb-4">
        <Layers className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-base font-bold text-foreground">
        Belum Ada Ruang Kerja
      </h3>
      <p className="text-xs text-muted-foreground mt-1.5 mb-6 leading-relaxed">
        Workspace adalah pusat kendali bersama tim Anda untuk mengunggah,
        memverifikasi, dan mengamankan aset data kriptografi di jaringan Walrus.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
        <Button
          onClick={onCreateClick}
          size="sm"
          className="gap-2 font-semibold text-xs cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          Buat Workspace
        </Button>
      </div>
    </div>
  );
}
