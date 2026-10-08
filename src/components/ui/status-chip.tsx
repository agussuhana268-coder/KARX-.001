import { cn } from "@/lib/cn";
import { StatusDot, type StatusTone } from "./status-dot";

const TEXT: Record<StatusTone, string> = {
  online: "text-accent",
  ready: "text-accent",
  standby: "text-cyan",
  offline: "text-muted",
  idle: "text-dim",
  warn: "text-warn",
  critical: "text-critical",
};

export function StatusChip({
  label,
  tone = "idle",
  className,
}: {
  label: string;
  tone?: StatusTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em]",
        TEXT[tone],
        className,
      )}
    >
      <StatusDot tone={tone} />
      {label}
    </span>
  );
}
