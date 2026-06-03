// src/app/api/upload/route.ts

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/services/supabase/admin";
// 🌟 INJEKSI LOGGER: Hubungkan cross-feature system ke modul aktivitas
import { activityLogger } from "@/features/activity/service/activity-logger";

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

    // 1. Validasi input minimal
    if (!blobId || !walletAddress || !workspaceId) {
      return NextResponse.json(
        { error: "Missing required metadata fields" },
        { status: 400 },
      );
    }

    // 2. Validasi Hak Akses (Membership Verification)
    const { data: membership, error: membershipError } = await supabaseAdmin
      .from("workspace_members")
      .select("role")
      .eq("workspace_id", workspaceId)
      .eq("wallet_address", walletAddress)
      .maybeSingle();

    if (membershipError) {
      console.error("Membership Check Error:", membershipError);
      return NextResponse.json(
        { error: "Gagal memverifikasi hak akses ruang kerja." },
        { status: 500 },
      );
    }

    if (!membership) {
      return NextResponse.json(
        {
          error:
            "Akses ditolak. Wallet Anda tidak terdaftar di ruang kerja ini.",
        },
        { status: 403 },
      );
    }

    // 3. Insert data metadata file ke Supabase
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

    // 🌟 ATOMIC AUDIT LOG TRIGGER
    // File sukses masuk tabel? Langsung buat log aktivitasnya di server side!
    await activityLogger.logFileUpload({
      workspaceId,
      walletAddress,
      fileId: data.id, // ID file yang baru saja digenerate database
      fileName,
      fileSize,
      mimeType,
    });

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
