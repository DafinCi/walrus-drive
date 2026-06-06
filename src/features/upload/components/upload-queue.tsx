"use client";

import { useState } from "react";
import { useUploadQueue } from "../hooks/use-upload-queue";
import { UploadProgress } from "./upload-progress";
import { ChevronDown, ChevronUp, Layers, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UploadQueue() {
  const { uploads, activeUploads, hasActiveUploads, clearCompleted } =
    useUploadQueue();
  const [isExpanded, setIsExpanded] = useState(true);

  // Jika tidak ada aktivitas upload sama sekali, sembunyikan seluruh widget dari layar
  if (uploads.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-card border border-border rounded-[6px] shadow-2xl z-60 overflow-hidden flex flex-col transition-all duration-300">
      {/* Header Widget */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-3 bg-muted/60 border-b border-border flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          <Layers
            className={`h-4 w-4 ${hasActiveUploads ? "text-primary animate-pulse" : "text-muted-foreground"}`}
          />
          <span className="text-xs font-semibold text-foreground">
            {hasActiveUploads
              ? `Upload (${activeUploads.length} file...)`
              : "Upload complete"}
          </span>
        </div>

        <div
          className="flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          {!hasActiveUploads && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-destructive cursor-pointer"
              onClick={clearCompleted}
              title="Successfully cleared history"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Item List Box (Tersembunyi jika di-minimize) */}
      {isExpanded && (
        <div className="max-h-72 overflow-y-auto p-3 space-y-2.5 bg-background/50 custom-scrollbar">
          {uploads.map((item) => (
            <UploadProgress key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
