"use client";

import Link from "next/link";
import { useDeferredValue, useId, useState } from "react";
import { ArrowUpRight, Search, X } from "lucide-react";

export type SearchableService = {
  id: string;
  name: string;
  summary: string;
  categorySlug: string;
  categoryTitle: string;
  categoryCode: string;
};

const suggestions = ["Marble", "Solar", "Bathroom", "Waterproofing", "Kitchen", "CCTV"];

function normalise(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[^\w\s]/g, " ");
}

/** Instant search across every service, linking to its category page anchor. */
export function ServiceFinder({ services }: { services: SearchableService[] }) {
  const uid = useId();
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const terms = normalise(deferred).split(/\s+/).filter(Boolean);
  const results =
    terms.length === 0
      ? []
      : services.filter((service) => {
          const haystack = normalise(`${service.name} ${service.summary} ${service.categoryTitle}`);
          return terms.every((term) => haystack.includes(term));
        });

  return (
    <div>
      <form role="search" onSubmit={(event) => event.preventDefault()} className="relative">
        <label htmlFor={`${uid}-q`} className="sr-only">
          Search all services
        </label>
        <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2 text-ink-muted" />
        <input
          id={`${uid}-q`}
          type="search"
          autoComplete="off"
          placeholder={`Search ${services.length} services…`}
          className="field !min-h-16 !rounded-full !pr-14 !pl-14 text-lg"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-describedby={`${uid}-status`}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute top-1/2 right-3 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full hover:bg-ivory-deep"
            aria-label="Clear search"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        )}
      </form>

      {terms.length === 0 ? (
        <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
          <span className="eyebrow mr-2 text-ink-muted">Try</span>
          {suggestions.map((suggestion) => (
            <button key={suggestion} type="button" className="choice !min-h-10" onClick={() => setQuery(suggestion)}>
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}

      <p id={`${uid}-status`} aria-live="polite" className="eyebrow mt-6 text-ink-muted">
        {terms.length === 0 ? "" : `${results.length} ${results.length === 1 ? "service" : "services"} found`}
      </p>

      {terms.length > 0 && results.length === 0 && (
        <div className="mt-4 rounded-md border border-line bg-paper p-6">
          <p className="font-medium">No services match “{deferred}”.</p>
          <p className="mt-1 text-sm text-ink-muted">
            Try a broader word, or{" "}
            <Link href="/contact" className="underline underline-offset-2">
              describe your project
            </Link>{" "}
            and we will tell you how we can help.
          </p>
        </div>
      )}

      {results.length > 0 && (
        <ul className="mt-4 grid gap-px overflow-hidden rounded-md border border-line bg-line md:grid-cols-2">
          {results.slice(0, 24).map((service) => (
            <li key={`${service.categorySlug}-${service.id}`} className="bg-paper">
              <Link
                href={`/services/${service.categorySlug}#${service.id}`}
                className="group flex h-full items-start justify-between gap-4 p-5 hover:bg-ivory"
              >
                <span>
                  <span className="eyebrow text-orange-ink">
                    {service.categoryCode} · {service.categoryTitle}
                  </span>
                  <span className="mt-1.5 block font-medium">{service.name}</span>
                  <span className="mt-1 block text-sm text-ink-muted">{service.summary}</span>
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="mt-1 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
      {results.length > 24 && (
        <p className="mt-3 text-sm text-ink-muted">Showing the first 24 — refine your search to narrow the list.</p>
      )}
    </div>
  );
}
