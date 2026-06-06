import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/services/supabase/admin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json(
        { success: false, error: "Missing required parameter: Workspace ID." },
        { status: 400 },
      );
    }

    // Ambil daftar member diurutkan dari yang paling senior (Owner)
    const { data: members, error } = await supabaseAdmin
      .from("workspace_members")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("joined_at", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, members });
  } catch (error: any) {
    console.error("Get Workspace Members Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
