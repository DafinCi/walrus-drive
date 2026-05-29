import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiveProofPlayground } from "./live-proof-playground";

export function HeroSection() {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 pt-20 pb-16 md:pt-28 md:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      {/* Kolom Kiri: Copywriting */}
      <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[11px] font-medium text-zinc-300">
          <Terminal className="h-3.5 w-3.5 text-sky-400" />
          <span>Tatum x Walrus Hackathon Project</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
          Decentralized <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400">
            Collaborative Space
          </span>
        </h1>

        <p className="text-zinc-400 text-sm md:text-base max-w-xl leading-relaxed">
          Unggah, verifikasi, dan bagikan berkas bersama tim Anda dalam ruang
          kerja terdesentralisasi. Didukung oleh enkripsi penuh dan penyimpanan
          blob tangguh Walrus Protocol.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto pt-2">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto font-semibold text-xs bg-white text-black hover:bg-zinc-200 cursor-pointer"
          >
            <Link href="/workspace" className="gap-2">
              Launch Application <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto font-semibold text-xs border-zinc-800 text-zinc-300 hover:bg-zinc-900 cursor-pointer"
          >
            <Link
              href="https://github.com/DafinCi/walrus-drive"
              target="_blank"
            >
              Dokumentasi GitHub
            </Link>
          </Button>
        </div>
      </div>

      {/* Kolom Kanan: Live Playground */}
      <div className="lg:col-span-5 flex justify-center lg:justify-end w-full animate-in fade-in slide-in-from-bottom-8 duration-500 delay-150">
        <LiveProofPlayground />
      </div>
    </section>
  );
}
