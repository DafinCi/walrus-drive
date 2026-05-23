"use client";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { WalletConnectButton } from "@/features/auth/components/wallet-connect-btn";
import { Dropzone } from "@/features/upload/components/dropzone";

export default function TestLabPage() {
  const account = useCurrentAccount();

  return (
    <div className="min-h-screen flex flex-col items-center p-8 bg-black text-white space-y-8 font-mono selection:bg-blue-500/30">
      {/* HEADER SECTION */}
      <div className="text-center space-y-2 mt-8">
        <h1 className="text-3xl font-bold text-blue-400">Walrus Test Lab 🔬</h1>
        <p className="text-gray-400">
          Dropzone UI ⚡ Service Architecture Validation
        </p>
      </div>

      {/* MAIN WORKSPACE */}
      <div className="p-6 border border-gray-800 rounded-xl bg-gray-900 space-y-6 w-full max-w-xl shadow-2xl">
        {/* WALLET STATUS BAR */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-800">
          <span className="text-sm text-gray-400">
            {account ? (
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                System Ready
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                Awaiting Connection
              </span>
            )}
          </span>
          <WalletConnectButton />
        </div>

        {/* DROPZONE AREA */}
        <div className="pt-2">
          {account ? (
            <Dropzone />
          ) : (
            <div className="flex items-center justify-center py-12 border-2 border-dashed border-gray-800 rounded-xl bg-black/50">
              <p className="text-sm text-gray-500">
                Connect wallet lu dulu di atas, bro!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
