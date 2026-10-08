import { Wordmark } from "@/components/brand/wordmark";
import { Container } from "@/components/ui/container";
import { StatusDot } from "@/components/ui/status-dot";
import { PRODUCT_NAME, SYSTEM_STATUS, SYSTEM_VERSION } from "@/lib/system";

export function SystemHeader() {
  return (
    <header className="border-b border-line bg-bg/95 sticky top-0 z-40 backdrop-blur-sm">
      <Container className="flex h-12 items-center justify-between gap-4">
        {/* Left: Brand + Product Definition */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Wordmark className="text-[15px]" />
          <span aria-hidden="true" className="h-3.5 w-px bg-line-strong" />
          <span className="font-sans text-xs font-semibold tracking-wider uppercase text-muted">
            {PRODUCT_NAME}
          </span>
        </div>

        {/* Right: Refined system status indicators */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 font-sans text-xs text-muted">
            <StatusDot tone="online" />
            <span className="font-medium text-accent">{SYSTEM_STATUS}</span>
          </div>
          <span aria-hidden="true" className="h-3.5 w-px bg-line-strong hidden sm:block" />
          <span className="font-mono text-[11px] text-dim hidden sm:inline-block">
            {`VERSION ${SYSTEM_VERSION}`}
          </span>
        </div>
      </Container>
    </header>
  );
}
