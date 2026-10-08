"use client";

import { StatusDot } from "@/components/ui/status-dot";
import { useTrace } from "@/context/trace-context";

export function PrimaryTargetCard() {
  const { status, targetIP, ipVersion, intelligenceData } = useTrace();
  const data = intelligenceData;

  const threat = data?.analysis.threatLevel || "NOMINAL";
  const riskLabel = threat === "NOMINAL" ? "LOW" : threat === "ELEVATED" ? "MED" : "HIGH";
  const riskTone = threat === "HIGH" ? "critical" : threat === "ELEVATED" ? "warn" : "ready";
  const riskClass =
    threat === "HIGH"
      ? "bg-critical/10 text-critical border-critical/25"
      : threat === "ELEVATED"
        ? "bg-warn/10 text-warn border-warn/25"
        : "bg-accent/10 text-accent border-accent/25";

  return (
    <div className="relative rounded border border-line bg-surface/90 p-4 sm:p-5 transition-colors hover:border-line-strong shadow-sm overflow-hidden">
      {/* Subtle green/cyan top telemetry accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent/70 via-cyan/40 to-transparent" />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-line/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="font-sans text-[11px] font-semibold tracking-wider uppercase text-muted">
            PRIMARY TARGET
          </span>
          <span className="text-dim">•</span>
          <span className="font-sans text-[11px] text-dim">
            {status === "COMPLETE"
              ? "LIVE INTELLIGENCE DOSSIER (REAL-TIME)"
              : "INTELLIGENCE DOSSIER (STANDBY)"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded bg-bg px-2.5 py-1 font-mono text-xs text-ink border border-line font-medium">
            {ipVersion === "ipv6" ? "PUBLIC IPv6 / ANYCAST" : "PUBLIC IPv4 / ANYCAST"}
          </span>
          <span className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 font-sans text-xs border font-medium ${riskClass}`}>
            <StatusDot tone={riskTone} />
            Risk: {riskLabel}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded bg-cyan/10 px-2.5 py-1 font-sans text-xs text-cyan border border-cyan/25 font-medium">
            <StatusDot
              tone={
                status === "COMPLETE"
                  ? "online"
                  : status === "SCANNING"
                    ? "standby"
                    : status === "ERROR"
                      ? "warn"
                      : "ready"
              }
            />
            {status === "COMPLETE"
              ? "Status: ANALYZED"
              : status === "SCANNING"
                ? "Status: SCANNING"
                : status === "ERROR"
                  ? "Status: REJECTED"
                  : "Status: READY"}
          </span>
        </div>
      </div>

      <div className="mt-3.5 flex flex-col md:flex-row md:items-baseline justify-between gap-3">
        <div>
          <span className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-ink block">
            {targetIP}
          </span>
          <span className="font-sans text-xs text-muted mt-0.5 block">
            Target Host Infrastructure ({data?.network.organization || "Autonomous Routing Node"})
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs font-sans text-muted">
          <div>
            <span className="text-dim">Autonomous System: </span>
            <span className="font-mono font-medium text-accent">
              {data?.network.asn || "AS—"}
              {data?.network.asName ? ` (${data.network.asName})` : ""}
            </span>
          </div>
          <div>
            <span className="text-dim">Jurisdiction: </span>
            <span className="font-medium text-ink">
              {data?.geolocation.country || "—"} ({data?.geolocation.countryCode || "—"})
            </span>
          </div>
          <div>
            <span className="text-dim">Coordinates: </span>
            <span className="font-mono font-medium text-cyan">
              {data?.geolocation.coordinatesFormatted || "—"}
            </span>
          </div>
          {data?.geolocation.timezone && (
            <div>
              <span className="text-dim">Timezone: </span>
              <span className="font-mono font-medium text-ink">
                {data.geolocation.timezone}
                {data.geolocation.utcOffset ? ` [${data.geolocation.utcOffset}]` : ""}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
