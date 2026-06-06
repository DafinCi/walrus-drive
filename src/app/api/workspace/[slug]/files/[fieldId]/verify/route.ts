import { NextRequest, NextResponse } from "next/server";
import { verifyBlobTransaction } from "@/services/tatum/verification";
import { createClient } from "@supabase/supabase-js";
import { activityLogger } from "@/features/activity/service/activity-logger";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; fieldId: string }> },
) {
  try {
    // 🌟 PERBAIKAN 3: Kita harus await params terlebih dahulu
    const resolvedParams = await params;

    // Kita buat alias dari fieldId menjadi fileId supaya kode lu ke bawah tidak perlu diubah
    const { slug, fieldId: fileId } = resolvedParams;

    const { txDigest } = await req.json();

    if (!txDigest) {
      return NextResponse.json(
        { error: "Transaction digest wajib diisi" },
        { status: 400 },
      );
    }

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

    const tatumResult = await verifyBlobTransaction(txDigest);

    if (tatumResult.isVerified && tatumResult.status === "success") {
      await supabaseAdmin
        .from("files")
        .update({ certify_tx_digest: txDigest })
        .eq("id", fileId);

      // 🌟 DELEGASI KE LOGGER (SUKSES)
      await activityLogger.fileVerified({
        workspaceId: fileData.workspace_id,
        actorId: fileData.wallet_address,
        fileId: fileData.id,
        fileName: fileData.file_name,
        checkpoint: tatumResult.checkpoint || "N/A",
        txDigest: txDigest,
      });

      return NextResponse.json({
        success: true,
        message: "File proof successfully logged",
      });
    } else {
      // 🌟 DELEGASI KE LOGGER (GAGAL)
      await activityLogger.fileVerificationFailed({
        workspaceId: fileData.workspace_id,
        actorId: fileData.wallet_address,
        fileId: fileData.id,
        fileName: fileData.file_name,
        txDigest: txDigest,
        reason:
          tatumResult.errorMsg ||
          "Transaction executed but smart contract failed",
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
