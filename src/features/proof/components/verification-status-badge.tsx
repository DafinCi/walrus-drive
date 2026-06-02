"use client";

interface VerificationStatusBadgeProps {
  status?: "verified" | "pending" | "failed";
}

export function VerificationStatusBadge({
  status = "pending",
}: VerificationStatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();

  const config = {
    verified: {
      bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
      dot: "bg-emerald-400",
      label: "Verified",
      pulse: "",
    },
    failed: {
      bg: "bg-destructive/10 border-destructive/20 text-destructive",
      dot: "bg-destructive",
      label: "Failed",
      pulse: "",
    },
    pending: {
      bg: "bg-amber-500/10 border-amber-500/20 text-amber-400",
      dot: "bg-amber-400",
      label: "Pending",
      pulse: "animate-ping opacity-75",
    },
  }[normalizedStatus] || {
    bg: "bg-muted border-border text-muted-foreground",
    dot: "bg-muted-foreground",
    label: "Unknown",
    pulse: "",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 border text-[11px] font-semibold rounded-full select-none ${config.bg}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {config.pulse && (
          <span
            className={`absolute inline-flex h-full w-full rounded-full ${config.dot} ${config.pulse}`}
          />
        )}
        <span
          className={`relative inline-flex rounded-full h-1.5 w-1.5 ${config.dot}`}
        />
      </span>
      {config.label}
    </span>
  );
}
