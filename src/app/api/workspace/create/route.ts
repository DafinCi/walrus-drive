import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/services/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, ownerAddress } = body;

    if (!name || !ownerAddress) {
      return NextResponse.json(
        {
          success: false,
          error: "Nama workspace dan alamat wallet wajib diisi.",
        },
        { status: 400 },
      );
    }

    // 1. Insert ke tabel workspaces
    const { data: workspace, error: wsError } = await supabaseAdmin
      .from("workspaces")
      .insert([{ name, owner_address: ownerAddress }])
      .select()
      .single();

    if (wsError) throw wsError;

    // 2. Otomatis daftarkan pembuat sebagai 'owner' di workspace_members
    const { error: memberError } = await supabaseAdmin
      .from("workspace_members")
      .insert([
        {
          workspace_id: workspace.id,
          wallet_address: ownerAddress,
          role: "owner",
        },
      ]);

    if (memberError) {
      // Rollback data workspace jika pendaftaran member gagal (mencegah data yatim)
      await supabaseAdmin.from("workspaces").delete().eq("id", workspace.id);
      throw memberError;
    }

    return NextResponse.json({ success: true, workspaceId: workspace.id });
  } catch (error: any) {
    console.error("Create Workspace Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
