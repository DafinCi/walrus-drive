import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/services/supabase/admin";
import { WorkspaceSortOption } from "@/features/workspace/store/workspace-store"; // 🌟 TAMBAHAN: Import type sort

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get("wallet");
  // 🌟 TAMBAHAN: Tangkap parameter sort dari URL, fallback ke 'newest'
  const sortParam =
    (searchParams.get("sort") as WorkspaceSortOption) || "newest";

  if (!wallet) {
    return NextResponse.json(
      { error: "Parameter 'wallet' diperlukan." },
      { status: 400 },
    );
  }

  try {
    // 1. Ambil list baris keanggotaan beserta data detail workspacenya
    const { data: memberships, error: memberError } = await supabaseAdmin
      .from("workspace_members")
      .select(
        `
        role,
        joined_at,
        workspaces (
          id,
          slug,
          name,
          owner_address,
          created_at
        )
        `,
      )
      .eq("wallet_address", wallet);

    if (memberError) throw memberError;
    if (!memberships || memberships.length === 0) {
      return NextResponse.json([]);
    }

    // 2. Hydrate data statistik (Total Files & Total Members) secara paralel per workspace
    const workspaceList = await Promise.all(
      memberships.map(async (item: any) => {
        const ws = item.workspaces;

        // Hitung total anggota di workspace ini
        const { count: memberCount } = await supabaseAdmin
          .from("workspace_members")
          .select("*", { count: "exact", head: true })
          .eq("workspace_id", ws.id);

        // Hitung total file di workspace ini
        const { count: fileCount } = await supabaseAdmin
          .from("files")
          .select("*", { count: "exact", head: true })
          .eq("workspace_id", ws.id);

        return {
          id: ws.id,
          slug: ws.slug,
          name: ws.name,
          ownerAddress: ws.owner_address,
          createdAt: ws.created_at,
          userRole: item.role,
          joinedAt: item.joined_at,
          totalMembers: memberCount || 0,
          totalFiles: fileCount || 0,
        };
      }),
    );

    // 🌟 TAMBAHAN 3: SERVER-SIDE SORTING ENGINE
    // Mengurutkan data di layer API sesuai dengan WORKSPACE_SORT_CONFIG
    workspaceList.sort((a, b) => {
      switch (sortParam) {
        case "newest":
          // Terbaru bergabung / dibuat (Berdasarkan tanggal terbaru ke terlama)
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        case "oldest":
          // Terlama bergabung / dibuat (Berdasarkan tanggal terlama ke terbaru)
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

        case "name_asc":
          // Nama A-Z
          return a.name.localeCompare(b.name);

        case "name_desc":
          // Nama Z-A
          return b.name.localeCompare(a.name);

        default:
          return 0;
      }
    });

    // Kirim hasil akhir yang sudah rapi dan tersortir murni ke React Frontend
    return NextResponse.json(workspaceList);
  } catch (error: any) {
    console.error("Error fetching workspace list:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
