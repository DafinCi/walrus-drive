export default function DocsIntroductionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
          Pengantar WalSpace
        </h1>
        <p className="text-zinc-400 text-sm">
          Platform kolaborasi dan penyimpanan terdesentralisasi berbasis
          enkripsi mutakhir.
        </p>
      </div>

      <div className="h-[1px] bg-zinc-900 w-full" />

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">
          Latar Belakang Proyek
        </h2>
        <p className="text-zinc-400 text-xs leading-relaxed">
          SaaS kolaboratif tradisional (seperti Google Drive) memegang kendali
          penuh atas file Anda pada server terpusat.
          <span className="text-zinc-200">
            {" "}
            WalSpace hadir sebagai solusi hibrida
          </span>{" "}
          yang menggabungkan kenyamanan manajemen tim ala SaaS modern dengan
          keamanan mutakhir infrastruktur Web3.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">
          Pilar Teknologi Utama
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-sm">
            <h4 className="text-xs font-bold text-white mb-1">
              1. Walrus Blob Storage
            </h4>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Berkas ditiadakan dari server tunggal, melainkan dipecah
              (sharding) secara matematis dan diamankan ke simpul
              desentralisasi.
            </p>
          </div>
          <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-sm">
            <h4 className="text-xs font-bold text-white mb-1">
              2. Otentikasi Kriptografi Sui
            </h4>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Identitas pengguna diikat dengan tanda tangan dompet digital,
              memetakan kepemilikan data tanpa memerlukan password tradisional.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
