"use client";

import { useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Minus, Plus, RotateCcw } from "lucide-react";
import {
  calculateEstimate,
  convertArea,
  formatMoney,
  fromSquareMetres,
  type AreaUnit,
  type EstimateInput,
  type EstimateResult,
} from "@/lib/estimate";
import { estimatorConfig as config } from "@/data/estimator";
import { ESTIMATE_HANDOFF_KEY, writeSession, type EstimateHandoff } from "@/hooks/useBrowserValue";

type Draft = Omit<EstimateInput, "area" | "floors"> & { area: string; floors: string };

const initialDraft: Draft = {
  projectType: "house",
  area: "",
  unit: "sqm",
  floors: "2",
  workType: "new",
  finishLevel: "standard",
  market: "average",
  specialistServices: [],
  additionalRequirements: [],
};

const unitLabel = (unit: AreaUnit) => (unit === "sqm" ? "m²" : "ft²");

function parseNumber(value: string) {
  if (value.trim() === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : Number.NaN;
}

/** Maps estimator selections onto the inquiry form's project types. */
function inquiryTypeFor(draft: Draft) {
  if (draft.workType !== "new") return "renovation";
  const map: Record<string, string> = {
    house: "new-house",
    villa: "villa",
    "multi-unit": "multi-unit",
    commercial: "commercial",
    industrial: "commercial",
    "fit-out": "interior",
  };
  return map[draft.projectType] ?? "other";
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-sm text-danger">
      {message}
    </p>
  );
}

