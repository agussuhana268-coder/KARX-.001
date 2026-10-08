"use client";

import { StatusDot } from "@/components/ui/status-dot";
import { useTrace } from "@/context/trace-context";

export function GeolocationCard() {
  const { status, intelligenceData } = useTrace();
  const data = intelligenceData;

  return (
    <div className="rounded border border-line bg-surface/80 p-4 sm:p-5 transition-colors hover:border-line-strong">
      <div className="flex items-center justify-between border-b border-line/60 pb-3">
        <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-2">
          <svg className="size-3.5 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          GEOLOCATION
        </h3>
        <span className="font-sans text-[10px] uppercase tracking-wider text-dim">
          {status === "COMPLETE" ? "GEOIP REAL-TIME" : "GEOIP TELEMETRY"}
        </span>
      </div>

      <div className="mt-4 space-y-4">
        {/* Country & Region */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="block font-sans text-[11px] text-muted">Country</span>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-sans text-sm font-semibold text-ink">
                {data?.geolocation.country || "—"}
              </span>
              <span className="rounded bg-cyan/10 px-1.5 py-0.5 font-mono text-[10px] text-cyan border border-cyan/25">
                {data?.geolocation.countryCode || "—"}
              </span>
            </div>
          </div>
          <div>
            <span className="block font-sans text-[11px] text-muted">Region</span>
            <span className="mt-1 block font-sans text-sm font-semibold text-ink">
              {data?.geolocation.region || "—"}
            </span>
          </div>
        </div>

        {/* City & Coordinates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="block font-sans text-[11px] text-muted">City</span>
            <span className="mt-1 block font-sans text-sm font-medium text-ink">
              {data?.geolocation.city || "—"}
            </span>
          </div>
          <div>
            <span className="block font-sans text-[11px] text-muted">Coordinates</span>
            <div className="mt-1 rounded bg-cyan/5 px-2.5 py-1 border border-cyan/25 inline-block">
              <span className="font-mono text-xs font-semibold text-cyan">
                {data?.geolocation.coordinatesFormatted || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Timezone & Postal/Continent */}
        <div className="grid grid-cols-2 gap-4 border-t border-line/40 pt-3">
          <div>
            <span className="block font-sans text-[11px] text-muted">Timezone</span>
            <span className="mt-1 block font-sans text-xs sm:text-sm font-medium text-ink truncate">
              {data?.geolocation.timezone
                ? `${data.geolocation.timezone}${data.geolocation.utcOffset ? ` (${data.geolocation.utcOffset})` : ""}`
                : "—"}
            </span>
          </div>
          <div>
            <span className="block font-sans text-[11px] text-muted">Postal / Continent</span>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-mono text-xs font-medium text-ink">
                {data?.geolocation.postalCode || "—"}
              </span>
              {data?.geolocation.continent && (
                <span className="rounded bg-surface px-1.5 py-0.5 font-sans text-[10px] text-muted border border-line">
                  {data.geolocation.continent}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NetworkCard() {
  const { intelligenceData } = useTrace();
  const data = intelligenceData;

  return (
    <div className="rounded border border-line bg-surface/80 p-4 sm:p-5 transition-colors hover:border-line-strong">
      <div className="flex items-center justify-between border-b border-line/60 pb-3">
        <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-2">
          <svg className="size-3.5 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" />
          </svg>
          NETWORK
        </h3>
        <span className="font-sans text-[10px] uppercase tracking-wider text-dim">
          ROUTING & BGP
        </span>
      </div>

      <div className="mt-4 space-y-4">
        {/* ASN & Organization */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="block font-sans text-[11px] text-muted">ASN</span>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-mono text-sm font-semibold text-accent">
                {data?.network.asn || "AS—"}
              </span>
              {data?.network.asName && (
                <span className="rounded bg-accent/10 px-1.5 py-0.5 font-mono text-[10px] text-accent border border-accent/25 truncate max-w-[120px]">
                  {data.network.asName}
                </span>
              )}
            </div>
          </div>
          <div>
            <span className="block font-sans text-[11px] text-muted">Organization</span>
            <span className="mt-1 block font-sans text-sm font-semibold text-ink truncate" title={data?.network.organization}>
              {data?.network.organization || "—"}
            </span>
          </div>
        </div>

        {/* ISP, Prefix & Reverse DNS */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <span className="block font-sans text-[11px] text-muted">ISP</span>
            <span className="mt-1 block font-sans text-xs sm:text-sm font-medium text-ink truncate" title={data?.network.isp}>
              {data?.network.isp || "—"}
            </span>
          </div>
          <div>
            <span className="block font-sans text-[11px] text-muted">Prefix</span>
            <span className="mt-1 inline-block rounded bg-cyan/5 px-2 py-0.5 font-mono text-xs text-cyan border border-cyan/25">
              {data?.network.prefix || "—"}
            </span>
          </div>
          <div>
            <span className="block font-sans text-[11px] text-muted">Reverse DNS</span>
            <span className="mt-1 block font-mono text-xs text-ink truncate" title={data?.network.reverseDns}>
              {data?.network.reverseDns || "None / Unassigned"}
            </span>
          </div>
        </div>

        {/* Network Type & Abuse Contact */}
        <div className="grid grid-cols-2 gap-4 border-t border-line/40 pt-3">
          <div>
            <span className="block font-sans text-[11px] text-muted">Network Type</span>
            <span className="mt-1 inline-block rounded bg-surface px-2 py-0.5 font-sans text-xs font-medium text-ink border border-line">
              {data?.network.networkType || "COMMERCIAL / RESIDENTIAL"}
            </span>
          </div>
          <div>
            <span className="block font-sans text-[11px] text-muted">Abuse Contact</span>
            <span className="mt-1 block font-mono text-xs text-dim italic truncate" title="Not provided by IP-API free tier">
              {data?.security.abuseContact || "Unspecified (Tier Limit)"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TargetAnalysisCard() {
  const { intelligenceData } = useTrace();
  const data = intelligenceData;

  const threat = data?.analysis.threatLevel || "NOMINAL";
  const threatTone = threat === "HIGH" ? "critical" : threat === "ELEVATED" ? "warn" : "ready";
  const threatColor =
    threat === "HIGH" ? "text-critical" : threat === "ELEVATED" ? "text-warn" : "text-accent";

  return (
    <div className="rounded border border-line bg-surface/80 p-4 sm:p-5 transition-colors hover:border-line-strong">
      <div className="flex items-center justify-between border-b border-line/60 pb-3">
        <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-2">
          <svg className="size-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          TARGET ANALYSIS
        </h3>
        <span className="font-sans text-[10px] uppercase tracking-wider text-dim">
          REPUTATION SCORE
        </span>
      </div>

      <div className="mt-4 space-y-4">
        {/* Threat Level & Risk Score */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="block font-sans text-[11px] text-muted">Threat Level</span>
            <div className="mt-1 flex items-center gap-2">
              <StatusDot tone={threatTone} />
              <span className={`font-sans text-sm font-semibold ${threatColor}`}>
                {threat}
              </span>
            </div>
          </div>
          <div>
            <span className="block font-sans text-[11px] text-muted">Risk Score</span>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-ink">
                {data?.analysis.riskScoreFormatted || "00 / 100"}
              </span>
              <span className="font-sans text-[10px] text-dim uppercase">
                ({threat === "HIGH" ? "Critical" : threat === "ELEVATED" ? "Elevated" : "Minimal"})
              </span>
            </div>
          </div>
        </div>

        {/* Classification & Reputation */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="block font-sans text-[11px] text-muted">Classification</span>
            <span className="mt-1 block font-sans text-xs sm:text-sm font-medium text-ink truncate">
              {data?.analysis.classification || "PUBLIC ANYCAST RESOLVER"}
            </span>
          </div>
          <div>
            <span className="block font-sans text-[11px] text-muted">Reputation</span>
            <span className={`mt-1 block font-sans text-xs sm:text-sm font-medium ${threatColor}`}>
              {data?.analysis.reputation || "VERIFIED BENIGN"}
            </span>
          </div>
        </div>

        {/* Real Provider Security & Network Indicators */}
        <div className="border-t border-line/40 pt-3">
          <span className="block font-sans text-[10px] uppercase tracking-wider text-muted mb-2">
            TELEMETRY INDICATORS
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="rounded bg-surface px-2.5 py-1.5 border border-line flex flex-col justify-between">
              <span className="font-sans text-[10px] text-dim">DATACENTER</span>
              <div className="mt-0.5 flex items-center gap-1.5 font-mono text-[11px]">
                <StatusDot tone={data?.analysis.isHosting ? "ready" : "idle"} />
                <span className={data?.analysis.isHosting ? "text-accent font-medium" : "text-muted"}>
                  {data?.analysis.isHosting ? "HOSTING" : "NO"}
                </span>
              </div>
            </div>

            <div className="rounded bg-surface px-2.5 py-1.5 border border-line flex flex-col justify-between">
              <span className="font-sans text-[10px] text-dim">PROXY / VPN</span>
              <div className="mt-0.5 flex items-center gap-1.5 font-mono text-[11px]">
                <StatusDot tone={data?.analysis.isProxy ? "warn" : "idle"} />
                <span className={data?.analysis.isProxy ? "text-warn font-medium" : "text-muted"}>
                  {data?.analysis.isProxy ? "DETECTED" : "NEGATIVE"}
                </span>
              </div>
            </div>

            <div className="rounded bg-surface px-2.5 py-1.5 border border-line flex flex-col justify-between">
              <span className="font-sans text-[10px] text-dim">TOR EXIT</span>
              <div className="mt-0.5 flex items-center gap-1.5 font-mono text-[11px]">
                <StatusDot tone={data?.analysis.isTor ? "critical" : "idle"} />
                <span className={data?.analysis.isTor ? "text-critical font-medium" : "text-muted"}>
                  {data?.analysis.isTor ? "ACTIVE" : "NEGATIVE"}
                </span>
              </div>
            </div>

            <div className="rounded bg-surface px-2.5 py-1.5 border border-line flex flex-col justify-between">
              <span className="font-sans text-[10px] text-dim">CELLULAR</span>
              <div className="mt-0.5 flex items-center gap-1.5 font-mono text-[11px]">
                <StatusDot tone={data?.analysis.isMobile ? "ready" : "idle"} />
                <span className={data?.analysis.isMobile ? "text-accent font-medium" : "text-muted"}>
                  {data?.analysis.isMobile ? "MOBILE" : "NEGATIVE"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
