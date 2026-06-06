"use client";

import { useState } from "react";
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

interface FileRowProps {
  file: WorkspaceFile;
  onVerifyClick: (file: WorkspaceFile) => void; // 🌟 TAMBAHAN: Menerima fungsi trigger dari parent table
}

export function FileRow({ file, onVerifyClick }: FileRowProps) {
  const [copied, setCopied] = useState(false);

  // 1. Helper untuk memilih ikon berdasarkan MIME Type
  const getFileIcon = (mime_type: string) => {
    const type = mime_type.toLowerCase();
    if (type.startsWith("image/"))
      return <ImageIcon className="h-4 w-4 text-blue-400" />;
    if (type.startsWith("video/"))
      return <Video className="h-4 w-4 text-purple-400" />;
    if (type.startsWith("audio/"))
      return <AudioLines className="h-4 w-4 text-amber-400" />;
    if (
      type.includes("javascript") ||
      type.includes("json") ||
      type.includes("html") ||
      type.includes("css")
    ) {
      return <Code2 className="h-4 w-4 text-emerald-400" />;
    }
    if (
      type.includes("pdf") ||
      type.includes("word") ||
      type.includes("text/")
    ) {
      return <FileText className="h-4 w-4 text-rose-400" />;
    }
    if (type.includes("zip") || type.includes("rar") || type.includes("tar")) {
      return <FileArchive className="h-4 w-4 text-orange-400" />;
    }
    return <FileIcon className="h-4 w-4 text-muted-foreground" />;
  };

  // 2. Helper untuk format ukuran berkas
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // 3. Helper untuk short address wallet
  const formatAddress = (addr: string) => {
    if (!addr) return "Unknown";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  // 4. Salin Blob ID
  const handleCopyBlobId = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(file.blob_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy Blob ID.", err);
    }
  };

  const aggregatorUrl = `https://aggregator.walrus-testnet.walrus.space/v1/blobs/${file.blob_id}`;

  return (
    <tr className="group border-b border-border/40 hover:bg-muted/30 transition-colors align-middle">
      {/* KOLOM 1: Nama File & Ikon */}
      <td className="py-3 px-4 font-medium text-foreground max-w-xs md:max-w-md">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-1.5 bg-muted/60 border border-border/50 rounded-[6px] group-hover:bg-background transition-colors flex-shrink-0">
            {getFileIcon(file.mime_type)}
          </div>
          <div className="flex flex-col min-w-0">
            <span
              className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors"
              title={file.file_name}
            >
              {file.file_name}
            </span>
            <span
              className="text-[11px] text-muted-foreground font-mono truncate max-w-[180px] sm:max-w-xs"
              title={file.blob_id}
            >
              Blob: {file.blob_id}
            </span>
          </div>
        </div>
      </td>

      {/* KOLOM 2: Ukuran File */}
      <td className="py-3 px-4 text-sm text-muted-foreground whitespace-nowrap">
        {formatBytes(file.file_size)}
      </td>

      {/* KOLOM 3: Uploader (Wallet Address) */}
      <td
        className="py-3 px-4 text-sm text-muted-foreground font-mono whitespace-nowrap"
        title={file.wallet_address}
      >
        {formatAddress(file.wallet_address)}
      </td>

      {/* KOLOM 4: Tanggal Upload */}
      <td className="py-3 px-4 text-sm text-muted-foreground whitespace-nowrap">
        {new Date(file.created_at).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </td>

      {/* KOLOM 5: Tombol Aksi Dropdown */}
      <td className="py-3 px-4 text-right whitespace-nowrap">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">File menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={handleCopyBlobId}
              className="gap-2 cursor-pointer text-sm"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span>{copied ? "Tersalin!" : "Copy Blob ID"}</span>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="gap-2 cursor-pointer text-sm">
              <a
                href={`https://walruscan.com/testnet/blob/${file.blob_id}`}
                target="_blank"
                rel="noreferrer"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Open in Explorer</span>
              </a>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="gap-2 cursor-pointer text-sm">
              <a
                href={`${aggregatorUrl}?download=true`}
                download={file.file_name}
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download File</span>
              </a>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* 🌟 AKTIVASI FITUR VERIFIKASI SEBENARNYA */}
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                onVerifyClick(file); // Membuka modal audit pusat
              }}
              className="gap-2 text-primary focus:text-primary cursor-pointer text-sm font-medium"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>
                {file.status === "verified" ? "Detail" : "Verify Proof"}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
