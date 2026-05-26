import { Users, File, Calendar, Shield } from "lucide-react";

export interface WorkspaceHeaderProps {
  workspaceName: string;
  totalFiles: number;
  totalMembers: number;
  userRole?: string; // e.g., "owner", "admin", "member"
  createdAt?: string | Date;
}

export function WorkspaceHeader({
  workspaceName,
  totalFiles,
  totalMembers,
  userRole = "member",
  createdAt,
}: WorkspaceHeaderProps) {
  // Helper untuk format tanggal sederhana tanpa library tambahan
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  // Helper untuk warna badge role agar dinamis sesuai level akses
  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "owner":
        return "bg-primary/20 text-primary border-primary/30";
      case "admin":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="flex flex-col gap-2 pb-6 mb-6 border-b border-border">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          {workspaceName}

          {/* Role Badge */}
          <span
            className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getRoleBadgeColor(
              userRole,
            )}`}
          >
            {userRole}
          </span>
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-1">
        {/* Total Files */}
        <div className="flex items-center gap-1.5">
          <File className="h-4 w-4 opacity-70" />
          <span>{totalFiles} File</span>
        </div>

        {/* Total Members */}
        <div className="flex items-center gap-1.5">
          <Users className="h-4 w-4 opacity-70" />
          <span>{totalMembers} Anggota</span>
        </div>

        {/* Created At (Optional) */}
        {formattedDate && (
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 opacity-70" />
            <span>Dibuat {formattedDate}</span>
          </div>
        )}

        {/* Access Level Indicator (Desktop only separator) */}
        <div className="flex items-center gap-1.5 ml-auto md:ml-0 md:pl-4 md:border-l border-border/50">
          <Shield className="h-4 w-4 opacity-70" />
          <span className="capitalize">{userRole} Access</span>
        </div>
      </div>
    </div>
  );
}
