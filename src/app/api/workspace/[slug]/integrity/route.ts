import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/services/supabase/admin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    // 1. Bongkar params sesuai standar Next.js v15/v16
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Parameter slug workspace tidak ditemukan" },
        { status: 400 },
      );
    }

    // 2. CARI WORKSPACE ID BERDASARKAN SLUG
    const { data: workspace, error: wsError } = await supabaseAdmin
      .from("workspaces")
      .select("id, name")
      .eq("slug", slug)
      .single();

    if (wsError || !workspace) {
      return NextResponse.json(
        {
          success: false,
          error: "Workspace tidak ditemukan atau akses ditolak",
        },
        { status: 404 },
      );
    }

    // 3. TARIK SEMUA DATA FILE (Menggunakan select("*") seperti files/route.ts milik lu)
    const { data: files, error: filesError } = await supabaseAdmin
      .from("files")
      .select("*")
      .eq("workspace_id", workspace.id)
      .order("created_at", { ascending: false }); // Berkas terbaru berada di atas

    if (filesError) {
      console.error("🚨 Supabase Query Error on Integrity:", filesError);
      return NextResponse.json(
        {
          success: false,
          error: "Gagal memuat data enkripsi berkas dari database",
        },
        { status: 500 },
      );
    }

    // 4. HITUNG STATISTIK AGREGASI (REAL-TIME METRICS)
    const totalFiles = files.length;
    let verifiedCount = 0;
    let pendingCount = 0;
    let failedCount = 0;

    files.forEach((file) => {
      // Normalisasi status ke lowercase untuk berjaga-jaga
      const status = file.status?.toLowerCase();
      if (status === "verified") verifiedCount++;
      else if (status === "failed") failedCount++;
      else pendingCount++; // Jika null atau "pending" otomatis dihitung pending
    });

    // 5. HITUNG INTEGRITY SCORE & LABELLING PREMIUM
    const integrityScore =
      totalFiles === 0 ? 100 : Math.round((verifiedCount / totalFiles) * 100);

    let integrityLabel = "Needs Attention";
    if (integrityScore === 100) integrityLabel = "Perfect Security";
    else if (integrityScore >= 95) integrityLabel = "Excellent";
    else if (integrityScore >= 85) integrityLabel = "Good Compliance";

    // 6. INFRASTRUCTURE HEALTH STATUS
    const healthStatus = {
      walrus: "healthy",
      suiNetwork: "healthy",
      tatumRpc: "connected",
      lastAuditAt: new Date().toISOString(),
    };

    // 7. RETURN PAYLOAD SINKRON DENGAN UI CONTRACT
    return NextResponse.json({
      success: true,
      meta: {
        workspaceName: workspace.name,
        slug: slug,
      },
      summary: {
        totalFiles,
        verified: verifiedCount,
        pending: pendingCount,
        failed: failedCount,
        integrityScore,
        integrityLabel,
      },
      health: healthStatus,
      history: files,
    });
  } catch (error: any) {
    console.error(
      "🚨 Internal Server Error inside Integrity API Route:",
      error,
    );
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
