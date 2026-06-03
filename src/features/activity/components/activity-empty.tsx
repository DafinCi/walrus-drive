"use client";

import { Inbox } from "lucide-react";

interface ActivityEmptyProps {
  filter: string;
}

export function ActivityEmpty({ filter }: ActivityEmptyProps) {
  const messages = {
    all: "No activities logged yet. Upload files or invite team members to begin auditing this space.",
    uploads: "No file transfers or uploads found matching this sub-category.",
    verification:
      "No cryptographic proofs have been secured via Tatum on Sui network yet.",
    members:
      "No identity, invitation, or membership changes have occurred in this workspace.",
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border/80 rounded-[6px] bg-muted/10 text-center my-4 animate-in fade-in duration-200">
      <div className="p-3 bg-muted/40 text-muted-foreground rounded-full mb-3">
        <Inbox className="w-5 h-5 stroke-[1.5]" />
      </div>
      <h3 className="text-xs font-bold text-foreground uppercase tracking-wider font-heading">
        Timeline Cleared
      </h3>
      <p className="text-xs text-muted-foreground max-w-xs mt-1 leading-relaxed">
        {messages[filter as keyof typeof messages] || messages.all}
      </p>
    </div>
  );
}
