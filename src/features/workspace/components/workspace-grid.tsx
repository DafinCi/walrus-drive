import { FileCard, WorkspaceFile } from "./file-card";

export interface WorkspaceGridProps {
  files: WorkspaceFile[];
}

export function WorkspaceGrid({ files }: WorkspaceGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-in fade-in-50 duration-200">
      {files.map((file) => (
        <FileCard key={file.id} file={file} />
      ))}
    </div>
  );
}
