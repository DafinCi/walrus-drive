import { WorkspaceNavbar } from "./workspace-navbar";
import { WorkspaceSidebar } from "./workspace-sidebar";
import { UploadQueue } from "@/features/upload/components/upload-queue";

interface WorkspaceShellProps {
  children: React.ReactNode;
}

export function WorkspaceShell({ children }: WorkspaceShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      {/* 1. Atap Global (Persistent) */}
      <WorkspaceNavbar />

      {/* 2. Tubuh Aplikasi */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden h-[calc(100vh-4rem)]">
        {/* Sidebar Navigasi */}
        {/* Note: Di mobile defaultnya disembunyikan (hidden), kalau mau dibikin drawer bisa nanti */}
        <div className="hidden md:block">
          <WorkspaceSidebar />
        </div>

        {/* 3. Area Konten Utama (Scrollable secara independen) */}
        <main className="flex-1 w-full relative bg-background overflow-y-auto">
          <div className="w-full min-h-full">{children}</div>
        </main>
      </div>

      {/* 4. Global Overlays (Melayang di atas semua halaman) */}
      <UploadQueue />
    </div>
  );
}
