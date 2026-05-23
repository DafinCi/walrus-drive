"use client";

import { useState } from "react";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { walrusClient } from "@/services/walrus/client";
import { WalrusFile } from "@mysten/walrus";
import { WalletConnectButton } from "@/features/auth";

export default function TestLabPage() {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction();

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("Idle");
  const [blobId, setBlobId] = useState<string | null>(null);

  const handleUploadTest = async () => {
    if (!account) {
      alert("Connect wallet lu dulu, bro!");
      return;
    }
    if (!file) {
      alert("Pilih file dulu!");
      return;
    }

    try {
      setStatus("Inisialisasi writeFilesFlow & WalrusFile API...");

      // 0. Konversi DOM File HTML ke format WalrusFile & Uint8Array sesuai docs
      const fileBuffer = await file.arrayBuffer();
      const walrusFile = WalrusFile.from({
        contents: new Uint8Array(fileBuffer),
        identifier: file.name,
        tags: {
          "content-type": file.type, // Simpan mimetype ke metadata Walrus!
        },
      });

      // 1. ENCODE (Inisialisasi flow pake namespace .walrus)
      const flow = walrusClient.walrus.writeFilesFlow({
        files: [walrusFile],
      });

      setStatus("1/4 - Encoding (Menghitung pecahan & Blob ID lokal)...");
      await flow.encode();

      // 2. REGISTER (Masukin epochs & owner di sini)
      setStatus("2/5 - Registering... Tolong Approve transaksi di Wallet lu!");
      const registerTx = flow.register({
        epochs: 1, // Hackathon mode: 1 epoch aja biar murah
        owner: account.address,
        deletable: true,
      });

      const registerResult = await signAndExecuteTransaction({
        transaction: registerTx,
      });
      await suiClient.waitForTransaction({ digest: registerResult.digest });
      console.log(
        "✅ Register On-Chain Sukses! Digest:",
        registerResult.digest,
      );

      // 3. UPLOAD (Kirim fisik file + lempar bukti txDigest dari tahap register)
      setStatus("3/5 - Uploading fisik file ke Relay...");
      await flow.upload({ digest: registerResult.digest });
      console.log("✅ Upload Fisik ke Relay Sukses!");

      // 4. CERTIFY (Finalisasi on-chain)
      setStatus(
        "4/5 - Certifying... Tolong Approve transaksi TERAKHIR di Wallet!",
      );
      const certifyTx = flow.certify();
      const certifyResult = await signAndExecuteTransaction({
        transaction: certifyTx,
      });
      await suiClient.waitForTransaction({ digest: certifyResult.digest });
      console.log(
        "✅ Sertifikasi On-Chain Sukses! Digest:",
        certifyResult.digest,
      );

      setStatus("5/5 - Mengekstrak metadata & Blob ID...");
      const filesInfo = await flow.listFiles();
      const generatedBlobId = filesInfo[0].blobId;
      setBlobId(generatedBlobId);

      setStatus(
        `🎉 SUKSES TOTAL! File tersimpan dengan Blob ID: ${generatedBlobId}`,
      );
    } catch (error: unknown) {
      console.error("🔥 WADUH ERROR:", error);
      const message = error instanceof Error ? error.message : String(error);
      setStatus(`❌ Gagal: ${message || "Cek console log"}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-black text-white space-y-8 font-mono">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-blue-400">Walrus Test Lab 🔬</h1>
        <p className="text-gray-400">
          Proof of Concept: Sesuai WalrusFile API Docs
        </p>
      </div>

      <div className="p-6 border border-gray-800 rounded-xl bg-gray-900 space-y-6 w-full max-w-lg">
        <div className="flex justify-between items-center">
          <span>Wallet Status:</span>
          <WalletConnectButton />
        </div>

        {account && (
          <div className="space-y-4 pt-4 border-t border-gray-800">
            <div>
              <label
                htmlFor="walrus-file-input"
                className="block text-sm text-gray-400 mb-2"
              >
                Pilih File (Saran: Maks 5MB dulu)
              </label>
              <input
                id="walrus-file-input"
                type="file"
                title="Pilih file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
              />
            </div>

            <button
              onClick={handleUploadTest}
              className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
            >
              🚀 EKSEKUSI UPLOAD PROTOCOL
            </button>
          </div>
        )}

        <div className="p-4 bg-black rounded-lg border border-gray-800">
          <p className="text-sm text-gray-500 mb-1">Status Panel Engine:</p>
          <p
            className={`font-bold ${status.includes("SUKSES") ? "text-green-400" : status.includes("Gagal") ? "text-red-400" : "text-yellow-400"}`}
          >
            {status}
          </p>
          {blobId && (
            <div className="mt-4 p-3 bg-gray-800 rounded">
              <p className="text-xs text-blue-400 break-all mb-2">
                BlobID: {blobId}
              </p>
              {/* Tes Streaming Balik dari Aggregator */}
              <a
                href={`https://aggregator.walrus-testnet.walrus.space/v1/blobs/${blobId}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-white underline hover:text-blue-300"
              >
                🔗 Buka File di Walrus Aggregator
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
