import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/services/supabase/admin";
import { FILE_SORT_CONFIG } from "@/features/workspace/constants/sort-config";
import { FileSortOption } from "@/features/workspace/store/workspace-store";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }, // 🌟 FIX 1: Ubah tipe data params menjadi Promise<{ slug: string }>
) {
  try {
    const { slug } = await params; // 🌟 FIX 2: Bongkar (unwrap) params menggunakan await
    const { searchParams } = new URL(request.url);

    // Ambil parameter sort, fallback ke 'newest'
    const sortParam = (searchParams.get("sort") as FileSortOption) || "newest";

    // Validasi apakah sortParam ada di Config, jika tidak, paksa ke 'newest'
    const sortConfig =
      FILE_SORT_CONFIG[sortParam] || FILE_SORT_CONFIG["newest"];

    // 1. Dapatkan workspace_id dari slug
    const { data: workspace, error: wsError } = await supabaseAdmin
      .from("workspaces")
      .select("id")
      .eq("slug", slug)
      .single();

    if (wsError || !workspace) {
      return NextResponse.json(
        { success: false, error: "Workspace tidak ditemukan" },
        { status: 404 },
      );
    }

    // 2. Tarik file dengan perintah order dinamis
    const { data: files, error: filesError } = await supabaseAdmin
      .from("files")
      .select("*")
      .eq("workspace_id", workspace.id)
      .order(sortConfig.column, { ascending: sortConfig.ascending });

    if (filesError) throw filesError;

    return NextResponse.json({ success: true, files: files || [] });
  } catch (error: any) {
    console.error("Fetch Files API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
