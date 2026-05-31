import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/services/supabase/admin";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // 🌟 TAMBAHAN: Tangkap `role` (default: "member")
    const {
      workspaceId,
      createdBy,
      expiresInHours = 24,
      role = "member",
    } = body;

    if (!workspaceId || !createdBy) {
      return NextResponse.json(
        {
          success: false,
          error: "Workspace ID dan Wallet Pembuat wajib diisi.",
        },
        { status: 400 },
      );
    }

    // 🔥 SECURITY CHECK: Pastikan yang membuat invite adalah Owner atau Admin
    const { data: member, error: memberError } = await supabaseAdmin
      .from("workspace_members")
      .select("role")
      .eq("workspace_id", workspaceId)
      .eq("wallet_address", createdBy)
      .single();

    if (
      memberError ||
      !member ||
      (member.role !== "owner" && member.role !== "admin")
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Anda tidak memiliki izin untuk membuat tautan undangan.",
        },
        { status: 403 },
      );
    }

    // Generate Short Token
    const shortToken = crypto.randomBytes(6).toString("hex");

    // Hitung waktu expired
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);

    // Simpan ke database
    const { error: inviteError } = await supabaseAdmin
      .from("workspace_invites")
      .insert([
        {
          token: shortToken,
          workspace_id: workspaceId,
          created_by: createdBy,
          expires_at: expiresAt.toISOString(),
          role: role,
        },
      ]);

    if (inviteError) throw inviteError;

    return NextResponse.json({
      success: true,
      token: shortToken,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error: any) {
    console.error("Create Invite Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
