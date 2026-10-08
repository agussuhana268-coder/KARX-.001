import { cn } from "@/lib/cn";

export type StatusTone =
  | "online"
  | "ready"
  | "standby"
  | "offline"
  | "idle"
  | "warn"
  | "critical";

const TONE: Record<StatusTone, string> = {
  online: "bg-accent shadow-[0_0_7px_rgba(57,255,136,0.6)]",
  ready: "bg-accent shadow-[0_0_5px_rgba(57,255,136,0.35)]",
  standby: "border border-cyan bg-cyan/30 shadow-[0_0_6px_rgba(0,217,255,0.35)]",
  offline: "border border-dim bg-transparent",
  idle: "border border-dim bg-transparent",
  warn: "bg-warn shadow-[0_0_6px_rgba(255,176,32,0.55)]",
  critical: "bg-critical shadow-[0_0_7px_rgba(255,59,92,0.65)]",
};

export function StatusDot({
  tone = "online",
  className,
}: {
  tone?: StatusTone;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block size-1.5 shrink-0 rounded-full",
        TONE[tone],
        className,
      )}
    />
  );
}
