"use client";

import { Loader2, Users2 } from "lucide-react";
import { useWorkspaceMembers } from "@/features/workspace/hooks/use-workspace-members";
import {
  WorkspaceMemberWithMeta,
  WorkspaceRole,
} from "@/features/workspace/types/member.types";
import { MemberRow } from "./member-row";

interface MemberListProps {
  workspaceId: string;
  currentUserAddress?: string;
}

export function MemberList({
  workspaceId,
  currentUserAddress,
}: MemberListProps) {
  const { data: rawMembers = [], isLoading } = useWorkspaceMembers(workspaceId);

  // Cari peran (role) dari user yang sedang login sekarang untuk memvalidasi otorisasi
  const currentMemberObj = rawMembers.find(
    (m) => m.wallet_address === currentUserAddress,
  );
  const currentUserRole: WorkspaceRole = currentMemberObj?.role || "member";

  // Suntik flag meta 'isCurrentUser' ke dalam array data
  const membersWithMeta: WorkspaceMemberWithMeta[] = rawMembers.map(
    (member) => ({
      ...member,
      isCurrentUser: member.wallet_address === currentUserAddress,
    }),
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2">
        <Loader2 className="h-5 w-5 text-primary animate-spin" />
        <span className="text-xs text-muted-foreground">
          Menghubungkan kluster repositori tim...
        </span>
      </div>
    );
  }

  if (membersWithMeta.length === 0) {
    return (
      <div className="text-center py-10 border border-dashed border-border rounded-sm bg-muted/10">
        <Users2 className="mx-auto h-6 w-6 text-muted-foreground/60 mb-2" />
        <p className="text-xs text-muted-foreground">
          Tidak ada anggota yang terdaftar.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[340px] overflow-y-auto pr-0.5 scrollbar-thin">
      <div className="flex justify-between items-center select-none pb-1">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Daftar Kolaborator Aktif ({membersWithMeta.length})
        </h4>
      </div>
      <div className="space-y-1.5">
        {membersWithMeta.map((member) => (
          <MemberRow
            key={member.id}
            member={member}
            currentUserRole={currentUserRole}
            workspaceId={workspaceId}
          />
        ))}
      </div>
    </div>
  );
}
