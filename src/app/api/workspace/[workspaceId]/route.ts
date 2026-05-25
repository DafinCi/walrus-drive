import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/services/supabase/admin";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ workspaceId: string }> },
) {
  try {
    const { workspaceId } = await params;

    if (!workspaceId) {
      return NextResponse.json(
        { success: false, error: "Workspace ID diperlukan" },
        { status: 400 },
      );
    }

    // 1. Fetch Workspace Metadata
    const { data: workspace, error: wsError } = await supabaseAdmin
      .from("workspaces")
      .select("*")
      .eq("id", workspaceId)
      .maybeSingle();

    if (wsError) throw wsError;
    if (!workspace) {
      return NextResponse.json(
        { success: false, error: "Workspace tidak ditemukan" },
        { status: 404 },
      );
    }

    // 2. Fetch Files di dalam Workspace (Urutan terbaru di atas)
    const { data: files, error: filesError } = await supabaseAdmin
      .from("files")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false });

    if (filesError) throw filesError;

    // 3. Fetch Members di dalam Workspace
    const { data: members, error: membersError } = await supabaseAdmin
      .from("workspace_members")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("joined_at", { ascending: true });

    if (membersError) throw membersError;

    return NextResponse.json({
      success: true,
      data: {
        workspace,
        files,
        members,
      },
    });
  } catch (error: any) {
    console.error("Fetch Workspace Full Data Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
