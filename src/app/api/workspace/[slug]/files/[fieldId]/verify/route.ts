import { NextRequest, NextResponse } from "next/server";
import { verifyBlobTransaction } from "@/services/tatum/verification";
import { createClient } from "@supabase/supabase-js"; // Gunakan service_role client khusus server

// Inisialisasi Supabase dengan service_role bypass (Sesuai Gatekeeper Mode lu)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string; fileId: string } },
) {
  try {
    const { slug, fileId } = params;
    const { txDigest } = await req.json();

    if (!txDigest) {
      return NextResponse.json(
        { error: "Transaction digest wajib diisi" },
        { status: 400 },
      );
    }

    // 1. Ambil data file & aktor pengeksekusi dari database internal terlebih dahulu
    const { data: fileData, error: fileError } = await supabaseAdmin
      .from("files")
      .select("id, file_name, workspace_id, wallet_address")
      .eq("id", fileId)
      .single();

    if (fileError || !fileData) {
      return NextResponse.json(
        { error: "File tidak ditemukan di workspace" },
        { status: 404 },
      );
    }

    // 2. Jalankan Pertahanan Lapis 2: Panggil Tatum Server RPC Client
    const tatumResult = await verifyBlobTransaction(txDigest);

    // 3. Evaluasi Hasil Tatum & Petakan Menjadi Cerita Log Aktivitas
    if (tatumResult.isVerified && tatumResult.status === "success") {
      // A. Update status transaksi sertifikasi di tabel files internal jika diperlukan
      await supabaseAdmin
        .from("files")
        .update({ certify_tx_digest: txDigest })
        .eq("id", fileId);

      // B. Catat Cerita Sukses ke Tabel Activities (Sesuai format skema baru kita)
      await supabaseAdmin.from("activities").insert({
        workspace_id: fileData.workspace_id,
        actor_wallet_address: fileData.wallet_address, // Dompet pemicu aksi
        action: "FILE_VERIFIED",
        entity_type: "verification",
        entity_id: fileData.id,
        metadata: {
          file_name: fileData.file_name,
          checkpoint: tatumResult.checkpoint || "N/A",
          tx_digest: txDigest,
          gas_used_mist: tatumResult.gasUsed || "0",
          sender_address: tatumResult.sender,
          network: "sui-testnet",
        },
      });

      return NextResponse.json({
        success: true,
        message: "File proof successfully logged",
      });
    } else {
      // JIKA GAGAL: Tetap catat ke tabel activity sebagai log kegagalan audit
      await supabaseAdmin.from("activities").insert({
        workspace_id: fileData.workspace_id,
        actor_wallet_address: fileData.wallet_address,
        action: "FILE_VERIFICATION_FAILED",
        entity_type: "verification",
        entity_id: fileData.id,
        metadata: {
          file_name: fileData.file_name,
          tx_digest: txDigest,
          reason:
            tatumResult.errorMsg ||
            "Transaction executed but smart contract failed",
        },
      });

      return NextResponse.json(
        {
          success: false,
          error: tatumResult.errorMsg || "Blockchain validation failed",
        },
        { status: 422 },
      );
    }
  } catch (error: any) {
    console.error("Critical error in verification handler:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
