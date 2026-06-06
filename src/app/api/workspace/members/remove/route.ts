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
        { success: false, error: "The payload is incomplete." },
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
          error:
            "Authorization denied. You are not a member of this workspace.",
        },
        { status: 403 },
      );
    }
    if (!target) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The target member no longer exists or has already been removed.",
        },
        { status: 404 },
      );
    }

    // 3. 🔥 Evaluasi Aturan Keamanan Berkas Kebijakan dengan canManageRole
    if (isSelf || !canManageRole(actor.role, target.role)) {
      let errorMessage =
        "Access denied. You do not have the required permissions to remove this member.";
      if (isSelf)
        errorMessage =
          "Action not allowed. The 'Leave Workspace' feature is currently under development.";
      if (target.role === "owner")
        errorMessage =
          "Fatal Error: The workspace Owner cannot be removed from the workspace.";

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
      message: "Collaborator successfully removed from the workspace.",
    });
  } catch (error: any) {
    console.error("Remove Member API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
