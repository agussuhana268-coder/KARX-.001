"use client";

import { StatusDot } from "@/components/ui/status-dot";
import { useTrace } from "@/context/trace-context";
import { cn } from "@/lib/cn";

export function SystemTerminal({ className }: { className?: string }) {
  const { status, terminalLines } = useTrace();

  return (
    <div
      className={cn(
        "rounded border border-line bg-surface/90 flex flex-col overflow-hidden shadow-sm transition-colors",
        status === "ERROR" && "border-warn/40",
        status === "SCANNING" && "border-cyan/30",
        className,
      )}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-line/60 px-4 py-2.5 bg-surface">
        <div className="flex items-center gap-2">
          <svg
            className={cn(
              "size-3",
              status === "ERROR"
                ? "text-warn"
                : status === "SCANNING"
                  ? "text-cyan"
                  : "text-accent",
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 3-3 3m4.5 0h6" />
          </svg>
          <h3 className="font-sans text-xs font-semibold tracking-wider uppercase text-muted">
            TRACE TERMINAL
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <StatusDot
            tone={
              status === "ERROR"
                ? "warn"
                : status === "SCANNING"
                  ? "standby"
                  : "ready"
            }
          />
          <span className="font-mono text-[10px] uppercase text-dim">
            {status === "SCANNING"
              ? "ACTIVE STREAM"
              : status === "COMPLETE"
                ? "STREAM COMPLETE"
                : status === "ERROR"
                  ? "TRACE HALTED"
                  : "LOG STREAM"}
          </span>
        </div>
      </div>

      {/* Terminal log content */}
      <div className="p-3.5 bg-[#050608]/95 font-mono text-[12px] leading-relaxed text-muted space-y-1 select-none min-h-[148px]">
        {terminalLines.map((line, index) => {
          const isLast = index === terminalLines.length - 1;
          return (
            <div key={line.id} className="flex items-baseline gap-2">
              <span
                className={cn(
                  "font-bold select-none",
                  line.tone === "warn"
                    ? "text-warn"
                    : line.tone === "critical"
                      ? "text-critical"
                      : "text-accent",
                )}
              >
                &gt;
              </span>

              <span>
                {line.text}
                {line.highlight && (
                  <span className="text-cyan font-semibold">{line.highlight}</span>
                )}
              </span>

              {isLast && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "inline-block w-1.5 h-3.5 animate-blink align-middle",
                    status === "ERROR" ? "bg-warn" : "bg-accent",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
