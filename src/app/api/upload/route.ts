// src/app/api/upload/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/services/supabase/admin"; // Pastikan path ini sesuai servis lu

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      blobId,
      registerTx,
      certifyTx,
      fileName,
      mimeType,
      fileSize,
      walletAddress,
      workspaceId,
      checksum,
      storageEpoch,
    } = body;

    // Validasi input minimal
    if (!blobId || !walletAddress || !workspaceId) {
      return NextResponse.json(
        { error: "Missing required metadata fields" },
        { status: 400 },
      );
    }

    // Insert data metadata file ke Supabase
    const { data, error } = await supabaseAdmin
      .from("files")
      .insert([
        {
          workspace_id: workspaceId,
          blob_id: blobId,
          file_name: fileName,
          mime_type: mimeType,
          file_size: fileSize,
          wallet_address: walletAddress,
          register_tx_digest: registerTx,
          certify_tx_digest: certifyTx,
          checksum: checksum,
          storage_epoch: storageEpoch || 1,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase Insert Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
