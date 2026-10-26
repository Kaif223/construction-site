import type { ProcessStep } from "@/data/content";

/**
 * Six-stage process with a connecting rule that fills as the visitor scrolls.
 * `detailed` adds the checklist and outcome for the dedicated process page.
 */
export function ProcessTimeline({ steps, detailed = false }: { steps: ProcessStep[]; detailed?: boolean }) {
  return (
    <ol className="relative">
      <span aria-hidden="true" className="absolute top-2 bottom-2 left-[0.6875rem] w-px bg-line md:left-1/2" />
      <span
        aria-hidden="true"
        data-scrub="grow-y"
        className="absolute top-2 bottom-2 left-[0.6875rem] w-px origin-top bg-orange md:left-1/2"
      />
      {steps.map((step, index) => {
        const right = index % 2 === 1;
        return (
          <li key={step.number} className="relative grid pb-14 pl-12 last:pb-0 md:grid-cols-2 md:gap-16 md:pl-0 md:pb-20">
            <span
              aria-hidden="true"
              className="absolute top-1.5 left-0 grid h-[1.375rem] w-[1.375rem] place-items-center rounded-full border border-charcoal/30 bg-ivory md:left-1/2 md:-translate-x-1/2"
            >
              <span className="h-2 w-2 rounded-full bg-orange" />
            </span>
            <div className={right ? "md:col-start-2" : "md:text-right"} data-reveal="up">
              <p className="eyebrow text-orange-ink">Step {step.number}</p>
              <h3 className="display-md mt-2">{step.title}</h3>
              <p className={`mt-4 max-w-md leading-relaxed text-ink-muted ${right ? "" : "md:ml-auto"}`}>
                {step.summary}
              </p>
              {detailed && (
                <>
                  <ul className={`mt-5 max-w-md space-y-1.5 text-sm ${right ? "" : "md:ml-auto"}`}>
                    {step.details.map((detail) => (
                      <li key={detail}>— {detail}</li>
                    ))}
                  </ul>
                  <p className="eyebrow mt-5 text-ink-muted">
                    Outcome: <span className="text-charcoal">{step.outcome}</span>
                  </p>
                </>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
