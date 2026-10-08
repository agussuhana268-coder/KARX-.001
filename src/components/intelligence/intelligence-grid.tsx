"use client";

import { useTrace } from "@/context/trace-context";
import { GeolocationCard, NetworkCard, TargetAnalysisCard } from "./intel-panel";

export function IntelligenceGrid() {
  const { status } = useTrace();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-line/40 pb-2">
        <h2 className="font-sans text-xs font-semibold tracking-wider uppercase text-muted">
          INTELLIGENCE DOSSIER
        </h2>
        <span className="font-sans text-[11px] text-dim">
          {status === "COMPLETE"
            ? "REAL-TIME TELEMETRY • LIVE ADAPTER ACTIVE"
            : status === "SCANNING"
              ? "STREAMING TELEMETRY • RECON IN PROGRESS"
              : status === "ERROR"
                ? "TELEMETRY SUSPENDED • ERROR"
                : "REAL-TIME TELEMETRY • LIVE ADAPTER READY"}
        </span>
      </div>

      <div className="space-y-3.5">
        <GeolocationCard />
        <NetworkCard />
        <TargetAnalysisCard />
      </div>
    </div>
  );
}
