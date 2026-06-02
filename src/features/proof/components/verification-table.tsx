"use client";

import { useState, useMemo } from "react";
import { WorkspaceFile } from "@/features/workspace/types/workspace.types";
import { VerificationStatusBadge } from "./verification-status-badge";
import {
  FileText,
  Search,
  ArrowUpDown,
  MoreVertical,
  ExternalLink,
  RefreshCw,
  Copy,
  Check,
  Inbox,
} from "lucide-react";

// Dropdown UI primitive sederhana yang kompatibel dengan Tailwind Tailwind
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VerificationTableProps {
  files: WorkspaceFile[];
  onReVerify?: (file: WorkspaceFile) => void;
  onViewProof?: (file: WorkspaceFile) => void;
}

export function VerificationTable({
  files,
  onReVerify,
  onViewProof,
}: VerificationTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<
    "newest" | "oldest" | "verified" | "pending" | "failed"
  >("newest");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // UTILS INTERNAL: Memperpendek Address Wallet & Hash Kripto
  const formatAddress = (addr: string) => {
    if (!addr) return "—";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  // UTILS INTERNAL: Format Waktu Relatif Ringkas (Context-Aware 2026)
  const formatRelativeTime = (dateString?: string | null) => {
    if (!dateString) return "—";
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays === 1) return "Kemarin";
    if (diffDays < 7) return `${diffDays} hari lalu`;

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // HANDLER: Fungsi copy hash aman
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ENGINE MATANG: Gabungan Pencarian & Pengurutan via useMemo (Anti-Lag Memory)
  const processedFiles = useMemo(() => {
    let result = [...files];

    // 1. Eksekusi Filter Pencarian
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.file_name.toLowerCase().includes(query) ||
          f.wallet_address.toLowerCase().includes(query),
      );
    }

    // 2. Eksekusi Aturan Sortir
    result.sort((a, b) => {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();

      switch (sortOption) {
        case "oldest":
          return timeA - timeB;
        case "verified":
          return (
            (b.status === "verified" ? 1 : 0) -
            (a.status === "verified" ? 1 : 0)
          );
        case "pending":
          return (
            (b.status === "pending" || !b.status ? 1 : 0) -
            (a.status === "pending" || !a.status ? 1 : 0)
          );
        case "failed":
          return (
            (b.status === "failed" ? 1 : 0) - (a.status === "failed" ? 1 : 0)
          );
        case "newest":
        default:
          return timeB - timeA;
      }
    });

    return result;
  }, [files, searchQuery, sortOption]);

  // EMPTY STATE INTERNAL TABLE
  if (files.length === 0) {
    return (
      <div className="p-12 border border-dashed border-border/60 bg-card/20 rounded-sm text-center flex flex-col items-center justify-center space-y-3 animate-in fade-in duration-300">
        <div className="p-3 bg-muted border border-border/40 rounded-full text-muted-foreground/60">
          <Inbox className="h-6 w-6 stroke-[1.5]" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-foreground">
            Riwayat Verifikasi Kosong
          </h4>
          <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
            Belum ada berkas terdaftar di ruang kerja ini. Unggah berkas pertama
            Anda untuk mulai mengunci jejak kepatuhan on-chain.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in-50 duration-300">
      {/* TOOLBAR SEARCH & SORTING */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari nama berkas atau uploader..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card/40 border border-border/50 rounded-sm py-1.5 pl-9 pr-4 text-xs placeholder:text-muted-foreground text-foreground focus:outline-hidden focus:border-primary/60 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">
            Urutkan:
          </span>
          <div className="relative w-full sm:w-40">
            <select
              aria-label="Urutkan berkas"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="w-full bg-card/40 border border-border/50 rounded-sm py-1.5 px-3 text-xs text-foreground focus:outline-hidden focus:border-primary/60 cursor-pointer appearance-none"
            >
              <option value="newest" className="bg-background">
                Terbaru Mendaftar
              </option>
              <option value="oldest" className="bg-background">
                Terlama Mendaftar
              </option>
              <option value="verified" className="bg-background">
                Status: Verified First
              </option>
              <option value="pending" className="bg-background">
                Status: Pending First
              </option>
              <option value="failed" className="bg-background">
                Status: Failed First
              </option>
            </select>
            <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* CORE AUDIT LOG TABLE */}
      <div className="border border-border/40 rounded-sm bg-card/20 overflow-x-auto shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/40 bg-muted/30 text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none">
              <th className="py-3 px-4 font-semibold">Nama Berkas</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Uploaded By</th>
              <th className="py-3 px-4 font-semibold">Uploaded</th>
              <th className="py-3 px-4 font-semibold">Verified At</th>
              <th className="py-3 px-4 font-semibold">Checkpoint</th>
              <th className="py-3 px-3 text-center font-semibold w-12">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30 text-xs font-normal">
            {processedFiles.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-8 text-center text-xs text-muted-foreground font-medium"
                >
                  Tidak ada berkas yang cocok dengan filter pencarian.
                </td>
              </tr>
            ) : (
              processedFiles.map((file) => (
                <tr
                  key={file.id}
                  className="hover:bg-muted/10 transition-colors group"
                >
                  {/* KOLOM 1: FILE NAME WITH ICON */}
                  <td className="py-3 px-4 font-medium text-foreground max-w-xs truncate">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground/80 shrink-0" />
                      <span className="truncate" title={file.file_name}>
                        {file.file_name}
                      </span>
                    </div>
                  </td>

                  {/* KOLOM 2: STATUS BADGE */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <VerificationStatusBadge status={file.status} />
                  </td>

                  {/* KOLOM 3: UPLOADER ADDRESS */}
                  <td className="py-3 px-4 font-mono text-muted-foreground text-[11px] whitespace-nowrap">
                    {formatAddress(file.wallet_address)}
                  </td>

                  {/* KOLOM 4: RELATIVE TIME CREATED */}
                  <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                    {formatRelativeTime(file.created_at)}
                  </td>

                  {/* KOLOM 5: RELATIVE TIME VERIFIED */}
                  <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                    {file.status?.toLowerCase() === "verified"
                      ? formatRelativeTime(file.verified_at)
                      : "—"}
                  </td>

                  {/* KOLOM 6: SUI EPOCH/CHECKPOINT HASH */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {file.checkpoint ? (
                      <span className="font-mono bg-muted border border-border/40 text-[10px] px-1.5 py-0.5 rounded-sm text-foreground font-bold">
                        #{file.checkpoint}
                      </span>
                    ) : file.status?.toLowerCase() === "failed" ? (
                      <span className="text-destructive text-[11px] font-medium">
                        Validation Break
                      </span>
                    ) : (
                      <span className="text-muted-foreground/60 text-[11px] italic">
                        Awaiting Epoch
                      </span>
                    )}
                  </td>

                  {/* KOLOM 7: ACTION DROPDOWN MENU */}
                  <td className="py-2 px-3 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-1 hover:bg-muted rounded-xs border border-transparent hover:border-border/50 text-muted-foreground hover:text-foreground transition-all">
                        <MoreVertical className="h-3.5 w-3.5" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-36 bg-card border border-border/60 text-xs shadow-lg"
                      >
                        <DropdownMenuItem
                          onClick={() => onViewProof?.(file)}
                          className="flex items-center gap-2 cursor-pointer focus:bg-muted"
                        >
                          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                          View Proof
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => onReVerify?.(file)}
                          className="flex items-center gap-2 cursor-pointer focus:bg-muted"
                        >
                          <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
                          Re-Verify
                        </DropdownMenuItem>

                        {file.certify_tx_digest && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleCopy(file.certify_tx_digest!, file.id)
                            }
                            className="flex items-center gap-2 cursor-pointer focus:bg-muted font-medium text-blue-400 focus:text-blue-400"
                          >
                            {copiedId === file.id ? (
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                            Copy Cert Tx
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 🌟 SKELETON ROWS COMPONENT FOR TABLE LOADING
export function VerificationTableSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex justify-between items-center gap-4">
        <div className="h-8 w-64 bg-muted rounded-sm" />
        <div className="h-8 w-32 bg-muted rounded-sm" />
      </div>
      <div className="border border-border/40 rounded-sm bg-muted/10 overflow-hidden">
        <div className="h-9 bg-muted/40 border-b border-border/40" />
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-12 border-b border-border/20 flex items-center px-4 justify-between"
          >
            <div className="h-3 w-1/4 bg-muted/60 rounded-xs" />
            <div className="h-5 w-16 bg-muted/60 rounded-full" />
            <div className="h-3 w-20 bg-muted/40 rounded-xs" />
            <div className="h-3 w-16 bg-muted/40 rounded-xs" />
          </div>
        ))}
      </div>
    </div>
  );
}
