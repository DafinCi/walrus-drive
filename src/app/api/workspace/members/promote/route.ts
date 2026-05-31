import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/services/supabase/admin";
// 🌟 FIX 1: Hapus import canPromote yang bikin crash

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
        { success: false, error: "Aktor tidak terdaftar." },
        { status: 403 },
      );
    if (!target)
      return NextResponse.json(
        { success: false, error: "Target tidak ditemukan." },
        { status: 404 },
      );
    if (target.role === "admin")
      return NextResponse.json({
        success: true,
        message: "Sudah berstatus Admin.",
      });

    // 🌟 FIX 2: Validasi langsung. Hanya Owner yang bisa Promote
    if (actor.role !== "owner") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Ditolak. Hanya pemilik penuh (Owner) yang berhak mengangkat Admin baru.",
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

    return NextResponse.json({
      success: true,
      message: `Berhasil mengangkat ${targetWallet.slice(0, 6)}... menjadi Admin.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
