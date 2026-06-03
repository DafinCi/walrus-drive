"use client";

import { useState } from "react";
import { WorkspaceNavbar } from "./workspace-navbar";
import { WorkspaceSidebar } from "./workspace-sidebar";
import { ActivityPanel } from "@/features/activity/components/activity-panel"; // 🌟 Import Panel Baru
import { UploadQueue } from "@/features/upload/components/upload-queue";

interface WorkspaceShellProps {
  children: React.ReactNode;
}

export function WorkspaceShell({ children }: WorkspaceShellProps) {
  // State global untuk mengontrol buka-tutup sidebar kiri
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="h-screen flex flex-col bg-background text-foreground font-sans overflow-hidden">
      {/* 1. Persistent Global Navbar Header */}
      <WorkspaceNavbar />

      {/* 2. Core App Body Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Responsive Desktop Sidebar */}
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

        {/* 🌟 4. Right Side Enterprise Activity Panel */}
        <ActivityPanel />
      </div>

      {/* 5. Global Overlay Components */}
      <UploadQueue />
    </div>
  );
}
