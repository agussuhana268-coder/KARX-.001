import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** One short entrance used for the main page blocks (CSS only, reduced-motion safe). */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("animate-rise", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
