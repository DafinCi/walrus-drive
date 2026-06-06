import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/services/supabase/admin";

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { token, workspaceId, walletAddress } = body;

    if (!token || !workspaceId || !walletAddress) {
      return NextResponse.json(
        { success: false, error: "The deletion payload is incomplete." },
        { status: 400 },
      );
    }

    // 🔥 SECURITY GUARD: Cek ulang apakah dompet pengeksekusi adalah Owner atau Admin
    const { data: member, error: memberError } = await supabaseAdmin
      .from("workspace_members")
      .select("role")
      .eq("workspace_id", workspaceId)
      .eq("wallet_address", walletAddress)
      .single();

    if (
      memberError ||
      !member ||
      (member.role !== "owner" && member.role !== "admin")
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Access denied. You do not have administrative permissions for this workspace.",
        },
        { status: 403 },
      );
    }

    // Eksekusi penghapusan token cryptografis di database
    const { error: deleteError } = await supabaseAdmin
      .from("workspace_invites")
      .delete()
      .eq("token", token)
      .eq("workspace_id", workspaceId);

    if (deleteError) throw deleteError;

    return NextResponse.json({
      success: true,
      message: "Token successfully revoked.",
    });
  } catch (error: any) {
    console.error("Revoke Invite API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
