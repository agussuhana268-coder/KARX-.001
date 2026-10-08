import { Container } from "@/components/ui/container";
import { StatusDot } from "@/components/ui/status-dot";
import { BRAND, ENVIRONMENT, PRODUCT_LONG_NAME, SYSTEM_VERSION } from "@/lib/system";

export function SystemFooter() {
  return (
    <footer className="border-t border-line bg-bg mt-auto py-5">
      <Container className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-sans text-muted">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="font-semibold text-ink">{BRAND}</span>
          <span className="text-dim">•</span>
          <span>{PRODUCT_LONG_NAME}</span>
          <span className="text-dim">•</span>
          <span className="text-dim">{ENVIRONMENT}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <StatusDot tone="online" />
            <span className="text-accent font-medium text-[11px]">SYSTEM ONLINE</span>
          </div>
          <span className="font-mono text-[11px] text-dim">
            {`v${SYSTEM_VERSION}`}
          </span>
        </div>
      </Container>
    </footer>
  );
}
