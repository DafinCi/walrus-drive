import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/services/supabase/admin";
import { verifyBlobTransaction } from "@/services/tatum/verification";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fileId } = body;

    if (!fileId) {
      return NextResponse.json(
        { success: false, error: "Missing required parameter: fileId." },
        { status: 400 },
      );
    }

    // 1. Ambil data file dari database Supabase
    const { data: file, error: fetchError } = await supabaseAdmin
      .from("files")
      .select("*")
      .eq("id", fileId)
      .single();

    if (fetchError || !file) {
      return NextResponse.json(
        {
          success: false,
          error: "The requested file was not found in the database.",
        },
        { status: 404 },
      );
    }

    // 2. CEK CACHE: Kalau status udah verified, jangan buang RPS Tatum!
    // Asumsi lu pakai string 'status' atau boolean 'verified' di database.
    if (file.status === "verified" || file.verified === true) {
      return NextResponse.json({
        success: true,
        message: "Data served from the database cache (reducing RPS usage).",
        data: file,
      });
    }

    // Sesuaikan nama kolom dengan schema database lu (tx_digest atau register_tx_digest)
    const txDigest = file.register_tx_digest || file.tx_digest;

    if (!txDigest) {
      return NextResponse.json(
        {
          success: false,
          error: "No Transaction Digest has been recorded for this file yet.",
        },
        { status: 400 },
      );
    }

    // 3. LAZY VERIFICATION: Tembak Tatum RPC hanya jika diperlukan
    const verification = await verifyBlobTransaction(txDigest);

    // Kasus 1: Transaksi masih muter di mempool atau belum final
    if (
      verification.status === "pending" ||
      verification.status === "not_found"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The transaction is still being processed by the Sui network.",
          data: verification,
        },
        { status: 202 }, // 202 Accepted: Diterima tapi belum selesai
      );
    }

    // Kasus 2: Transaksi gagal di blockchain (misal gas habis / logic error)
    if (verification.status === "failure") {
      await supabaseAdmin
        .from("files")
        .update({ status: "failed" })
        .eq("id", fileId);

      return NextResponse.json(
        {
          success: false,
          error: "Transaction execution failed on the blockchain.",
        },
        { status: 400 },
      );
    }

    // Kasus 3: SUKSES. Update database Supabase lu dengan metadata blockchain.
    if (verification.isVerified) {
      const updatedData = {
        status: "verified",
        // verified: true, // Buka komen ini jika database lu pakai boolean bukan enum
        checkpoint: verification.checkpoint,
        gas_used: verification.gasUsed,
        sender: verification.sender,
        verified_at: new Date(Number(verification.timestamp)).toISOString(),
      };

      const { data: updatedFile, error: updateError } = await supabaseAdmin
        .from("files")
        .update(updatedData)
        .eq("id", fileId)
        .select()
        .single();

      if (updateError) throw updateError;

      return NextResponse.json({
        success: true,
        message:
          "File successfully verified and immutably recorded on the blockchain.",
        data: updatedFile,
      });
    }

    // Fallback jika terjadi kondisi tidak terduga
    return NextResponse.json(
      {
        success: false,
        error: "Verification failed due to an unexpected error.",
      },
      { status: 500 },
    );
  } catch (error: any) {
    console.error("Proof API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
