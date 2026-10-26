import type { ProcessStep } from "@/data/content";
import { getI18n } from "@/i18n/server";

/**
 * Six-stage process with a connecting rule that fills as the visitor scrolls.
 * `detailed` adds the checklist and outcome for the dedicated process page.
 */
export async function ProcessTimeline({ steps, detailed = false }: { steps: ProcessStep[]; detailed?: boolean }) {
  const { dict, t } = await getI18n();
  return (
    <ol className="relative">
      <span aria-hidden="true" className="absolute start-[0.6875rem] top-2 bottom-2 w-px bg-line md:start-1/2" />
      <span
        aria-hidden="true"
        data-scrub="grow-y"
        className="absolute start-[0.6875rem] top-2 bottom-2 w-px origin-top bg-orange md:start-1/2"
      />
      {steps.map((step, index) => {
        const right = index % 2 === 1;
        return (
          <li key={step.number} className="relative grid ps-12 pb-14 last:pb-0 md:grid-cols-2 md:gap-16 md:ps-0 md:pb-20">
            <span
              aria-hidden="true"
              className="absolute start-0 top-1.5 grid h-[1.375rem] w-[1.375rem] place-items-center rounded-full border border-charcoal/30 bg-ivory md:start-1/2 md:-translate-x-1/2 md:rtl:translate-x-1/2"
            >
              <span className="h-2 w-2 rounded-full bg-orange" />
            </span>
            <div className={right ? "md:col-start-2" : "md:text-end"} data-reveal="up">
              <p className="eyebrow text-orange-ink">{t(dict.process.step, { number: step.number })}</p>
              <h3 className="display-md mt-2">{step.title}</h3>
              <p className={`mt-4 max-w-md leading-relaxed text-ink-muted ${right ? "" : "md:ms-auto"}`}>
                {step.summary}
              </p>
              {detailed && (
                <>
                  <ul className={`mt-5 max-w-md space-y-1.5 text-sm ${right ? "" : "md:ms-auto"}`}>
                    {step.details.map((detail) => (
                      <li key={detail}>— {detail}</li>
                    ))}
                  </ul>
                  <p className="eyebrow mt-5 text-ink-muted">
                    {dict.process.outcome}: <span className="text-charcoal">{step.outcome}</span>
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
