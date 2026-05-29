// src/app/api/workspace/check-slug/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/services/supabase/admin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug")?.trim().toLowerCase();

    if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        { available: false, error: "Format slug tidak valid" },
        { status: 400 },
      );
    }

    // Periksa apakah slug sudah terdaftar di database
    const { data, error } = await supabaseAdmin
      .from("workspaces")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;

    // Jika data tidak ditemukan, berarti slug tersedia (available = true)
    return NextResponse.json({ available: !data });
  } catch (error: any) {
    console.error("⛔ Slug Check Error:", error);
    return NextResponse.json(
      { available: false, error: "Gagal memvalidasi slug" },
      { status: 500 },
    );
  }
}
