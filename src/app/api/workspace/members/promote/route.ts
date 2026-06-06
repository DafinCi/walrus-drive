import { activityLogger } from "@/features/activity/service/activity-logger";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/services/supabase/admin";

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

    const { data: members, error: fetchError } = await supabaseAdmin
      .from("workspace_members")
      .select("wallet_address, role")
      .eq("workspace_id", workspaceId)
      .in("wallet_address", [actorWallet, targetWallet]);

    if (fetchError) throw fetchError;

    const actor = members?.find((m) => m.wallet_address === actorWallet);
    const target = members?.find((m) => m.wallet_address === targetWallet);

    if (!actor)
      return NextResponse.json(
        { success: false, error: "The requesting user is not registered." },
        { status: 403 },
      );
    if (!target)
      return NextResponse.json(
        { success: false, error: "The specified target could not be found." },
        { status: 404 },
      );
    if (target.role === "admin")
      return NextResponse.json({
        success: true,
        message: "This member is already an Admin.",
      });

    // 🌟 FIX 2: Validasi langsung. Hanya Owner yang bisa Promote
    if (actor.role !== "owner") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Access denied. Only the workspace Owner can appoint new Admins.",
        },
        { status: 403 },
      );
    }

    const { error: updateError } = await supabaseAdmin
      .from("workspace_members")
      .update({ role: "admin" })
      .eq("workspace_id", workspaceId)
      .eq("wallet_address", targetWallet);

    if (updateError) throw updateError;

    // 🌟 INJEKSI LOGGER: Mencatat promosi jabatan
    await activityLogger.logMemberPromoted({
      workspaceId,
      actorWalletAddress: actorWallet,
      targetWalletAddress: targetWallet,
      oldRole: target.role,
      newRole: "admin",
    });

    return NextResponse.json({
      success: true,
      message: `${targetWallet.slice(0, 6)}... has been successfully promoted to Admin.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
