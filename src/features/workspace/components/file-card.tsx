import { useState } from "react";
// 🌟 TAMBAHAN: Import useParams untuk mengambil slug dari URL
import {
  FileText,
  ImageIcon,
  Video,
  AudioLines,
  Code2,
  FileArchive,
  File as FileIcon,
  MoreVertical,
  Copy,
  Eye,
  Download,
  ShieldCheck,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WorkspaceFile } from "@/features/workspace/types/workspace.types";

interface FileCardProps {
  file: WorkspaceFile;
  onVerifyClick: (file: WorkspaceFile) => void;
}

export function FileCard({ file, onVerifyClick }: FileCardProps) {
  const [copied, setCopied] = useState(false);

  // Ekstrak properti dengan toleransi snake_case maupun camelCase
  const safeMimeType = file.mime_type || (file as any).mimeType || "";
  const safeBlobId = file.blob_id || (file as any).blobId || "";
  const safeFileName =
    file.file_name || (file as any).fileName || "Unnamed File";
  const safeFileSize = file.file_size || (file as any).fileSize || 0;
  const safeWallet = file.wallet_address || (file as any).walletAddress || "";

  // 1. Helper untuk memilih ikon berdasarkan MIME Type berkas
  const getFileIcon = (mimeType: string) => {
    const type = mimeType.toLowerCase();
    if (type.startsWith("image/"))
      return <ImageIcon className="h-8 w-8 text-blue-400" />;
    if (type.startsWith("video/"))
      return <Video className="h-8 w-8 text-purple-400" />;
    if (type.startsWith("audio/"))
      return <AudioLines className="h-8 w-8 text-amber-400" />;
    if (
      type.includes("javascript") ||
      type.includes("json") ||
      type.includes("html") ||
      type.includes("css")
    ) {
      return <Code2 className="h-8 w-8 text-emerald-400" />;
    }
    if (
      type.includes("pdf") ||
      type.includes("word") ||
      type.includes("text/")
    ) {
      return <FileText className="h-8 w-8 text-rose-400" />;
    }
    if (type.includes("zip") || type.includes("rar") || type.includes("tar")) {
      return <FileArchive className="h-8 w-8 text-orange-400" />;
    }
    return <FileIcon className="h-8 w-8 text-muted-foreground" />;
  };

  // 2. Helper untuk format ukuran berkas
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // 3. Helper untuk menyederhanakan alamat wallet uploader (0x1234...abcd)
  const formatAddress = (addr: string) => {
    if (!addr) return "Unknown";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  // 4. Aksi menyalin Blob ID ke Clipboard
  const handleCopyBlobId = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!safeBlobId) return;
    try {
      await navigator.clipboard.writeText(safeBlobId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin Blob ID", err);
    }
  };

  // 🌟 FUNGSI FETCH MANUAL & ALERT DIHAPUS. KITA PAKAI `verifyProof` DARI HOOK!

  const aggregatorUrl = `https://aggregator.walrus-testnet.walrus.space/v1/blobs/${safeBlobId}`;

  return (
    <div className="group relative border border-border bg-card/40 hover:bg-muted/30 hover:border-border/80 rounded-[6px] p-4 flex flex-col justify-between gap-4 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5">
      {/* BAGIAN ATAS: Ikon & Aksi Utama Dropdown */}
      <div className="flex items-start justify-between w-full">
        <div className="p-2.5 bg-muted/60 border border-border/50 rounded-[6px] group-hover:bg-background transition-colors">
          {getFileIcon(safeMimeType)}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Menu berkas</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={handleCopyBlobId}
              disabled={!safeBlobId}
              className="gap-2 cursor-pointer text-sm"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span>{copied ? "Tersalin!" : "Salin Blob ID"}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              disabled={!safeBlobId}
              className="gap-2 cursor-pointer text-sm"
            >
              <a href={aggregatorUrl} target="_blank" rel="noreferrer">
                <Eye className="h-3.5 w-3.5" />
                <span>Buka di Explorer</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              disabled={!safeBlobId}
              className="gap-2 cursor-pointer text-sm"
            >
              <a
                href={`${aggregatorUrl}?download=true`}
                download={safeFileName}
              >
                <Download className="h-3.5 w-3.5" />
                <span>Unduh File</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                // 🌟 PANGGIL FUNGSI PEMBUKA MODAL PUSAT DI SINI
                onVerifyClick(file);
              }}
              className="gap-2 text-primary focus:text-primary cursor-pointer text-sm font-medium"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>
                {file.status === "verified"
                  ? "Lihat Hasil Proof"
                  : "Verifikasi Proof"}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* BAGIAN TENGAH: Nama File & Metadata Dasar */}
      <div className="flex flex-col gap-1 w-full min-w-0">
        <h3
          className="font-semibold text-foreground text-sm tracking-tight truncate group-hover:text-primary transition-colors"
          title={safeFileName}
        >
          {safeFileName}
        </h3>
        <span
          className="text-[11px] text-muted-foreground font-mono truncate"
          title={safeBlobId}
        >
          Blob:{" "}
          {safeBlobId && safeBlobId.length > 12
            ? `${safeBlobId.substring(0, 12)}...`
            : safeBlobId || "N/A"}
        </span>
      </div>

      {/* BAGIAN BAWAH: Ukuran, Tanggal & Uploader */}
      <div className="pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground w-full">
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-foreground/80">
            {formatBytes(safeFileSize)}
          </span>
          <span>By {formatAddress(safeWallet)}</span>
        </div>
        <span className="text-right whitespace-nowrap">
          {file.created_at
            ? new Date(file.created_at).toLocaleDateString("id-ID", {
                month: "short",
                day: "numeric",
              })
            : "N/A"}
        </span>
      </div>
    </div>
  );
}
