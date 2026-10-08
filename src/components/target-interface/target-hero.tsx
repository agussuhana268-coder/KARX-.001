import { TargetForm } from "./target-form";

export function TargetHero() {
  return (
    <section aria-labelledby="target-console-heading" className="pt-6 pb-5 sm:pt-8 sm:pb-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="size-1 rounded-full bg-accent shadow-[0_0_5px_rgba(57,255,136,0.6)]" />
          <span className="font-sans text-[11px] font-semibold tracking-wider uppercase text-cyan">
            OPERATIONS CONSOLE // TARGET RECONNAISSANCE
          </span>
        </div>
        <h1
          id="target-console-heading"
          className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-ink uppercase"
        >
          IP INTELLIGENCE
        </h1>
        <p className="text-xs sm:text-sm text-muted max-w-xl">
          KARX/.001 evaluates IP targets to extract geolocation, autonomous routing metadata, and threat classification.
        </p>
      </div>

      <div className="mt-4 max-w-3xl">
        <TargetForm />
      </div>
    </section>
  );
}
