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

  // Helper to determine if the connection path should glow
  const isPathActive = (nodes: string[]) => {
    return activeNode && nodes.includes(activeNode);
  };

  return (
    <div className="space-y-10 pb-20">
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2 font-heading">
          Hybrid WalSpace Architecture
        </h1>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl">
          Combining the speed of traditional data management with the
          cutting-edge security of decentralized storage powered by Walrus &
          Sui.
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
                  Collaboration Layer
                </p>
              </div>
            </div>

            {/* THE BRIDGE: Tatum API */}
            <div className="relative flex items-center justify-center">
              {/* Left Connection Line */}
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

              {/* Right Connection Line */}
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
                    Storage Layer
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
                    Verification Layer
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Explanation Based on Hover */}
          <div className="mt-10 p-4 bg-zinc-900/80 border border-zinc-800 rounded-[6px] min-h-[80px] flex items-center justify-center text-center">
            {!activeNode ? (
              <p className="text-xs text-zinc-500 italic">
                Hover over each component to explore its technical role.
              </p>
            ) : (
              <p className="text-xs text-zinc-300 leading-relaxed max-w-lg">
                {activeNode === "supabase" &&
                  "Supabase acts as the Collaboration Layer. It manages workspace logic, members, and file references (like blob IDs) to keep the UI instantly responsive, without storing physical files or blockchain data."}
                {activeNode === "tatum" &&
                  "Tatum serves as the Infrastructure Layer. It provides stable RPC endpoints to quickly query Sui transactions and fetch cryptographic checkpoints for real-time proof verification."}
                {activeNode === "walrus" &&
                  "Walrus functions as the Storage Layer. It securely stores your physical files across a decentralized network, returning a unique blob ID without relying on centralized servers."}
                {activeNode === "sui" &&
                  "Sui operates as the Verification Layer. It immutably records the cryptographic hash and ownership proofs, binding the Walrus blob ID directly to your workspace."}
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
          {/* Right Column (Web2 Logic) */}
          <div className="bg-zinc-950 p-8 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <Cpu className="h-5 w-5" />
              <h4 className="text-sm font-bold">Metadata Performance Layer</h4>
            </div>
            <ul className="space-y-3">
              {[
                "Wallet & email-based user authentication",
                "Lightning-fast file search indexing",
                "Role-Based Access Control (RBAC) permission management",
                "Real-time team activity synchronization",
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

          {/* Left Column (Web3 Logic) */}
          <div className="bg-zinc-950 p-8 space-y-4">
            <div className="flex items-center gap-2 text-sky-400">
              <ShieldCheck className="h-5 w-5" />
              <h4 className="text-sm font-bold">Immutable Security Layer</h4>
            </div>
            <ul className="space-y-3">
              {[
                "Decentralized blob storage (Walrus)",
                "On-chain data integrity proofs (Sui)",
                "Censorship-resistant data hosting",
                "Public verification without third parties",
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
          Technical Overview for Judges
        </h3>
        <p className="text-[11px] text-zinc-500 leading-relaxed">
          WalSpace does not burden the blockchain with large-scale data storage.
          We separate <strong className="text-zinc-300">collaboration</strong>{" "}
          (Supabase) and{" "}
          <strong className="text-zinc-300">data availability</strong> (Walrus)
          from <strong className="text-zinc-300">data authority</strong> (Sui).
          The <strong className="text-zinc-300">Tatum API</strong> serves as the
          infrastructure bridge, delivering a user experience as fast as Google
          Drive while maintaining Web3-grade security.
        </p>
      </section>
    </div>
  );
}
