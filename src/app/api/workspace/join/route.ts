import { activityLogger } from "@/features/activity/service/activity-logger";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/services/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, walletAddress } = body;

    if (!token || !walletAddress) {
      return NextResponse.json(
        { success: false, error: "Payload pendaftaran tidak lengkap." },
        { status: 400 },
      );
    }

    // 1. Re-validasi Token demi keamanan berlapis
    const { data: invite, error: inviteError } = await supabaseAdmin
      .from("workspace_invites")
      .select("*")
      .eq("token", token)
      .single();

    if (inviteError || !invite) {
      return NextResponse.json(
        { success: false, error: "Tautan undangan tidak sah." },
        { status: 400 },
      );
    }

    const isExpired =
      new Date(invite.expires_at).getTime() < new Date().getTime();
    if (isExpired) {
      return NextResponse.json(
        { success: false, error: "Tautan undangan sudah kedaluwarsa." },
        { status: 400 },
      );
    }

    // 🌟 Ambil 'slug' dari tabel workspaces berdasarkan workspace_id
    const { data: workspaceData, error: workspaceError } = await supabaseAdmin
      .from("workspaces")
      .select("slug")
      .eq("id", invite.workspace_id)
      .single();

    if (workspaceError || !workspaceData) {
      return NextResponse.json(
        { success: false, error: "Data kluster workspace tidak ditemukan." },
        { status: 404 },
      );
    }

    // 2. Cek apakah wallet address ini sebenarnya sudah terdaftar
    const { data: existingMember } = await supabaseAdmin
      .from("workspace_members")
      .select("id, role")
      .eq("workspace_id", invite.workspace_id)
      .eq("wallet_address", walletAddress)
      .single();

    if (existingMember) {
      return NextResponse.json({
        success: true,
        workspaceId: invite.workspace_id,
        slug: workspaceData.slug,
        message: "Anda sudah tergabung.",
      });
    }

    // 3. Masukkan record member baru ke dalam database
    const { error: insertError } = await supabaseAdmin
      .from("workspace_members")
      .insert([
        {
          workspace_id: invite.workspace_id,
          wallet_address: walletAddress,
          role: invite.role || "member", // 🔥 PERBAIKAN: Gunakan role dari token (fallback: member)
          joined_at: new Date().toISOString(),
        },
      ]);

    if (insertError) throw insertError;

    // 🌟 INJEKSI LOGGER: Mencatat member baru yang bergabung
    await activityLogger.logMemberJoined({
      workspaceId: invite.workspace_id,
      memberWalletAddress: walletAddress,
      role: invite.role || "member",
    });

    return NextResponse.json({
      success: true,
      workspaceId: invite.workspace_id,
      slug: workspaceData.slug,
      message: "Berhasil bergabung ke workspace kolaboratif.",
    });
  } catch (error: any) {
    console.error("Join Workspace API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
