import { HeroSection } from "@/components/marketing/hero-section";
import { ShardingPipeline } from "@/components/marketing/sharding-pipeline";
import { Shield, Cpu, Users2, Database } from "lucide-react";

export default function OfficialLandingPage() {
  return (
    <main className="relative z-10 pt-16">
      {/* Hero Area + Live Proof Playground */}
      <HeroSection />

      {/* Bento Box Features Grid */}
      <section
        id="features"
        className="w-full max-w-6xl mx-auto px-4 py-20 border-t border-zinc-900 scroll-mt-16"
      >
        <div className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Sistem Operasi Kerja Masa Depan
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Keamanan mutakhir Web3 yang dibungkus dengan kesederhanaan
            pengalaman SaaS modern.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Box 1: Walrus Sharding Teaser */}
          <div className="md:col-span-7 bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between gap-8 group hover:border-zinc-800 transition-colors">
            <div className="space-y-2">
              <div className="p-2 bg-sky-500/10 border border-sky-500/20 rounded-lg w-fit text-sky-400">
                <Database className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-white mt-3">
                Protokol Desentralisasi Walrus
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-md">
                Berkas Anda dipecah secara matematis menjadi serpihan kecil
                (*sharding*) dan didistribusikan ke jaringan node Sui. Menjamin
                ketersediaan data tinggi tanpa bergantung pada server tunggal.
              </p>
            </div>
            <ShardingPipeline />
          </div>

          {/* Box 2: Cryptographic Proof */}
          <div className="md:col-span-5 bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between group hover:border-zinc-800 transition-colors">
            <div className="space-y-2">
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg w-fit text-emerald-400">
                <Shield className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-white mt-3">
                Verifikasi Bukti Kriptografi
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Setiap dokumen yang tersimpan memiliki sertifikat digital
                berbasis hash transaksi Sui Network. Siapapun dapat
                memverifikasi integritas berkas secara mutlak tanpa celah
                pemalsuan metadata.
              </p>
            </div>
            <div className="border border-zinc-900 bg-zinc-950 p-4 rounded-xl font-mono text-[9px] text-zinc-500 space-y-1">
              <div className="text-zinc-400 flex justify-between">
                <span>[SUI_TX_DIGEST]</span>
                <span className="text-emerald-500">VERIFIED</span>
              </div>
              <p className="truncate">
                0x8a12f309a4b8c71d2eef234b92c81a2b3c4d5e6f
              </p>
              <div className="w-full bg-zinc-900 h-1 rounded-full mt-2 overflow-hidden">
                <div className="bg-emerald-500 h-full w-full" />
              </div>
            </div>
          </div>

          {/* Box 3: Role-Based Workspace */}
          <div className="md:col-span-6 bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 flex flex-col gap-4 group hover:border-zinc-800 transition-colors">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg w-fit text-indigo-400">
              <Users2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Kolaborasi Tim Berbasis Enkripsi
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                Undang rekan kerja Anda dengan sistem manajemen akses
                terdesentralisasi. Hak membaca dan menulis berkas diatur penuh
                lewat kunci kriptografi unik per ruang kerja.
              </p>
            </div>
          </div>

          {/* Box 4: Multi-Engine Validated */}
          <div className="md:col-span-6 bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 flex flex-col gap-4 group hover:border-zinc-800 transition-colors">
            <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg w-fit text-purple-400">
              <Cpu className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Infrastruktur Hibrida Berkecepatan Tinggi
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                Sinkronisasi dokumen secepat kilat berkat integrasi paralel
                antara database metadata Supabase dengan ketangguhan jaringan
                penyimpanan blob milik Walrus Protocol.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Spec */}
      <section
        id="architecture"
        className="w-full max-w-6xl mx-auto px-4 py-16 border-t border-zinc-900 text-center"
      >
        <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
          Powered By Advanced Tech-Stack
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 font-mono text-xs font-bold text-zinc-400">
          <span>WALRUS PROTOCOL</span>
          <span className="text-zinc-800">•</span>
          <span>SUI NETWORK</span>
          <span className="text-zinc-800">•</span>
          <span>TATUM API</span>
          <span className="text-zinc-800">•</span>
          <span>SUPABASE</span>
          <span className="text-zinc-800">•</span>
          <span>NEXT.JS</span>
        </div>
      </section>
    </main>
  );
}
