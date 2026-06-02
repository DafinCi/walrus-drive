"use client";

import { useState } from "react"; // 🌟 State controller diangkat ke parent
import { WorkspaceNavbar } from "./workspace-navbar";
import { WorkspaceSidebar } from "./workspace-sidebar";
import { UploadQueue } from "@/features/upload/components/upload-queue";

interface WorkspaceShellProps {
  children: React.ReactNode;
}

export function WorkspaceShell({ children }: WorkspaceShellProps) {
  // State global untuk mengontrol buka-tutup sidebar
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="h-screen flex flex-col bg-background text-foreground font-sans overflow-hidden">
      {/* 1. Persistent Global Navbar Header */}
      <WorkspaceNavbar />

      {/* 2. Core App Body Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Responsive Desktop Sidebar (Managed via state) */}
        <div className="hidden md:block h-full shrink-0">
          <WorkspaceSidebar
            isCollapsed={isSidebarCollapsed}
            onToggle={handleToggleSidebar}
          />
        </div>

        {/* 3. Independent Scrollable Main Content Container */}
        <main className="flex-1 w-full relative bg-background overflow-y-auto custom-scrollbar transition-all duration-300">
          <div className="w-full h-fit">{children}</div>
        </main>
      </div>

      {/* 4. Global Overlay Components */}
      <UploadQueue />
    </div>
  );
}
