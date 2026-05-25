import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/services/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, walletAddress } = body;

    if (!token || !walletAddress) {
      return NextResponse.json(
        { success: false, error: "Token dan Wallet Address wajib diisi." },
        { status: 400 },
      );
    }

    // 1. Ambil data invite berdasarkan token
    const { data: invite, error: inviteError } = await supabaseAdmin
      .from("workspace_invites")
      .select("workspace_id, expires_at")
      .eq("token", token)
      .single();

    if (inviteError || !invite) {
      return NextResponse.json(
        {
          success: false,
          error: "Tautan undangan tidak valid atau sudah dihapus.",
        },
        { status: 404 },
      );
    }

    // 2. Cek apakah token sudah expired
    const isExpired = new Date(invite.expires_at) < new Date();
    if (isExpired) {
      return NextResponse.json(
        { success: false, error: "Tautan undangan telah kedaluwarsa." },
        { status: 410 }, // HTTP Gone
      );
    }

    // 3. Cek apakah user SUDAH BERGABUNG (Idempotency Check)
    const { data: existingMember } = await supabaseAdmin
      .from("workspace_members")
      .select("id")
      .eq("workspace_id", invite.workspace_id)
      .eq("wallet_address", walletAddress)
      .maybeSingle();

    if (existingMember) {
      return NextResponse.json({
        success: true,
        message: "Anda sudah menjadi anggota di workspace ini.",
        workspaceId: invite.workspace_id,
      });
    }

    // 4. Masukkan user sebagai 'member' baru
    const { error: joinError } = await supabaseAdmin
      .from("workspace_members")
      .insert([
        {
          workspace_id: invite.workspace_id,
          wallet_address: walletAddress,
          role: "member",
        },
      ]);

    if (joinError) throw joinError;

    return NextResponse.json({
      success: true,
      message: "Berhasil bergabung ke workspace!",
      workspaceId: invite.workspace_id,
    });
  } catch (error: any) {
    console.error("Join Workspace Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
