import { ShieldCheck, Info } from "lucide-react";

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center space-x-3 border-b border-gray-800 pb-5">
        <ShieldCheck className="w-8 h-8 text-green-500" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            On-Chain Verification
          </h1>
          <p className="text-xs text-gray-400 font-mono ">
            Verifikasi File • ID: {workspaceId}
          </p>
        </div>
      </div>

      <div className="bg-gray-900/40 border border-gray-800 p-6 rounded-sm flex items-start space-x-4">
        <Info className="w-6 h-6 text-blue-400 shrink-0 mt-1" />
        <div>
          <h3 className="text-lg font-medium text-gray-200">
            Segera Hadir: Tatum RPC Engine
          </h3>
          <p className="text-gray-400 text-sm mt-2 leading-relaxed max-w-3xl">
            Di sinilah kita akan mengimplementasikan SDK Tatum. Sistem akan
            melakukan validasi `txDigest` milik Walrus langsung dari blockchain
            SUI untuk mencetak bukti (Proof) kriptografi yang membuktikan
            keaslian file.
          </p>
        </div>
      </div>
    </div>
  );
}
