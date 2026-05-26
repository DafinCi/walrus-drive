import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/services/supabase/admin";

export async function GET(
  request: Request,
  { params }: { params: { token: string } },
) {
  try {
    const { token } = params;
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("walletAddress");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token tidak ditemukan." },
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
        invite: { valid: false, expired: false },
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
        invite: { valid: true, expired: true },
        workspace: null,
        membership: { alreadyMember: false, role: null },
      });
    }

    // 3. Ambil metadata singkat Workspace tujuan
    const { data: workspace, error: workspaceError } = await supabaseAdmin
      .from("workspaces")
      .select("id, name, owner_address")
      .eq("id", invite.workspace_id)
      .single();

    if (workspaceError || !workspace) {
      return NextResponse.json(
        { success: false, error: "Workspace target sudah tidak eksis lagi." },
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
      invite: { valid: true, expired: false },
      workspace: {
        id: workspace.id,
        name: workspace.name,
        owner_address: workspace.owner_address,
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
