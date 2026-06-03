import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/services/supabase/admin";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    const { searchParams } = new URL(request.url);

    const filter = searchParams.get("filter") || "all";
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    // 1. Ambil workspace_id berdasarkan slug (Memanfaatkan index idx_workspaces_slug)
    const { data: workspace, error: wsError } = await supabaseAdmin
      .from("workspaces")
      .select("id")
      .eq("slug", slug)
      .single();

    if (wsError || !workspace) {
      return NextResponse.json(
        { error: "Workspace tidak ditemukan" },
        { status: 404 },
      );
    }

    // 2. Bangun query flat langsung ke tabel activities (Tanpa Join Relasi yang putus)
    let query = supabaseAdmin
      .from("activities")
      .select(
        `
        id,
        workspace_id,
        action,
        entity_type,
        entity_id,
        metadata,
        actor_wallet_address,
        created_at
      `,
      )
      .eq("workspace_id", workspace.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    // 3. Terapkan Filter mapping berdasarkan kolom entity_type & action
    if (filter === "uploads") {
      query = query.eq("entity_type", "file").eq("action", "FILE_UPLOADED");
    } else if (filter === "verification") {
      query = query.eq("entity_type", "verification");
    } else if (filter === "members") {
      query = query.eq("entity_type", "member");
    }

    // 4. Terapkan Cursor Pagination (Memanfaatkan index idx_activities_workspace_created)
    if (cursor) {
      query = query.lt("created_at", cursor);
    }

    const { data: rawActivities, error: queryError } = await query;

    if (queryError) {
      console.error("Fetch Activities Error:", queryError);
      return NextResponse.json({ error: queryError.message }, { status: 500 });
    }

    // 5. Transformasi data rata (flat) dari DB ke format nested Object yang diminta UI Components
    const activities = (rawActivities || []).map((act: any) => ({
      id: act.id,
      workspaceId: act.workspace_id,
      type: act.action.toLowerCase(), // Mengubah 'FILE_UPLOADED' -> 'file_uploaded' agar singkron dengan Frontend Item Switcher
      createdAt: act.created_at,
      metadata: act.metadata,
      actor: {
        wallet: act.actor_wallet_address, // Diambil langsung dari kolom flat tabel
        name: undefined, // Kosong dulu, nanti tinggal dicolok tabel profiles jika ada
        avatarUrl: undefined,
      },
    }));

    // Tentukan nilai nextCursor berdasarkan record terakhir
    const nextCursor =
      activities.length === limit
        ? activities[activities.length - 1].createdAt
        : null;

    return NextResponse.json({
      data: activities,
      nextCursor,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// test
