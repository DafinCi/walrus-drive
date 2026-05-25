import { WorkspaceNavbar } from "@/components/layout/workspace-navbar";
import Link from "next/link";
import { LayoutDashboard, Settings, ShieldCheck } from "lucide-react";

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>; // Next.js 15 Async Params fix
}) {
  const { workspaceId } = await params;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* 1. Persistent Global App Shell Navbar */}
      <WorkspaceNavbar />

      <div className="flex-1 flex flex-col md:flex-row">
        {/* 2. Sidebar Navigation Layer */}
        <aside className="w-full md:w-64 border-r border-border bg-card p-6 flex flex-col space-y-6 shrink-0">
          <nav className="flex flex-col space-y-1">
            <Link
              href={`/workspace/${workspaceId}`}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors font-medium text-sm"
            >
              <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
              <span>Dashboard</span>
            </Link>
            <Link
              href={`/workspace/${workspaceId}/verify`}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors font-medium text-sm"
            >
              <ShieldCheck className="w-4 h-4 text-muted-foreground" />
              <span>Verify Proof</span>
            </Link>
            <Link
              href={`/workspace/${workspaceId}/settings`}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors font-medium text-sm"
            >
              <Settings className="w-4 h-4 text-muted-foreground" />
              <span>Settings</span>
            </Link>
          </nav>
        </aside>

        {/* 3. Dynamic Page Content Wrapper */}
        <main className="flex-1 w-full relative bg-background">{children}</main>
      </div>
    </div>
  );
}
