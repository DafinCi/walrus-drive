"use client";

import { useState } from "react";
import { Send, Terminal, Cpu, Check, Code, RefreshCw } from "lucide-react";

type EndpointKey = "getWallet" | "getTransaction" | "getWalrusStatus";

interface EndpointData {
  method: "GET" | "POST";
  url: string;
  description: string;
  response: object;
}

export default function TatumDocsPage() {
  const [activeTab, setActiveTab] = useState<EndpointKey>("getWallet");
  const [isLoading, setIsLoading] = useState(false);
  const [showResponse, setShowResponse] = useState(false);

  const endpoints: Record<EndpointKey, EndpointData> = {
    getWallet: {
      method: "GET",
      url: "https://api.tatum.io/v3/sui/account/0x7a31...f9b2",
      description:
        "Mengambil saldo asset dan metadata akun Sui Network pengguna secara real-time.",
      response: {
        status: "success",
        network: "sui-testnet",
        address: "0x7a31ef909a4b8c71d2eef234b92c81a2b3c4d5e6f",
        balance: {
          SUI: "142.50392",
          TRESTO_GOVERNANCE: "500.00",
        },
        activeWorkspaces: 3,
        lastActive: "2026-05-29T11:27:00Z",
      },
    },
    getTransaction: {
      method: "GET",
      url: "https://api.tatum.io/v3/sui/tx/0x8a12...3c4d",
      description:
        "Memverifikasi integritas manifes kriptografi dan stempel waktu file di blockchain Sui.",
      response: {
        digest: "0x8a12f309a4b8c71d2eef234b92c81a2b3c4d5e6f",
        sender: "0x7a31ef909a4b8c71d2eef234b92c81a2b3c4d5e6f",
        status: "success",
        checkpoint: 4810294,
        timestamp: 1780054020,
        events: [
          {
            type: "WalSpace::document::ManifestCreated",
            walrusBlobId: "walrus-blob-abc-98765-xyz",
            fileHash:
              "sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
          },
        ],
      },
    },
    getWalrusStatus: {
      method: "POST",
      url: "https://api.tatum.io/v3/walrus/storage/verify-shards",
      description:
        "Memeriksa ketersediaan kesehatan serpihan data (shards) di jaringan node desentralisasi Walrus.",
      response: {
        blobId: "walrus-blob-abc-98765-xyz",
        registeredOnSui: true,
        redundancyRatio: "4x",
        shardsDistribution: {
          totalShards: 32,
          healthyNodes: 32,
          failedNodes: 0,
        },
        integrityCheck: "PASS",
        synchronized: true,
      },
    },
  };

  const triggerRequest = () => {
    setIsLoading(true);
    setShowResponse(false);

    // Simulasi loading jaringan agar terkesan nyata
    setTimeout(() => {
      setIsLoading(false);
      setShowResponse(true);
    }, 800);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* HEADER SECTION */}
      <div>
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 w-fit text-sky-400 text-[10px] font-mono uppercase mb-3">
          Core Gateway Integration
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
          Infrastruktur Tatum API
        </h1>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Bagaimana WalSpace mengoptimalkan API terpadu Tatum untuk melakukan
          agregasi data blockchain secepat kilat.
        </p>
      </div>

      <hr className="border-zinc-900" />

      {/* API PLAYGROUND INTERAKTIF */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-zinc-300">
          <Code className="h-4 w-4 text-sky-400" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            Live API Playground (Mock)
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-zinc-950/40 border border-zinc-900 rounded-sm p-6 relative overflow-hidden">
          {/* KOLOM KIRI: REQUEST SELECTOR (40%) */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <p className="text-[11px] font-medium text-zinc-500">
                PILIH ENDPOINT DATUM:
              </p>

              <div className="flex flex-col gap-2">
                {(Object.keys(endpoints) as EndpointKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveTab(key);
                      setShowResponse(false);
                    }}
                    className={`w-full text-left p-3 rounded-sm border text-xs font-medium transition-all ${
                      activeTab === key
                        ? "bg-sky-500/10 border-sky-500/40 text-white"
                        : "bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:border-zinc-800 hover:text-zinc-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          endpoints[key].method === "GET"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-purple-500/10 text-purple-400"
                        }`}
                      >
                        {endpoints[key].method}
                      </span>
                      <span className="font-mono text-[11px] truncate">
                        {key === "getWallet" && "/sui/account/:id"}
                        {key === "getTransaction" && "/sui/tx/:digest"}
                        {key === "getWalrusStatus" && "/walrus/verify-shards"}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-sans font-normal line-clamp-1">
                      {endpoints[key].description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* URL Input Bar & Action Button */}
            <div className="space-y-2 pt-4 border-t border-zinc-900">
              <div className="bg-zinc-950 border border-zinc-800 p-2 rounded-sm font-mono text-[10px] text-zinc-400 truncate select-all">
                {endpoints[activeTab].url}
              </div>
              <button
                onClick={triggerRequest}
                disabled={isLoading}
                className="w-full bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600 font-bold text-xs py-2.5 px-4 rounded-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {isLoading ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Kirim Request</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* KOLOM KANAN: RESPONSE WINDOW (60%) */}
          <div className="lg:col-span-7 bg-[#050505] border border-zinc-800 rounded-sm overflow-hidden flex flex-col min-h-[300px]">
            {/* Window Top Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-950 border-b border-zinc-900">
              <div className="flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 text-zinc-500" />
                <span className="text-[10px] font-mono text-zinc-500">
                  Response Payload
                </span>
              </div>
              {showResponse && (
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  <Check className="h-3 w-3" />
                  <span>200 OK</span>
                </div>
              )}
            </div>

            {/* Window Content */}
            <div className="p-4 flex-1 font-mono text-[11px] leading-relaxed overflow-auto max-h-[350px]">
              {isLoading && (
                <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-2 py-20">
                  <RefreshCw className="h-5 w-5 animate-spin text-sky-500" />
                  <p className="text-[10px] animate-pulse">
                    Awaiting Tatum Edge Nodes...
                  </p>
                </div>
              )}

              {!isLoading && !showResponse && (
                <div className="h-full flex items-center justify-center text-zinc-600 text-center py-20 px-4">
                  <p className="text-[11px] italic">
                    Klik tombol "Kirim Request" untuk mengeksekusi panggilan API
                    via infrastruktur Tatum.
                  </p>
                </div>
              )}

              {!isLoading && showResponse && (
                <pre className="text-sky-300">
                  <code>
                    {JSON.stringify(endpoints[activeTab].response, null, 2)}
                  </code>
                </pre>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* BENEFIT EXPLANATION BOX */}
      <section className="bg-zinc-900/20 border border-zinc-900 p-6 rounded-sm space-y-4">
        <div className="flex items-center gap-2 text-zinc-300">
          <Cpu className="h-4 w-4 text-emerald-400" />
          <h3 className="text-xs font-bold uppercase tracking-widest">
            Kenapa Harus Menggunakan Tatum API?
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] text-zinc-400 leading-relaxed">
          <p>
            <strong className="text-zinc-200">
              1. Abstraksi Kompleksitas Node RPC:
            </strong>{" "}
            Tanpa Tatum, tim kami harus mengelola koneksi RPC mentah Sui dan
            mem-parsing data heksadesimal yang rumit. Tatum menyatukan ini ke
            dalam format REST JSON yang bersih.
          </p>
          <p>
            <strong className="text-zinc-200">
              2. Infrastruktur Skala Multi-Region:
            </strong>{" "}
            Kueri riwayat transaksi dilayani lewat jaringan cache terdistribusi
            Tatum global, mengurangi latensi respon UI aplikasi dari 1200ms
            menjadi di bawah 90ms.
          </p>
        </div>
      </section>
    </div>
  );
}
