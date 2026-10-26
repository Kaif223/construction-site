import { Plus } from "lucide-react";
import type { Faq } from "@/data/content";

/**
 * Accordion built on native <details>/<summary>: keyboard operable, announced
 * correctly by screen readers, and functional without JavaScript.
 */
export function FaqList({
  faqs,
  topicLabels,
}: {
  faqs: Faq[];
  /** Localized topic names; topics are shown only when provided. */
  topicLabels?: Record<string, string>;
}) {
  const withTopics = Boolean(topicLabels);
  return (
    <div className="border-t border-line">
      {faqs.map((faq) => (
        <details key={faq.id} className="accordion group border-b border-line">
          <summary className="flex min-h-11 items-start justify-between gap-6 py-6 md:py-7">
            <span className="flex flex-col gap-2 md:flex-row md:items-baseline md:gap-8">
              {topicLabels && <span className="eyebrow w-28 shrink-0 text-ink-muted">{topicLabels[faq.topic] ?? faq.topic}</span>}
              <span className="text-lg leading-snug md:text-[1.375rem]">{faq.question}</span>
            </span>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-charcoal/20 transition-colors group-open:border-orange group-open:bg-orange">
              <Plus aria-hidden="true" className="accordion-icon h-4 w-4" />
            </span>
          </summary>
          <p className={`max-w-3xl pb-7 leading-relaxed text-ink-muted ${withTopics ? "md:ps-36" : ""}`}>
            {faq.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
