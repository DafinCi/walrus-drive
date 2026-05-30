import { WorkspaceNavbar } from "./workspace-navbar";
import { WorkspaceSidebar } from "./workspace-sidebar";
import { UploadQueue } from "@/features/upload/components/upload-queue";

interface WorkspaceShellProps {
  children: React.ReactNode;
}

export function WorkspaceShell({ children }: WorkspaceShellProps) {
  return (
    // 🌟 FIX 1: Ubah min-h-screen menjadi h-screen, dan KUNCI scroll dengan overflow-hidden
    <div className="h-screen flex flex-col bg-background text-foreground font-sans overflow-hidden">
      {/* 1. Atap Global (Persistent) */}
      <WorkspaceNavbar />

      {/* 2. Tubuh Aplikasi */}
      {/* 🌟 FIX 2: Hapus h-[calc(100vh-4rem)]. Cukup pakai flex-1 overflow-hidden. Flexbox akan otomatis mengisi sisa ruang secara akurat! */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Navigasi */}
        <div className="hidden md:block">
          <WorkspaceSidebar />
        </div>

        {/* 3. Area Konten Utama (Scrollable secara independen) */}
        {/* 🌟 FIX 3: Tambahkan class custom-scrollbar di sini */}
        <main className="flex-1 w-full relative bg-background overflow-y-auto custom-scrollbar">
          {/* Ubah min-h-full menjadi h-fit agar tidak memaksakan tinggi saat konten sedikit */}
          <div className="w-full h-fit">{children}</div>
        </main>
      </div>

      {/* 4. Global Overlays */}
      <UploadQueue />
    </div>
  );
}
