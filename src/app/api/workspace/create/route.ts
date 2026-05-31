import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/services/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      visibility, // Menerima "public" | "private" dari frontend
      upload_policy,
      ownerAddress,
    } = body;

    if (!name || !slug || !visibility || !upload_policy || !ownerAddress) {
      return NextResponse.json(
        { success: false, error: "Data payload tidak lengkap." },
        { status: 400 },
      );
    }

    const { data: existingWorkspace } = await supabaseAdmin
      .from("workspaces")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existingWorkspace) {
      return NextResponse.json(
        {
          success: false,
          error: "Slug sudah digunakan. Silakan pilih yang lain.",
        },
        { status: 400 },
      );
    }

    // 3. Insert ke dalam tabel Workspaces
    const { data: newWorkspace, error: workspaceError } = await supabaseAdmin
      .from("workspaces")
      .insert([
        {
          name,
          slug,
          description: description || null,
          is_public: visibility === "public", // 🔥 FIX: Terjemahkan string menjadi BOOLEAN untuk kolom is_public
          upload_policy,
          owner_address: ownerAddress,
        },
      ])
      .select("id, slug")
      .single();

    if (workspaceError || !newWorkspace) {
      console.error("Supabase Insert Workspace Error:", workspaceError);
      return NextResponse.json(
        { success: false, error: "Gagal menyimpan data kluster workspace." },
        { status: 500 },
      );
    }

    // 4. Daftarkan pembuat sebagai 'Owner'
    const { error: memberError } = await supabaseAdmin
      .from("workspace_members")
      .insert([
        {
          workspace_id: newWorkspace.id,
          wallet_address: ownerAddress,
          role: "owner",
        },
      ]);

    if (memberError) {
      console.error("Supabase Insert Member Error:", memberError);
      return NextResponse.json(
        {
          success: false,
          error:
            "Workspace terbuat, tetapi gagal mengonfigurasi hak akses owner.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      workspaceId: newWorkspace.id,
      slug: newWorkspace.slug,
    });
  } catch (error: any) {
    console.error("Create Workspace API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
