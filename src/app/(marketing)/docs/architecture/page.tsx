"use client";

import { useState } from "react";
import {
  Database,
  Cloud,
  ShieldCheck,
  Cpu,
  ArrowRightLeft,
  Layers,
  Zap,
} from "lucide-react";

export default function ArchitecturePage() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  // Helper untuk menentukan apakah jalur/garis harus menyala
  const isPathActive = (nodes: string[]) => {
    return activeNode && nodes.includes(activeNode);
  };

  return (
    <div className="space-y-10 pb-20">
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2 font-heading">
          Arsitektur Hibrida WalSpace
        </h1>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl">
          Memadukan kecepatan manajemen data tradisional dengan keamanan
          mutakhir penyimpanan terdesentralisasi Walrus & Sui.
        </p>
      </div>

      <hr className="border-zinc-900" />

      {/* 1. INTERACTIVE ARCHITECTURE MAP (IDE OUT-OF-THE-BOX) */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-zinc-300">
          <Zap className="h-4 w-4 text-yellow-500" />
          <h2 className="text-sm font-bold uppercase tracking-widest">
            Interactive Data Flow
          </h2>
        </div>

        <div className="relative w-full bg-zinc-950/50 border border-zinc-900 rounded-[6px] p-8 overflow-hidden group">
          {/* Background Grid Accent */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

          {/* DIAGRAM CANVAS */}
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-12 z-10">
            {/* WEB2 LAYER: Supabase */}
            <div
              onMouseEnter={() => setActiveNode("supabase")}
              onMouseLeave={() => setActiveNode(null)}
              className={`flex flex-col items-center gap-3 p-5 rounded-[6px] border transition-all duration-300 cursor-pointer w-40 ${
                activeNode === "supabase"
                  ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  : "bg-zinc-900/50 border-zinc-800"
              }`}
            >
              <Database
                className={`h-8 w-8 ${activeNode === "supabase" ? "text-emerald-400" : "text-zinc-600"}`}
              />
              <div className="text-center">
                <p className="text-xs font-bold text-white">Supabase</p>
                <p className="text-[9px] text-zinc-500 uppercase mt-0.5 tracking-tighter">
                  Metadata & Auth
                </p>
              </div>
            </div>

            {/* THE BRIDGE: Tatum API */}
            <div className="relative flex items-center justify-center">
              {/* Garis Koneksi Kiri */}
              <div
                className={`hidden md:block absolute -left-12 w-12 h-[2px] transition-colors duration-500 ${isPathActive(["supabase", "tatum"]) ? "bg-sky-400 shadow-[0_0_10px_#38bdf8]" : "bg-zinc-800"}`}
              />

              <div
                onMouseEnter={() => setActiveNode("tatum")}
                onMouseLeave={() => setActiveNode(null)}
                className={`flex flex-col items-center gap-3 p-5 rounded-full border transition-all duration-500 cursor-pointer z-20 ${
                  activeNode === "tatum"
                    ? "bg-sky-500/10 border-sky-400 scale-110"
                    : "bg-zinc-900 border-zinc-700"
                }`}
              >
                <ArrowRightLeft
                  className={`h-6 w-6 ${activeNode === "tatum" ? "text-sky-400 animate-pulse" : "text-zinc-400"}`}
                />
              </div>

              {/* Garis Koneksi Kanan */}
              <div
                className={`hidden md:block absolute -right-12 w-12 h-[2px] transition-colors duration-500 ${isPathActive(["tatum", "walrus", "sui"]) ? "bg-sky-400 shadow-[0_0_10px_#38bdf8]" : "bg-zinc-800"}`}
              />
            </div>

            {/* WEB3 LAYER: Walrus & Sui */}
            <div className="flex flex-col gap-6">
              {/* Walrus Node */}
              <div
                onMouseEnter={() => setActiveNode("walrus")}
                onMouseLeave={() => setActiveNode(null)}
                className={`flex flex-col items-center gap-3 p-5 rounded-[6px] border transition-all duration-300 cursor-pointer w-40 ${
                  activeNode === "walrus"
                    ? "bg-indigo-500/10 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.1)]"
                    : "bg-zinc-900/50 border-zinc-800"
                }`}
              >
                <Cloud
                  className={`h-8 w-8 ${activeNode === "walrus" ? "text-indigo-400" : "text-zinc-600"}`}
                />
                <div className="text-center">
                  <p className="text-xs font-bold text-white">Walrus</p>
                  <p className="text-[9px] text-zinc-500 uppercase mt-0.5 tracking-tighter">
                    Blob Storage
                  </p>
                </div>
              </div>

              {/* Sui Node */}
              <div
                onMouseEnter={() => setActiveNode("sui")}
                onMouseLeave={() => setActiveNode(null)}
                className={`flex flex-col items-center gap-3 p-5 rounded-[6px] border transition-all duration-300 cursor-pointer w-40 ${
                  activeNode === "sui"
                    ? "bg-sky-500/10 border-sky-500 shadow-[0_0_20px_rgba(56,189,248,0.1)]"
                    : "bg-zinc-900/50 border-zinc-800"
                }`}
              >
                <ShieldCheck
                  className={`h-8 w-8 ${activeNode === "sui" ? "text-sky-400" : "text-zinc-600"}`}
                />
                <div className="text-center">
                  <p className="text-xs font-bold text-white">Sui Network</p>
                  <p className="text-[9px] text-zinc-500 uppercase mt-0.5 tracking-tighter">
                    Ownership Proof
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Penjelasan Dinamis Berdasarkan Hover */}
          <div className="mt-10 p-4 bg-zinc-900/80 border border-zinc-800 rounded-[6px] min-h-[80px] flex items-center justify-center text-center">
            {!activeNode ? (
              <p className="text-xs text-zinc-500 italic">
                Arahkan kursor ke komponen untuk melihat peran teknisnya.
              </p>
            ) : (
              <p className="text-xs text-zinc-300 leading-relaxed max-w-lg">
                {activeNode === "supabase" &&
                  "Supabase mengelola metadata file (nama, tipe, ukuran) dan struktur organisasi workspace secara instan agar UI tetap responsif."}
                {activeNode === "tatum" &&
                  "Tatum API bertindak sebagai jembatan cerdas yang memantau transaksi Sui dan memverifikasi status shard data Walrus secara real-time."}
                {activeNode === "walrus" &&
                  "Walrus Protocol menyimpan berkas fisik Anda. Berkas dipecah menjadi shards dan disebar ke node tanpa bergantung pada server pusat."}
                {activeNode === "sui" &&
                  "Sui Network mencatat 'sidik jari' (hash) dan bukti kepemilikan berkas ke dalam ledger yang tidak dapat diubah (immutable)."}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 2. HYBRID SPLIT-SCREEN CARD (IDE OUT-OF-THE-BOX) */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-zinc-300">
          <Layers className="h-4 w-4 text-sky-500" />
          <h2 className="text-sm font-bold uppercase tracking-widest">
            Hybrid Strategy
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-800 border border-zinc-800 rounded-[6px] overflow-hidden">
          {/* Kolom Kanan (Web2 Logic) */}
          <div className="bg-zinc-950 p-8 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <Cpu className="h-5 w-5" />
              <h4 className="text-sm font-bold">Metadata Performance Layer</h4>
            </div>
            <ul className="space-y-3">
              {[
                "Otentikasi pengguna berbasis wallet & email",
                "Indeks pencarian file super cepat",
                "Manajemen izin (Role-based Access Control)",
                "Sinkronisasi aktivitas tim real-time",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-[11px] text-zinc-400 leading-relaxed"
                >
                  <div className="h-1 w-1 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom Kiri (Web3 Logic) */}
          <div className="bg-zinc-950 p-8 space-y-4">
            <div className="flex items-center gap-2 text-sky-400">
              <ShieldCheck className="h-5 w-5" />
              <h4 className="text-sm font-bold">Immutable Security Layer</h4>
            </div>
            <ul className="space-y-3">
              {[
                "Penyimpanan blob terdesentralisasi (Walrus)",
                "Bukti integritas data on-chain (Sui)",
                "Censorship-resistant data hosting",
                "Verifikasi publik tanpa pihak ketiga",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-[11px] text-zinc-400 leading-relaxed"
                >
                  <div className="h-1 w-1 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 3. TECHNICAL SUMMARY */}
      <section className="bg-zinc-900/30 p-6 rounded-[6px] border border-zinc-800/50">
        <h3 className="text-xs font-bold text-white mb-3">
          Ringkasan Teknis bagi Juri
        </h3>
        <p className="text-[11px] text-zinc-500 leading-relaxed">
          WalSpace tidak membebani blockchain dengan data besar. Kami memisahkan{" "}
          <strong className="text-zinc-300">ketersediaan data</strong> (Walrus)
          dari <strong className="text-zinc-300">otoritas data</strong> (Sui).
          Supabase digunakan sebagai cache metadata yang sinkron dengan on-chain
          state via <strong className="text-zinc-300">Tatum API</strong>,
          menghasilkan pengalaman pengguna secepat Google Drive namun seaman
          Bitcoin.
        </p>
      </section>
    </div>
  );
}
