import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/services/supabase/admin";

export async function GET(
  request: Request,
  // 🌟 PERBAIKAN: Ubah typing params menjadi Promise
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    // 🌟 Ekstrak dari Promise
    const { token } = await params;

    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("walletAddress");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "The specified token could not be found." },
        { status: 400 },
      );
    }

    // 1. Ambil data token undangan
    const { data: invite, error: inviteError } = await supabaseAdmin
      .from("workspace_invites")
      .select("*")
      .eq("token", token)
      .single();

    if (inviteError || !invite) {
      return NextResponse.json({
        success: true,
        invite: { valid: false, expired: false, role: null }, // 🌟 FIX: Tambahkan role
        workspace: null,
        membership: { alreadyMember: false, role: null },
      });
    }

    // 2. Cek apakah token sudah kedaluwarsa
    const isExpired =
      new Date(invite.expires_at).getTime() < new Date().getTime();

    if (isExpired) {
      return NextResponse.json({
        success: true,
        invite: { valid: true, expired: true, role: invite.role }, // 🌟 FIX: Tambahkan role
        workspace: null,
        membership: { alreadyMember: false, role: null },
      });
    }

    // 3. Ambil metadata singkat Workspace tujuan
    const { data: workspace, error: workspaceError } = await supabaseAdmin
      .from("workspaces")
      .select("id, name, owner_address, slug")
      .eq("id", invite.workspace_id)
      .single();

    if (workspaceError || !workspace) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The target workspace could not be found because it no longer exists.",
        },
        { status: 404 },
      );
    }

    // 4. Deteksi keanggotaan (jika dompet user terkoneksi)
    let alreadyMember = false;
    let memberRole = null;

    if (walletAddress) {
      const { data: member } = await supabaseAdmin
        .from("workspace_members")
        .select("role")
        .eq("workspace_id", invite.workspace_id)
        .eq("wallet_address", walletAddress)
        .single();

      if (member) {
        alreadyMember = true;
        memberRole = member.role;
      }
    }

    return NextResponse.json({
      success: true,
      invite: { valid: true, expired: false, role: invite.role }, // 🌟 FIX: Tambahkan role di sini
      workspace: {
        id: workspace.id,
        name: workspace.name,
        owner_address: workspace.owner_address,
        slug: workspace.slug,
      },
      membership: {
        alreadyMember,
        role: memberRole,
      },
    });
  } catch (error: any) {
    console.error("Validate Invite API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
