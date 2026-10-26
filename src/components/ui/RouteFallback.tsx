/**
 * Instant shell shown while a project or service page streams in. It is at
 * least a viewport and a half tall so the footer never flashes into view and
 * then jumps (which would register as layout shift).
 */
export function RouteFallback({ label }: { label: string }) {
  return (
    <section aria-busy="true" className="grid-paper-dark relative min-h-[150svh] bg-charcoal text-ivory">
      <div className="container-x flex min-h-[88svh] flex-col justify-end pt-[var(--header-h)] pb-12">
        <p className="sr-only" role="status">
          Loading {label}…
        </p>
        <div aria-hidden="true" className="animate-pulse space-y-5">
          <div className="h-3 w-40 rounded-full bg-ivory/15" />
          <div className="h-16 w-[min(40rem,90%)] rounded bg-ivory/10 md:h-24" />
          <div className="h-4 w-[min(32rem,80%)] rounded-full bg-ivory/10" />
        </div>
      </div>
    </section>
  );
}
