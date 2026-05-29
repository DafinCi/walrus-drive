"use client";

import { useState } from "react";
import { FileCode, Server, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function ShardingPipeline() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-6 flex flex-col justify-between overflow-hidden relative min-h-[180px] cursor-pointer group"
    >
      <div className="flex items-center justify-between w-full z-10">
        {/* Source File */}
        <div className="flex flex-col items-center gap-1.5 w-16">
          <div
            className={cn(
              "p-2.5 bg-zinc-900 border rounded-lg transition-all duration-300",
              isHovered
                ? "border-sky-500/40 bg-sky-950/10 text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.1)]"
                : "border-zinc-800 text-zinc-400",
            )}
          >
            <FileCode className="h-5 w-5" />
          </div>
          <span className="text-[9px] font-mono text-zinc-500">Blob File</span>
        </div>

        {/* Pipeline Center (Serpihan Cahaya Terbang) */}
        <div className="flex-1 flex items-center justify-center relative px-2">
          <div className="w-full h-[1px] bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 relative">
            {/* Animasi Partikel saat Hover */}
            {isHovered && (
              <>
                <span
                  className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-sky-400 rounded-full blur-[1px] animate-ping left-[10%]"
                  style={{ animationDelay: "0s", animationDuration: "0.8s" }}
                />
                <span className="absolute top-1/2 -translate-y-1/2 w-1 h-1 bg-indigo-400 rounded-full left-[30%] animate-pulse" />
                <span className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full blur-[1px] left-[60%]" />
              </>
            )}
            <ChevronRight
              className={cn(
                "h-3 w-3 absolute top-1/2 -translate-y-1/2 right-[20%] text-zinc-600 transition-colors",
                isHovered && "text-sky-400 animate-pulse",
              )}
            />
          </div>
        </div>

        {/* Walrus Storage Nodes */}
        <div className="grid grid-cols-2 gap-1.5">
          {[1, 2, 3, 4].map((node) => (
            <div
              key={node}
              className={cn(
                "p-1.5 bg-zinc-900/50 border rounded-md flex items-center justify-center transition-all duration-500",
                isHovered
                  ? "border-indigo-500/30 text-indigo-400 bg-indigo-950/10 translate-x-0.5 scale-105"
                  : "border-zinc-800 text-zinc-600",
              )}
              style={{ transitionDelay: `${node * 50}ms` }}
            >
              <Server className="h-3 w-3" />
            </div>
          ))}
        </div>
      </div>

      {/* Indikator Panduan Text */}
      <div className="mt-4 pt-3 border-t border-zinc-900 text-center">
        <p className="text-[10px] font-mono text-zinc-500 group-hover:text-zinc-400 transition-colors">
          {isHovered
            ? "File dipecah menjadi shards & disebar secara redundan"
            : "Sentuh panel untuk melihat simulasi sharding"}
        </p>
      </div>
    </div>
  );
}
