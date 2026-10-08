import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type PanelProps = {
  id: string;
  title: string;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
};

/** Reusable cyber intelligence panel shell with technical border, title bar and content area */
export function Panel({ id, title, meta, children, className }: PanelProps) {
  const headingId = `${id}-heading`;
  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "flex min-w-0 flex-col rounded-sm border border-line bg-surface transition-colors duration-200 hover:border-line-strong",
        className,
      )}
    >
      <header className="flex h-10 shrink-0 items-center justify-between gap-3 border-b border-line px-4 bg-elevated/40">
        <h2
          id={headingId}
          className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink"
        >
          {title}
        </h2>
        {meta}
      </header>
      {children}
    </section>
  );
}
