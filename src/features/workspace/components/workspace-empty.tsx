import { FolderOpen } from "lucide-react";
import { Dropzone } from "@/features/upload/components/dropzone";

export function WorkspaceEmpty() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[480px] px-6 py-12 border border-border/60 rounded-sm bg-card/20 backdrop-blur-xs text-center max-w-2xl mx-auto my-8 shadow-2xl">
      {/* Decorative Cyber Icon Wrapper */}
      <div className="p-4 bg-muted/50 text-muted-foreground rounded-sm mb-5 border border-border flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
        <FolderOpen className="h-10 w-10 stroke-[1.5] text-primary/80" />
      </div>

      {/* Informative Header & Copywriting */}
      <h2 className="text-xl font-bold text-foreground tracking-tight mb-2">
        Workspace Ini Belum Memiliki File
      </h2>
      <p className="text-sm text-muted-foreground max-w-md mb-8 leading-relaxed">
        Amankan dokumen, aset digital, atau smart contract data Anda ke
        decentralized storage milik{" "}
        <span className="text-primary font-semibold">Walrus Protocol</span>.
        File yang Anda unggah akan langsung terdistribusi secara aman.
      </p>

      {/* Core Dropzone Integration */}
      <div className="w-full bg-background/40 p-1 rounded-sm">
        <Dropzone />
      </div>
    </div>
  );
}
