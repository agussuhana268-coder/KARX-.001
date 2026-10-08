"use client";

import { StatusDot } from "@/components/ui/status-dot";
import { useTrace } from "@/context/trace-context";

export function SystemTelemetry() {
  const { telemetryItems } = useTrace();

  return (
    <section aria-label="System Telemetry" className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {telemetryItems.map((item) => (
          <div
            key={item.label}
            className="flex flex-col justify-between rounded border border-line bg-surface/80 px-3.5 py-2.5 transition-colors hover:border-line-strong"
          >
            <span className="font-sans text-[10px] font-semibold tracking-wider uppercase text-muted">
              {item.label}
            </span>
            <div className="mt-1 flex items-center gap-2">
              <StatusDot tone={item.tone} />
              <span className={`font-sans text-xs font-semibold tracking-wide ${item.valueColor}`}>
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
