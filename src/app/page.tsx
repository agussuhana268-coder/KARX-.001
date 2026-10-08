import { IntelligenceGrid } from "@/components/intelligence/intelligence-grid";
import { PrimaryTargetCard } from "@/components/intelligence/primary-target-card";
import { NetworkMap } from "@/components/network-map/network-map";
import { SystemFooter } from "@/components/system-footer/system-footer";
import { SystemHeader } from "@/components/system-header/system-header";
import { SystemTelemetry } from "@/components/system-telemetry/system-telemetry";
import { SystemTerminal } from "@/components/system-terminal/system-terminal";
import { TargetHero } from "@/components/target-interface/target-hero";
import { TraceProvider } from "@/context/trace-context";
import { Container } from "@/components/ui/container";

export default function Home() {
  return (
    <TraceProvider>
      <div className="relative flex min-h-dvh flex-1 flex-col bg-bg text-ink cyber-grid">
      {/* Subtle ambient scanline overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-50 cyber-scanlines opacity-30"
      />

      {/* 1. Refined, Compact Header */}
      <SystemHeader />

      {/* Main Operations Workspace */}
      <main id="main-content" className="flex-1 pb-10 sm:pb-14">
        <Container className="flex flex-col gap-5 sm:gap-6">
          {/* 2. Target Query Console Area */}
          <TargetHero />

          {/* 3. Believable Telemetry Strip */}
          <SystemTelemetry />

          {/* 4. Primary Target Dossier Banner */}
          <PrimaryTargetCard />

          {/* 5 & 6. Core Intelligence & Analytical Visualization Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column: Structured Intelligence Cards */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <IntelligenceGrid />
            </div>

            {/* Right Column: Prominent Network Map & Supporting Trace Terminal */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <NetworkMap className="w-full" />
              <SystemTerminal className="w-full" />
            </div>
          </div>
        </Container>
      </main>

      {/* 7. System Footer */}
      <SystemFooter />
    </div>
    </TraceProvider>
  );
}