export function Estimator() {
  const router = useRouter();
  const uid = useId();
  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [touched, setTouched] = useState<Partial<Record<keyof Draft, boolean>>>({});
  const summaryRef = useRef<HTMLDivElement>(null);

  const outcome = useMemo(
    () =>
      calculateEstimate(
        { ...draft, area: parseNumber(draft.area), floors: parseNumber(draft.floors) },
        config,
      ),
    [draft],
  );
  const errors = outcome.ok ? {} : outcome.errors;
  const projectType = config.projectTypes.find((type) => type.id === draft.projectType);

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function toggle(key: "specialistServices" | "additionalRequirements", id: string) {
    setDraft((current) => ({
      ...current,
      [key]: current[key].includes(id) ? current[key].filter((item) => item !== id) : [...current[key], id],
    }));
  }

  function changeUnit(unit: AreaUnit) {
    setDraft((current) => {
      const area = parseNumber(current.area);
      const converted =
        area !== null && !Number.isNaN(area) && area > 0 ? String(convertArea(area, current.unit, unit)) : current.area;
      return { ...current, unit, area: converted };
    });
  }

  function stepFloors(delta: number) {
    const floors = parseNumber(draft.floors);
    const base = floors === null || Number.isNaN(floors) ? 1 : Math.round(floors);
    const max = projectType?.maxFloors ?? 1;
    update("floors", String(Math.min(max, Math.max(1, base + delta))));
    setTouched((current) => ({ ...current, floors: true }));
  }

  const showError = (key: "area" | "floors") => (touched[key] ? errors[key] : undefined);

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <form
        className="space-y-10 lg:col-span-7"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          setTouched({ area: true, floors: true });
          // On small screens the summary sits below the form; bring it into view.
          const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          summaryRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
          summaryRef.current?.focus({ preventScroll: true });
        }}
        aria-describedby={`${uid}-disclaimer`}
      >
        <fieldset>
          <legend className="field-label">01 · Project type</legend>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {config.projectTypes.map((type) => (
              <label key={type.id} className="choice !items-start !rounded-md !px-4 !py-3">
                <input
                  type="radio"
                  name="projectType"
                  value={type.id}
                  checked={draft.projectType === type.id}
                  onChange={() => update("projectType", type.id)}
                />
                <span>
                  <span className="block font-medium">{type.label}</span>
                  <span className="block text-xs opacity-70">{type.description}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="field-label">02 · Construction or renovation</legend>
          <div className="flex flex-wrap gap-2">
            {config.workTypes.map((type) => (
              <label key={type.id} className="choice" title={type.description}>
                <input
                  type="radio"
                  name="workType"
                  value={type.id}
                  checked={draft.workType === type.id}
                  onChange={() => update("workType", type.id)}
                />
                {type.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <label htmlFor={`${uid}-area`} className="field-label">
              03 · Approximate covered area
            </label>
            <div className="flex gap-2">
              <input
                id={`${uid}-area`}
                type="number"
                inputMode="decimal"
                min={1}
                step="any"
                placeholder={draft.unit === "sqm" ? "e.g. 250" : "e.g. 2700"}
                className="field min-w-0 flex-1"
                value={draft.area}
                onChange={(event) => update("area", event.target.value)}
                onBlur={() => setTouched((current) => ({ ...current, area: true }))}
                aria-invalid={Boolean(showError("area"))}
                aria-describedby={`${uid}-area-hint ${uid}-area-error`}
              />
              <fieldset className="flex shrink-0 rounded-md border border-charcoal/20 p-1">
                <legend className="sr-only">Area unit</legend>
                {(["sqm", "sqft"] as const).map((unit) => (
                  <label
                    key={unit}
                    className="relative grid min-w-12 cursor-pointer place-items-center rounded px-2 text-sm has-[:checked]:bg-charcoal has-[:checked]:text-ivory has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-orange"
                  >
                    <input
                      type="radio"
                      name="unit"
                      value={unit}
                      checked={draft.unit === unit}
                      onChange={() => changeUnit(unit)}
                      className="absolute opacity-0"
                    />
                    {unitLabel(unit)}
                  </label>
                ))}
              </fieldset>
            </div>
            <p id={`${uid}-area-hint`} className="mt-2 text-xs text-ink-muted">
              Total floor area across all levels. Switching units converts your figure.
            </p>
            <FieldError id={`${uid}-area-error`} message={showError("area")} />
          </div>

          <div>
            <label htmlFor={`${uid}-floors`} className="field-label">
              04 · Number of floors
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                className="grid h-[3.25rem] w-12 shrink-0 place-items-center rounded-md border border-charcoal/20 hover:border-charcoal"
                onClick={() => stepFloors(-1)}
                aria-label="Remove a floor"
              >
                <Minus aria-hidden="true" className="h-4 w-4" />
              </button>
              <input
                id={`${uid}-floors`}
                type="number"
                inputMode="numeric"
                min={1}
                max={projectType?.maxFloors}
                step={1}
                className="field min-w-0 flex-1 text-center"
                value={draft.floors}
                onChange={(event) => update("floors", event.target.value)}
                onBlur={() => setTouched((current) => ({ ...current, floors: true }))}
                aria-invalid={Boolean(showError("floors"))}
                aria-describedby={`${uid}-floors-error`}
              />
              <button
                type="button"
                className="grid h-[3.25rem] w-12 shrink-0 place-items-center rounded-md border border-charcoal/20 hover:border-charcoal"
                onClick={() => stepFloors(1)}
                aria-label="Add a floor"
              >
                <Plus aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
            <FieldError id={`${uid}-floors-error`} message={showError("floors")} />
          </div>
        </div>

        <fieldset>
          <legend className="field-label">05 · Finishing level</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {config.finishLevels.map((level) => (
              <label key={level.id} className="choice !items-start !rounded-md !px-4 !py-3">
                <input
                  type="radio"
                  name="finishLevel"
                  value={level.id}
                  checked={draft.finishLevel === level.id}
                  onChange={() => update("finishLevel", level.id)}
                />
                <span>
                  <span className="block font-medium">{level.label}</span>
                  <span className="block text-xs opacity-70">{level.description}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor={`${uid}-market`} className="field-label">
            06 · Location / market
          </label>
          <select
            id={`${uid}-market`}
            className="field"
            value={draft.market}
            onChange={(event) => update("market", event.target.value)}
            aria-describedby={`${uid}-market-hint`}
          >
            {config.markets.map((market) => (
              <option key={market.id} value={market.id}>
                {market.label} — {market.description}
              </option>
            ))}
          </select>
          <p id={`${uid}-market-hint`} className="mt-2 text-xs text-ink-muted">
            A relative cost index, not a specific city. Your detailed quotation uses local pricing.
          </p>
        </div>

        <fieldset>
          <legend className="field-label">07 · Optional specialist services</legend>
          <div className="flex flex-wrap gap-2">
            {config.specialistServices.map((addOn) => (
              <label key={addOn.id} className="choice" title={addOn.description}>
                <input
                  type="checkbox"
                  checked={draft.specialistServices.includes(addOn.id)}
                  onChange={() => toggle("specialistServices", addOn.id)}
                />
                {addOn.label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="field-label">08 · Additional requirements</legend>
          <div className="flex flex-wrap gap-2">
            {config.additionalRequirements.map((addOn) => (
              <label key={addOn.id} className="choice" title={addOn.description}>
                <input
                  type="checkbox"
                  checked={draft.additionalRequirements.includes(addOn.id)}
                  onChange={() => toggle("additionalRequirements", addOn.id)}
                />
                {addOn.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-wrap gap-3 lg:hidden">
          <button type="submit" className="btn btn-dark">
            Show my estimate
          </button>
        </div>
      </form>

      <aside aria-label="Estimate summary" className="lg:col-span-5">
        <div
          ref={summaryRef}
          tabIndex={-1}
          className="sticky top-[calc(var(--header-h)+1.5rem)] scroll-mt-24 bg-charcoal p-6 text-ivory outline-none md:p-8"
        >
          <p className="eyebrow text-orange">Preliminary estimate</p>
          <p id={`${uid}-disclaimer`} className="mt-2 text-xs leading-relaxed text-ivory/65">
            {config.rateDisclaimer} Actual costs depend on location, materials, site conditions, design, labour and
            final scope.
          </p>

          {outcome.ok ? (
            <EstimateSummary
              draft={draft}
              result={outcome.result}
              onRequest={() => {
                const handoff: EstimateHandoff = {
                  summary: summaryText(draft, outcome.result),
                  projectType: inquiryTypeFor(draft),
                  area: draft.area,
                  areaUnit: draft.unit,
                };
                writeSession(ESTIMATE_HANDOFF_KEY, JSON.stringify(handoff));
                router.push("/contact?from=estimate");
              }}
              onReset={() => {
                setDraft(initialDraft);
                setTouched({});
              }}
            />
          ) : (
            <div className="mt-8 border-t border-line-inverse pt-8">
              <p className="font-display text-3xl leading-tight">Your range will appear here.</p>
              {draft.area.trim() === "" ? (
                <p className="mt-3 text-sm text-ivory/70">Start by entering the approximate covered area.</p>
              ) : (
                <>
                  <p className="mt-3 text-sm text-ivory/70">Check these details to continue:</p>
                  <ul className="mt-3 space-y-1 text-sm text-ivory/70">
                    {Object.entries(errors).map(([key, message]) => (
                      <li key={key}>— {message}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

function summaryText(draft: Draft, result: EstimateResult) {
  const label = (list: { id: string; label: string }[], id: string) => list.find((item) => item.id === id)?.label;
  const money = (value: number) => formatMoney(value, config.currency);
  return [
    `Project: ${label(config.projectTypes, draft.projectType)} — ${label(config.workTypes, draft.workType)}`,
    `Area: ${Math.round(result.areaSqm).toLocaleString("en")} m² (${Math.round(result.areaSqft).toLocaleString("en")} ft²), ${draft.floors} floor(s)`,
    `Finish: ${label(config.finishLevels, draft.finishLevel)} · Market: ${label(config.markets, draft.market)}`,
    result.lines.length > 1 && `Extras: ${result.lines.slice(1).map((line) => line.label).join(", ")}`,
    `Preliminary range: ${money(result.low)} – ${money(result.high)} (example rates, not a quotation)`,
  ]
    .filter(Boolean)
    .join("\n");
}

function EstimateSummary({
  draft,
  result,
  onRequest,
  onReset,
}: {
  draft: Draft;
  result: EstimateResult;
  onRequest: () => void;
  onReset: () => void;
}) {
  const money = (value: number) => formatMoney(value, config.currency);
  const perUnitLow = result.low / fromSquareMetres(result.areaSqm, draft.unit);
  const perUnitHigh = result.high / fromSquareMetres(result.areaSqm, draft.unit);
  const label = (list: { id: string; label: string }[], id: string) => list.find((item) => item.id === id)?.label;

  return (
    <div className="mt-8 border-t border-line-inverse pt-8">
      <p aria-live="polite" aria-atomic="true">
        <span className="sr-only">Estimated range: </span>
        <span className="block font-display text-[clamp(2.25rem,4.4vw,3.5rem)] leading-[1.02]">
          {money(result.low)}
          <span className="text-ivory/50"> – </span>
          <br className="sm:hidden" />
          {money(result.high)}
        </span>
      </p>
      <p className="eyebrow mt-3 text-ivory-muted">
        ≈ {money(perUnitLow)} – {money(perUnitHigh)} per {unitLabel(draft.unit)}
      </p>

      <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
        {[
          ["Project", label(config.projectTypes, draft.projectType)],
          ["Work", label(config.workTypes, draft.workType)],
          [
            "Area",
            `${Math.round(result.areaSqm).toLocaleString("en")} m² · ${Math.round(result.areaSqft).toLocaleString("en")} ft²`,
          ],
          ["Floors", draft.floors],
          ["Finish", label(config.finishLevels, draft.finishLevel)],
          ["Market", label(config.markets, draft.market)],
        ].map(([term, value]) => (
          <div key={term}>
            <dt className="eyebrow text-ivory-muted">{term}</dt>
            <dd className="mt-1">{value}</dd>
          </div>
        ))}
      </dl>

      {result.lines.length > 1 && (
        <table className="mt-8 w-full text-left text-sm">
          <caption className="eyebrow mb-3 text-left text-ivory-muted">Breakdown</caption>
          <tbody>
            {result.lines.map((line) => (
              <tr key={line.label} className="border-t border-line-inverse">
                <th scope="row" className="py-2 pr-4 font-normal text-ivory/80">
                  {line.label}
                </th>
                <td className="py-2 text-right whitespace-nowrap">
                  {money(line.low)} – {money(line.high)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <details className="accordion mt-8 border-t border-line-inverse">
        <summary className="flex items-center justify-between py-4 text-sm">
          Included work categories
          <Plus aria-hidden="true" className="accordion-icon h-4 w-4" />
        </summary>
        <ul className="space-y-1.5 pb-4 text-sm text-ivory/75">
          {result.included.map((item) => (
            <li key={item}>— {item}</li>
          ))}
        </ul>
      </details>
      <details className="accordion border-y border-line-inverse">
        <summary className="flex items-center justify-between py-4 text-sm">
          Important exclusions
          <Plus aria-hidden="true" className="accordion-icon h-4 w-4" />
        </summary>
        <ul className="space-y-1.5 pb-4 text-sm text-ivory/75">
          {result.exclusions.map((item) => (
            <li key={item}>— {item}</li>
          ))}
        </ul>
      </details>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
        <button type="button" onClick={onRequest} className="btn btn-primary flex-1">
          Request a detailed quotation <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </button>
        <button type="button" onClick={onReset} className="btn btn-ghost-light">
          <RotateCcw aria-hidden="true" className="h-4 w-4" /> Reset
        </button>
      </div>
    </div>
  );
}
