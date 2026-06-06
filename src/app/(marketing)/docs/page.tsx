export default function DocsIntroductionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
          Introduction to WalSpace
        </h1>
        <p className="text-zinc-400 text-sm">
          A decentralized collaboration and storage platform powered by advanced
          encryption technology.
        </p>
      </div>

      <div className="h-[1px] bg-zinc-900 w-full" />

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">Project Background</h2>
        <p className="text-zinc-400 text-xs leading-relaxed">
          Traditional collaborative SaaS platforms (such as Google Drive)
          maintain full control over your files through centralized servers.
          <span className="text-zinc-200">
            {" "}
            WalSpace introduces a hybrid solution
          </span>{" "}
          that combines the convenience of modern SaaS-style team management
          with the advanced security of Web3 infrastructure.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">
          Core Technology Pillars
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-[6px]">
            <h4 className="text-xs font-bold text-white mb-1">
              1. Walrus Blob Storage
            </h4>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Files are no longer stored on a single server. Instead, they are
              mathematically fragmented through sharding and secured across
              decentralized nodes.
            </p>
          </div>
          <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-[6px]">
            <h4 className="text-xs font-bold text-white mb-1">
              2. Sui Cryptographic Authentication
            </h4>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              User identities are secured through digital wallet signatures,
              establishing verifiable data ownership without relying on
              traditional passwords.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
