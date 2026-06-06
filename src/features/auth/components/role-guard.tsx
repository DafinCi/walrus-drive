"use client";

import { useParams } from "next/navigation";
import { useCurrentRole } from "@/features/workspace/hooks/use-current-role";
import { WorkspacePermission } from "../types/auth.types";
import { hasPermission } from "../services/auth.service";

interface RoleGuardProps {
  permission: WorkspacePermission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  workspaceId?: string; // Menjadi sangat penting jika URL menggunakan slug
}

// Helper untuk validasi UUID
const isUUID = (str: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    str,
  );

export function RoleGuard({
  permission,
  children,
  fallback = null,
  workspaceId,
}: RoleGuardProps) {
  const params = useParams();
  const urlParam = (params.workspaceId as string) || (params.slug as string);

  // Prioritas 1: Gunakan props workspaceId yang dikirim secara eksplisit.
  // Prioritas 2: Gunakan URL parameter HANYA jika bentuknya adalah UUID (bukan slug).
  const activeWorkspaceId =
    workspaceId || (urlParam && isUUID(urlParam) ? urlParam : null);

  const { role, isLoading } = useCurrentRole(activeWorkspaceId as string);

  // Jika activeWorkspaceId kosong/invalid, jangan render untuk mencegah error 500
  if (!activeWorkspaceId) {
    console.warn("Invalid workspace ID. UUID required instead of slug.");
    return null;
  }

  if (isLoading) return null;

  if (!role || !hasPermission(role, permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
