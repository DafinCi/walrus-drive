import { activityLogger } from "@/features/activity/service/activity-logger";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/services/supabase/admin";
import { canManageRole } from "@/features/auth/services/auth.service"; // 🔥 Panggil dari service terpusat

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { workspaceId, targetWallet, actorWallet } = body;

    if (!workspaceId || !targetWallet || !actorWallet) {
      return NextResponse.json(
        { success: false, error: "Payload tidak lengkap." },
        { status: 400 },
      );
    }

    const isSelf = actorWallet === targetWallet;

    // 1. Ambil record data kepesertaan
    const { data: members, error: fetchError } = await supabaseAdmin
      .from("workspace_members")
      .select("wallet_address, role")
      .eq("workspace_id", workspaceId)
      .in("wallet_address", [actorWallet, targetWallet]);

    if (fetchError) throw fetchError;

    const actor = members?.find((m) => m.wallet_address === actorWallet);
    const target = members?.find((m) => m.wallet_address === targetWallet);

    // 2. Validasi Keberadaan Entitas
    if (!actor) {
      return NextResponse.json(
        {
          success: false,
          error: "Otoritas ditolak. Anda bukan anggota workspace.",
        },
        { status: 403 },
      );
    }
    if (!target) {
      return NextResponse.json(
        {
          success: false,
          error: "Target anggota sudah tidak ada atau telah dikeluarkan.",
        },
        { status: 404 },
      );
    }

    // 3. 🔥 Evaluasi Aturan Keamanan Berkas Kebijakan dengan canManageRole
    if (isSelf || !canManageRole(actor.role, target.role)) {
      let errorMessage =
        "Anda tidak memiliki hak akses tingkat tinggi untuk mengeluarkan anggota ini.";
      if (isSelf)
        errorMessage =
          "Aksi mandiri diblokir. Fitur 'Tinggalkan Ruang Kerja' dalam pengembangan khusus.";
      if (target.role === "owner")
        errorMessage =
          "Fatal: Pemilik utama (Owner) ruang kerja tidak dapat dikeluarkan.";

      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 403 },
      );
    }

    // 4. Hard Delete Kepesertaan Hubungan Relasional
    const { error: deleteError } = await supabaseAdmin
      .from("workspace_members")
      .delete()
      .eq("workspace_id", workspaceId)
      .eq("wallet_address", targetWallet);

    if (deleteError) throw deleteError;

    // 🌟 INJEKSI LOGGER: Mencatat pengeluaran member
    await activityLogger.logMemberRemoved({
      workspaceId,
      actorWalletAddress: actorWallet,
      targetWalletAddress: targetWallet,
    });

    return NextResponse.json({
      success: true,
      message: "Anggota kolaborator berhasil dikeluarkan dari struktur akses.",
    });
  } catch (error: any) {
    console.error("Remove Member API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
