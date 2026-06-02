import { FileCard } from "./file-card";
import { WorkspaceFile } from "@/features/workspace/types/workspace.types";

export interface WorkspaceGridProps {
  files: WorkspaceFile[];
  onVerifyClick: (file: WorkspaceFile) => void; // 🌟 TAMBAHAN PROPS
}

export function WorkspaceGrid({ files, onVerifyClick }: WorkspaceGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-in fade-in-50 duration-200">
      {files?.map((file) => (
        // 🌟 DI-OPER LANGSUNG KE FILE CARD
        <FileCard key={file.id} file={file} onVerifyClick={onVerifyClick} />
      ))}
    </div>
  );
}
