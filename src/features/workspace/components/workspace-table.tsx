import { FileRow } from "./file-row";
import { WorkspaceFile } from "./file-card";

export interface WorkspaceTableProps {
  files: WorkspaceFile[];
}

export function WorkspaceTable({ files }: WorkspaceTableProps) {
  return (
    <div className="w-full overflow-x-auto border border-border/60 rounded-sm bg-card/10 backdrop-blur-xs shadow-md animate-in fade-in-50 duration-200">
      <table className="w-full text-left border-collapse min-w-[600px]">
        {/* Kepala Tabel */}
        <thead>
          <tr className="border-b border-border bg-muted/40 text-xs font-bold uppercase tracking-wider text-muted-foreground select-none">
            <th className="py-3 px-4 font-semibold">Nama File</th>
            <th className="py-3 px-4 font-semibold w-28">Ukuran</th>
            <th className="py-3 px-4 font-semibold w-32">Pengunggah</th>
            <th className="py-3 px-4 font-semibold w-36">Tanggal</th>
            <th className="py-3 px-4 font-semibold w-16 text-right">Aksi</th>
          </tr>
        </thead>

        {/* Badan Tabel */}
        <tbody className="divide-y divide-border/20">
          {files.map((file) => (
            <FileRow key={file.id} file={file} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
