import { WorkspaceRole } from "../types/member.types";

/**
 * Menentukan apakah seorang aktor boleh mempromosikan target menjadi Admin
 */
export function canPromote(
  actorRole: WorkspaceRole,
  targetRole: WorkspaceRole,
): boolean {
  if (actorRole !== "owner") return false; // Hanya owner mutlak yang bisa menunjuk admin
  if (targetRole === "owner") return false; // Tidak bisa mempromosikan owner
  if (targetRole === "admin") return false; // Sudah jadi admin
  return true;
}

/**
 * Menentukan apakah seorang aktor boleh menendang target dari Workspace
 */
export function canRemove(
  actorRole: WorkspaceRole,
  targetRole: WorkspaceRole,
  isSelf: boolean,
): boolean {
  if (isSelf) return false; // MVP: Block self-remove (Leave Workspace flow terpisah)
  if (targetRole === "owner") return false; // Owner tidak bisa dihapus oleh siapapun

  if (actorRole === "owner") return true; // Owner bebas hapus admin atau member
  if (actorRole === "admin" && targetRole === "member") return true; // Admin hanya bisa hapus member biasa

  return false; // Member biasa atau Admin mencoba hapus sesama Admin akan di-reject
}
