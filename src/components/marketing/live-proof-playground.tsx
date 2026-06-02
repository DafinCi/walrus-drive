"use client";

import { useState, useRef } from "react";
import { UploadCloud, ShieldCheck, RefreshCw, Binary } from "lucide-react";

export function LiveProofPlayground() {
  const [status, setStatus] = useState<"idle" | "scanning" | "ready">("idle");
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const [fileHash, setFileHash] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateScan = (name: string) => {
    setFileName(name);
    setStatus("scanning");
    setProgress(0);

    // Simulasi progress scanning hash kriptografi
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Generate dummy SHA-256 hash ala Web3
          const dummyHash =
            "0x" +
            Array.from({ length: 40 }, () =>
              Math.floor(Math.random() * 16).toString(16),
            ).join("");
          setFileHash(dummyHash);
          setStatus("ready");
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateScan(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      simulateScan(e.target.files[0].name);
    }
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xs border border-zinc-800 rounded-[6px] p-5 shadow-2xl relative overflow-hidden group hover:border-zinc-700 transition-colors"
    >
      {/* Efek pendaran latar belakang halus */}
      <div className="absolute -top-12 -left-12 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
          <span className="text-[11px] font-mono text-zinc-400 tracking-wider uppercase">
            Live Proof Playground
          </span>
        </div>
        {status !== "idle" && (
          <button
            onClick={() => setStatus("idle")}
            className="text-[10px] flex items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <RefreshCw className="h-3 w-3" /> Reset
          </button>
        )}
      </div>

      {status === "idle" && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border border-dashed border-zinc-800 hover:border-sky-500/50 rounded-[6px] p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-zinc-950/40 group/drop"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <UploadCloud className="h-8 w-8 text-zinc-600 group-hover/drop:text-sky-400 group-hover/drop:scale-105 transition-all mb-3" />
          <p className="text-xs font-medium text-zinc-300">
            Seret berkas ke sini atau{" "}
            <span className="text-sky-400">jelajahi</span>
          </p>
          <p className="text-[10px] text-zinc-500 mt-1">
            Uji ekstraksi integritas data secara instan
          </p>
        </div>
      )}

      {status === "scanning" && (
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 font-mono max-w-[200px] truncate">
              {fileName}
            </span>
            <span className="text-sky-400 font-mono font-bold">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-800">
            <div
              className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[10px] text-zinc-500 font-mono animate-pulse text-center">
            Mengekstrak manifes hash lokal...
          </p>
        </div>
      )}

      {status === "ready" && (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-[6px] space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span className="truncate max-w-[240px]">{fileName}</span>
            </div>
            <div className="flex items-start gap-1.5 pt-2 border-t border-zinc-900 font-mono text-[9px]">
              <Binary className="h-3 w-3 text-zinc-500 shrink-0 mt-0.5" />
              <span className="text-zinc-400 break-all bg-zinc-900/50 p-1.5 rounded-[6px] border border-zinc-800/40 w-full">
                {fileHash}
              </span>
            </div>
          </div>

          <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-[6px] p-3 text-center">
            <p className="text-[11px] font-medium text-emerald-400/90">
              ✓ Berkas siap dipotong (*shard*) ke dalam Protokol Walrus
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
