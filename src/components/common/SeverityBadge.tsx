import type { Severity } from "@/data/mockData";

const severityConfig: Record<
  Severity,
  { label: string; className: string; dotClass: string }
> = {
  critical: {
    label: "Critical",
    className: "bg-critical/15 text-critical border-critical/20",
    dotClass: "bg-critical",
  },
  warning: {
    label: "Warning",
    className: "bg-warning/15 text-warning border-warning/20",
    dotClass: "bg-warning",
  },
  nit: {
    label: "Nit",
    className: "bg-nit/15 text-nit border-nit/20",
    dotClass: "bg-nit",
  },
};

interface SeverityBadgeProps {
  severity: Severity;
  showDot?: boolean;
  size?: "sm" | "md";
}

export default function SeverityBadge({
  severity,
  showDot = true,
  size = "sm",
}: SeverityBadgeProps) {
  const config = severityConfig[severity];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${config.className} ${
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
      }`}
    >
      {showDot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${config.dotClass} ${
            severity === "critical" ? "animate-glow-pulse" : ""
          }`}
        />
      )}
      {config.label}
    </span>
  );
}

// Small count badge for the reviews table
export function SeverityCount({
  severity,
  count,
}: {
  severity: Severity;
  count: number;
}) {
  if (count === 0) return null;
  const config = severityConfig[severity];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-mono text-[10px] font-medium px-1.5 py-0.5 ${config.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dotClass}`} />
      {count}
    </span>
  );
}
