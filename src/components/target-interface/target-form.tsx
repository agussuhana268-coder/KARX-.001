"use client";

import { useId, type ChangeEvent, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import { useTrace } from "@/context/trace-context";
import { StatusDot } from "@/components/ui/status-dot";

export function TargetForm() {
  const uid = useId();
  const inputId = `${uid}-target-input`;

  const {
    status,
    inputIP,
    setInputIP,
    startTrace,
    ipVersion,
    errorMessage,
  } = useTrace();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setInputIP(event.target.value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTrace(inputIP);
  }

  const isScanning = status === "SCANNING";

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full">
      {/* Target input console bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <label
            htmlFor={inputId}
            className="font-sans text-[11px] font-semibold uppercase tracking-wider text-muted flex items-center gap-2"
          >
            <StatusDot tone={status === "ERROR" ? "warn" : isScanning ? "standby" : "ready"} />
            TARGET IP
          </label>
          <span className="font-mono text-[10px] uppercase tracking-wider text-dim">
            IPv4 / IPv6 BUFFER
          </span>
        </div>

        {/* Query Input & Action Button */}
        <div
          className={cn(
            "relative flex flex-col sm:flex-row items-stretch rounded border transition-all duration-200 overflow-hidden",
            status === "ERROR"
              ? "border-warn/80 bg-elevated/95 ring-1 ring-warn/30"
              : isScanning
                ? "border-cyan/60 bg-elevated/90 ring-1 ring-cyan/20 shadow-[0_0_16px_rgba(0,217,255,0.1)]"
                : "border-line-strong bg-elevated/90 focus-within:border-accent/60 focus-within:shadow-[0_0_16px_rgba(57,255,136,0.12)]",
          )}
        >
          {/* Leading prompt prefix */}
          <div className="hidden sm:flex items-center pl-4 pr-1 text-accent/60 select-none font-mono text-xs">
            <span className={cn("font-bold", isScanning ? "text-cyan" : "text-accent")}>&gt;</span>
            <span className="ml-1 text-dim">target:</span>
          </div>

          <input
            id={inputId}
            name="target"
            type="text"
            value={inputIP}
            onChange={handleChange}
            disabled={isScanning}
            placeholder="8.8.8.8"
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            inputMode="text"
            className={cn(
              "h-12 sm:h-13 w-full min-w-0 bg-transparent px-4 font-mono text-base sm:text-lg font-medium tracking-wide text-ink caret-accent outline-none placeholder:text-dim transition-opacity",
              isScanning && "opacity-75 cursor-not-allowed select-none",
            )}
          />

          <button
            type="submit"
            disabled={isScanning}
            className={cn(
              "group h-11 sm:h-auto sm:w-36 shrink-0 font-sans text-xs font-bold uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 px-6 border-t sm:border-t-0 sm:border-l",
              isScanning
                ? "bg-[#0B1713] text-cyan border-cyan/40 cursor-not-allowed opacity-80"
                : status === "ERROR"
                  ? "bg-[#0E0B0A] hover:bg-[#16100E] active:bg-[#0E0B0A] text-warn border-warn/40 hover:border-warn/70 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-warn"
                  : "bg-[#080D0C] hover:bg-[#0B1412] active:bg-[#080D0C] text-accent hover:text-accent-bright border-accent/30 hover:border-accent/60 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:shadow-[0_0_12px_rgba(57,255,136,0.35)]",
            )}
          >
            <span>{isScanning ? "TRACING" : "TRACE"}</span>
            {isScanning ? (
              <span className="inline-block size-2 rounded-full bg-cyan animate-ping" />
            ) : (
              <svg
                className="size-3.5 transition-transform group-hover:translate-x-0.5 text-current"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            )}
          </button>
        </div>

        {/* Target telemetry sub-row */}
        <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2.5 font-sans text-[11px] text-muted">
            <span className="inline-flex items-center gap-1.5 rounded bg-surface px-2 py-0.5 font-mono text-[10px] text-ink border border-line">
              {ipVersion === "ipv6" ? "PUBLIC IPv6" : "PUBLIC IPv4"}
            </span>
            <span className="text-dim">•</span>

            {status === "SCANNING" ? (
              <span className="text-cyan font-medium flex items-center gap-1.5">
                <StatusDot tone="standby" />
                TRACE IN PROGRESS
              </span>
            ) : status === "COMPLETE" ? (
              <span className="text-accent font-medium flex items-center gap-1.5">
                <StatusDot tone="online" />
                TARGET ANALYZED
              </span>
            ) : status === "ERROR" ? (
              <span className="text-warn font-medium flex items-center gap-1.5">
                <StatusDot tone="warn" />
                VALIDATION REJECTED
              </span>
            ) : (
              <span className="text-accent font-medium flex items-center gap-1.5">
                <StatusDot tone="ready" />
                READY FOR ANALYSIS
              </span>
            )}
          </div>

          <p
            role="status"
            aria-live="polite"
            className={cn(
              "font-sans text-[11px] transition-colors",
              status === "ERROR"
                ? "text-warn font-medium"
                : status === "SCANNING"
                  ? "text-cyan font-medium"
                  : status === "COMPLETE"
                    ? "text-accent font-medium"
                    : "text-dim",
            )}
          >
            {status === "ERROR"
              ? errorMessage
              : status === "SCANNING"
                ? "Executing route reconnaissance across autonomous systems..."
                : status === "COMPLETE"
                  ? "Analysis profile assembled. Target telemetry synchronized."
                  : "Target accepted. Trace engine is on standby."}
          </p>
        </div>
      </div>
    </form>
  );
}
