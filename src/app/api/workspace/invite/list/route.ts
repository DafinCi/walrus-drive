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

    const nowIso = new Date().toISOString();

    // Query ke database Supabase dengan filter anti-zombie (expires_at > sekarang)
    const { data: invites, error } = await supabaseAdmin
      .from("workspace_invites")
      .select("*")
      .eq("workspace_id", workspaceId)
      .gt("expires_at", nowIso) // Mengeliminasi data kedaluwarsa dari query level
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, invites: invites || [] });
  } catch (error: any) {
    console.error("Fetch Invites API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
