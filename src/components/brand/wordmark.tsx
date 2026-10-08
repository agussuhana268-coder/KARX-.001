import { cn } from "@/lib/cn";

/**
 * Typographic wordmark.
 * Visible brand name MUST be exactly: KARX/.001
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-baseline leading-none select-none tracking-tight", className)}>
      <span className="font-sans font-bold tracking-[0.14em] text-ink">
        KARX
      </span>
      <span className="font-sans font-bold text-accent drop-shadow-[0_0_6px_rgba(57,255,136,0.4)]">
        /
      </span>
      <span className="font-mono font-medium tracking-tight text-muted">.001</span>
    </span>
  );
}
