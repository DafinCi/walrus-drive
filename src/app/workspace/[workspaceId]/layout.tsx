import Link from "next/link";
import { LayoutDashboard, Settings, ShieldCheck } from "lucide-react";
import { QueryClientProvider } from "@tanstack/react-query";

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { workspaceId: string };
}) {
  const { workspaceId } = await params;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-950 text-white">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 border-r border-gray-800 bg-gray-900/50 p-6 flex flex-col space-y-6">
        <div className="font-bold text-xl tracking-wider text-blue-500">
          Walrus Drive
        </div>
        <nav className="flex flex-col space-y-2">
          <Link
            href={`/workspace/${workspaceId}`}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition"
          >
            <LayoutDashboard className="w-5 h-5 text-gray-400" />
            <span>Dashboard</span>
          </Link>
          <Link
            href={`/workspace/${workspaceId}/verify`}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition"
          >
            <ShieldCheck className="w-5 h-5 text-gray-400" />
            <span>Verify Proof</span>
          </Link>
          <Link
            href={`/workspace/${workspaceId}/settings`}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition"
          >
            <Settings className="w-5 h-5 text-gray-400" />
            <span>Settings</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full relative">{children}</main>
    </div>
  );
}
