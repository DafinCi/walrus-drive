"use client";

import { WorkspaceHubItem } from "../hooks/use-workspaces";
import { WorkspaceCard } from "./workspace-card";

interface WorkspaceListProps {
  items: WorkspaceHubItem[];
}

export function WorkspaceList({ items }: WorkspaceListProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider text-muted-foreground/80">
          Ruang Kerja Anda ({items.length})
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Pilih workspace untuk mulai mengelola berkas terdesentralisasi Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((workspace) => (
          <WorkspaceCard key={workspace.id} workspace={workspace} />
        ))}
      </div>
    </div>
  );
}
