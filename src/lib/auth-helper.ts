import { supabaseAdmin } from "@/services/supabase/admin"; // Menggunakan service_role

interface AccessControlRequest {
  walletAddress: string;
  workspaceSlug: string;
  allowedRoles: ("owner" | "admin" | "member")[];
}

export async function assertWorkspaceRole({
  walletAddress,
  workspaceSlug,
  allowedRoles,
}: AccessControlRequest) {
  // 1. Ambil data keanggotaan berdasarkan slug workspace dan wallet address
  const { data: member, error } = await supabaseAdmin
    .from("workspace_members")
    .select("role, workspace_id, workspaces!inner(slug)")
    .eq("wallet_address", walletAddress)
    .eq("workspaces.slug", workspaceSlug)
    .single();

  if (error || !member) {
    throw new Error("403: Forbidden. Anda bukan anggota dari workspace ini.");
  }

  // 2. Validasi apakah role member saat ini diizinkan untuk melakukan aksi
  const hasAccess = allowedRoles.includes(member.role as any);
  if (!hasAccess) {
    throw new Error("403: Forbidden. Tingkat izin Anda tidak mencukupi.");
  }

  return {
    workspaceId: member.workspace_id,
    role: member.role,
  };
}
