import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { AuthGuard } from "@/features/auth/components/auth-guard";

export default function WorkspaceGlobalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WorkspaceShell>
      <AuthGuard>{children}</AuthGuard>
    </WorkspaceShell>
  );
}
