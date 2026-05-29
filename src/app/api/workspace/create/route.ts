import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/services/supabase/admin";
import { createWorkspaceSchema } from "@/features/workspace/validations/create-workspace-schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ownerAddress, ...formData } = body;

    // 1. Validasi Alamat Wallet (Wajib ada untuk konteks Web3 platform)
    if (!ownerAddress) {
      return NextResponse.json(
        {
          success: false,
          error: "Alamat wallet pembuat (ownerAddress) wajib disertakan.",
        },
        { status: 400 },
      );
    }
    // 2. Jalankan Validasi Sisi Server menggunakan Single Source Zod Schema
    const validationResult = createWorkspaceSchema.safeParse(formData);

    if (!validationResult.success) {
      // Ganti .errors menjadi .issues agar TypeScript aman dan tidak ngambek lagi
      const firstError =
        validationResult.error.issues[0]?.message || "Payload data tidak valid";
      return NextResponse.json(
        { success: false, error: firstError },
        { status: 400 },
      );
    }

    const { name, slug, description, visibility, upload_policy } =
      validationResult.data;

    // 3. Otomatisasi Avatar URL menggunakan platform DiceBear berbasis Seed Slug
    // Ini memangkas kebutuhan sistem storage upload gambar di fase MVP SaaS
    const generatedAvatarUrl = `https://api.dicebear.com/9.x/identicon/svg?seed=${slug}`;

    // 4. Operasi Database Tahap 1: Menyisipkan Kontainer Workspace Baru
    const { data: workspace, error: wsError } = await supabaseAdmin
      .from("workspaces")
      .insert([
        {
          name,
          slug,
          description: description || null,
          avatar_url: generatedAvatarUrl,
          owner_address: ownerAddress,
          is_public: visibility === "public",
          upload_policy: upload_policy,
        },
      ])
      .select()
      .single();

    if (wsError) {
      // Deteksi error PostgreSQL Code 23505 (Unique Violation untuk Slug)
      if (wsError.code === "23505") {
        return NextResponse.json(
          {
            success: false,
            error:
              "Slug sudah digunakan oleh organisasi lain. Silakan pilih nama/slug lain.",
          },
          { status: 409 },
        );
      }
      throw wsError;
    }

    // 5. Operasi Database Tahap 2: Otomatis Daftarkan Wallet Pembuat sebagai Role 'owner'
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
      // PENYELAMAT DATA (Rollback Manusiawi): Hapus baris workspace yatim jika pendaftaran member gagal
      await supabaseAdmin.from("workspaces").delete().eq("id", workspace.id);

      throw memberError;
    }

    // 6. Return Data Sukses Lengkap (Mengirimkan slug untuk kebutuhan routing frontend)
    return NextResponse.json({
      success: true,
      workspaceId: workspace.id,
      slug: workspace.slug,
    });
  } catch (error: any) {
    console.error("⛔ [CRITICAL] Create Workspace API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Terjadi kegagalan internal pada server.",
      },
      { status: 500 },
    );
  }
}
