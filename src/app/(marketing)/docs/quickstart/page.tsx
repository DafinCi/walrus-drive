"use client";

import { useState } from "react";
import { Check, Copy, Terminal as TerminalIcon } from "lucide-react";

export default function QuickstartPage() {
  const [network, setNetwork] = useState<"testnet" | "mainnet">("testnet");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Gagal menyalin teks", err);
    }
  };

  // Komponen Terminal Kustom yang Ringan & Estetik
  const TerminalWindow = ({
    filename,
    code,
    id,
  }: {
    filename: string;
    code: string;
    id: string;
  }) => (
    <div className="mt-4 rounded-xl overflow-hidden border border-zinc-800 bg-[#0a0a0a] shadow-2xl transition-all hover:border-zinc-700">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-950 border-b border-zinc-900/50">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        </div>
        <div className="text-[10px] font-mono text-zinc-500 select-none flex items-center gap-2">
          <TerminalIcon className="w-3 h-3" /> {filename}
        </div>
        <button
          onClick={() => handleCopy(code, id)}
          className="text-zinc-500 hover:text-white transition-colors"
          title="Copy code"
        >
          {copiedId === id ? (
            <Check className="w-3.5 h-3.5 text-green-400" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
      {/* Terminal Body */}
      <div className="p-4 overflow-x-auto text-xs font-mono text-sky-200 leading-loose">
        <pre>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Header Halaman */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
          Panduan Memulai Cepat
        </h1>
        <p className="text-zinc-400 text-sm">
          Siapkan lingkungan lokal Anda dan mulai berinteraksi dengan Walrus
          Protocol dalam hitungan menit.
        </p>
      </div>

      <hr className="border-zinc-900" />

      {/* VERTICAL STEPPER / TIMELINE */}
      <div className="relative border-l border-zinc-800 ml-2 md:ml-4 space-y-12">
        {/* LANGKAH 1: Clone Repository */}
        <div className="relative pl-8">
          {/* Dot Indicator */}
          <div className="absolute -left-3 top-0 h-6 w-6 rounded-full bg-black border border-zinc-700 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
          </div>

          <h3 className="text-base font-bold text-white mb-1">
            1. Kloning Repositori
          </h3>
          <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
            Unduh kode sumber TrestoSpace ke mesin lokal Anda dan masuk ke dalam
            direktori proyek.
          </p>

          <TerminalWindow
            id="step1"
            filename="bash"
            code={`git clone https://github.com/DafinCi/walrus-drive\ncd walrus-drive\nnpm install`}
          />
        </div>

        {/* LANGKAH 2: Konfigurasi Environment (Smart Configurator) */}
        <div className="relative pl-8">
          <div className="absolute -left-3 top-0 h-6 w-6 rounded-full bg-black border border-zinc-800 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-zinc-600" />
          </div>

          <h3 className="text-base font-bold text-white mb-1">
            2. Siapkan Environment
          </h3>
          <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
            Salin file{" "}
            <code className="text-sky-300 bg-sky-900/20 px-1 py-0.5 rounded">
              .env.example
            </code>{" "}
            menjadi{" "}
            <code className="text-sky-300 bg-sky-900/20 px-1 py-0.5 rounded">
              .env.local
            </code>
            . Pilih jaringan Sui yang ingin Anda gunakan untuk otomatis
            menyesuaikan konfigurasi di bawah:
          </p>

          {/* Tab Switcher */}
          <div className="inline-flex items-center p-1 bg-zinc-950 border border-zinc-800 rounded-lg mb-2">
            <button
              onClick={() => setNetwork("testnet")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                network === "testnet"
                  ? "bg-sky-500/10 text-sky-400"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Sui Testnet
            </button>
            <button
              onClick={() => setNetwork("mainnet")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                network === "mainnet"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Sui Mainnet
            </button>
          </div>

          <TerminalWindow
            id="step2"
            filename=".env.local"
            code={`# Tatum API Configuration\nTATUM_API_KEY=your_tatum_api_key_here\n\n# Sui Network Config\nNEXT_PUBLIC_SUI_NETWORK=${network}\nNEXT_PUBLIC_SUI_RPC_URL=${
              network === "testnet"
                ? "https://fullnode.testnet.sui.io:443"
                : "https://fullnode.mainnet.sui.io:443"
            }\n\n# Walrus Protocol Nodes\nNEXT_PUBLIC_WALRUS_PUBLISHER=https://publisher.walrus-${network}.com\nNEXT_PUBLIC_WALRUS_AGGREGATOR=https://aggregator.walrus-${network}.com\n\n# Supabase Config (Hybrid Metadata)\nNEXT_PUBLIC_SUPABASE_URL=your_supabase_url\nNEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key`}
          />
        </div>

        {/* LANGKAH 3: Jalankan Aplikasi */}
        <div className="relative pl-8">
          <div className="absolute -left-3 top-0 h-6 w-6 rounded-full bg-black border border-zinc-800 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-zinc-600" />
          </div>

          <h3 className="text-base font-bold text-white mb-1">
            3. Inisialisasi Sistem
          </h3>
          <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
            Jalankan server pengembangan lokal. Sistem akan otomatis memvalidasi
            koneksi ke node Walrus dan Tatum API sebelum *render* halaman.
          </p>

          <TerminalWindow
            id="step3"
            filename="bash"
            code={`npm run dev\n\n# > Ready on http://localhost:3000\n# > Verifying Walrus network... [OK]\n# > Connecting to Tatum API... [OK]`}
          />
        </div>
      </div>
    </div>
  );
}
