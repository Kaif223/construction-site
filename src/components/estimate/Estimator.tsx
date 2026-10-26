"use client";

import { useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Minus, Plus, RotateCcw } from "lucide-react";
import {
  calculateEstimate,
  convertArea,
  finishLevels,
  formatMoney,
  formatNumber,
  fromSquareMetres,
  type AreaUnit,
  type EstimateError,
  type EstimateInput,
  type EstimateResult,
  type FinishLevel,
  type RateTable,
} from "@/lib/estimate";
import { getRateTable } from "@/data/rates";
import { ESTIMATE_HANDOFF_KEY, writeSession, type EstimateHandoff } from "@/hooks/useBrowserValue";
import { useI18n } from "@/i18n/client";
import type { ClientDictionary } from "@/i18n/dictionaries";

type Draft = Omit<EstimateInput, "area" | "floors" | "region"> & { area: string; floors: string; region: string };

function parseNumber(value: string) {
  if (value.trim() === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : Number.NaN;
}

/** Maps estimator selections onto the quotation form's project types. */
function quoteTypeFor(draft: Draft) {
  if (draft.workType !== "new") {
    return draft.projectType === "residential-building" ? "apartment-renovation" : "interior-finishing";
  }
  const map: Record<string, string> = {
    villa: "villa-construction",
    "residential-building": "residential-building",
    commercial: "commercial-construction",
    warehouse: "commercial-construction",
    "interior-fit-out": "interior-finishing",
  };
  return map[draft.projectType] ?? "other";
}

function errorMessage(error: EstimateError | undefined, dict: ClientDictionary, unitLabel: string) {
  if (!error) return undefined;
  const values: Record<string, string | number> = { ...error.values, unit: unitLabel };
  const template = dict.errors[error.code as keyof ClientDictionary["errors"]] ?? dict.errors.invalid;
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));
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
  const { dict, market, l, t, tag, href } = useI18n();
  const e = dict.estimator;
  const router = useRouter();
  const uid = useId();
  const table = getRateTable(market.rateTable);
  const regionIds = useMemo(() => market.regions.map((region) => region.id), [market]);

  const initialDraft: Draft = {
    projectType: table?.projectTypes[0]?.id ?? "villa",
    area: "",
    unit: market.units.defaultArea,
    floors: "2",
    workType: "new",
    finishLevel: "standard",
    region: "",
    addOns: [],
  };

  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [touched, setTouched] = useState<Partial<Record<keyof Draft, boolean>>>({});
  const [preview, setPreview] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  const outcome = useMemo(
    () =>
      table
        ? calculateEstimate(
            { ...draft, area: parseNumber(draft.area), floors: parseNumber(draft.floors), region: draft.region || null },
            table,
            regionIds,
          )
        : null,
    [draft, table, regionIds],
  );
  const errors = outcome && !outcome.ok ? outcome.errors : {};
  const projectType = table?.projectTypes.find((type) => type.id === draft.projectType);
  const unitLabel = dict.units[draft.unit];
  const showFigures = table?.status === "verified" || preview;

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function toggleAddOn(id: string) {
    setDraft((current) => ({
      ...current,
      addOns: current.addOns.includes(id) ? current.addOns.filter((item) => item !== id) : [...current.addOns, id],
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
    update("floors", String(Math.min(projectType?.maxFloors ?? 1, Math.max(1, base + delta))));
    setTouched((current) => ({ ...current, floors: true }));
  }

  const showError = (key: "area" | "floors") => (touched[key] ? errorMessage(errors[key], dict, unitLabel) : undefined);
  const regionName = (id: string) => {
    const region = market.regions.find((item) => item.id === id);
    return region ? l(region.name) : e.labels.anyLocation;
  };

  function handoff(result: EstimateResult | null) {
    const label = (group: Record<string, { label: string }>, id: string) => group[id]?.label ?? id;
    const money = (value: number) => formatMoney(value, table?.currency ?? market.currency.code, tag);
    const addOnLabel = (id: string) => (e.addOns as Record<string, string>)[id] ?? id;
    const lines = [
      `${e.handoff.project}: ${label(e.projectTypes, draft.projectType)} — ${label(e.workTypes, draft.workType)}`,
      draft.area && `${e.handoff.area}: ${draft.area} ${unitLabel} · ${e.summary.specs.floors}: ${draft.floors}`,
      `${e.handoff.finish}: ${label(e.finishLevels, draft.finishLevel)}`,
      draft.region && `${e.handoff.location}: ${regionName(draft.region)}`,
      draft.addOns.length > 0 && `${e.handoff.extras}: ${draft.addOns.map(addOnLabel).join(", ")}`,
      result && showFigures
        ? `${e.handoff.range}: ${money(result.low)} – ${money(result.high)} (${e.handoff.rangeNote})`
        : e.handoff.noFigures,
    ];
    const data: EstimateHandoff = {
      summary: lines.filter(Boolean).join("\n"),
      projectType: quoteTypeFor(draft),
      area: draft.area,
      areaUnit: draft.unit,
      floors: draft.floors,
      region: draft.region,
    };
    writeSession(ESTIMATE_HANDOFF_KEY, JSON.stringify(data));
    router.push(href("/quote?from=estimate"));
  }

  if (!table) {
    // No rate table for this market: the form would only produce empty numbers.
    return (
      <div className="bg-charcoal p-6 text-ivory md:p-8">
        <p className="font-display text-3xl">{e.summary.noRatesTitle}</p>
        <p className="mt-3 max-w-xl text-ivory/75">{e.summary.noRatesBody}</p>
        <a href={href("/quote")} className="btn btn-primary mt-6">
          {e.summary.request} <ArrowRight aria-hidden="true" className="icon-dir h-4 w-4" />
        </a>
      </div>
    );
  }

  const choiceCard = "choice !items-start !rounded-md !px-4 !py-3";
  const groups: { key: "specialist" | "materials" | "site"; label: string }[] = [
    { key: "specialist", label: e.labels.specialist },
    { key: "materials", label: e.labels.materials },
    { key: "site", label: e.labels.site },
  ];
  const typeText = (id: string) => (e.projectTypes as Record<string, { label: string; description: string }>)[id];

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <form
        className="space-y-10 lg:col-span-7"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          setTouched({ area: true, floors: true });
          const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          summaryRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
          summaryRef.current?.focus({ preventScroll: true });
        }}
      >
        <fieldset>
          <legend className="field-label">01 · {e.labels.projectType}</legend>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {table.projectTypes.map((type) => (
              <label key={type.id} className={choiceCard}>
                <input
                  type="radio"
                  name="projectType"
                  value={type.id}
                  checked={draft.projectType === type.id}
                  onChange={() => update("projectType", type.id)}
                />
                <span>
                  <span className="block font-medium">{typeText(type.id)?.label ?? type.id}</span>
                  <span className="block text-xs opacity-70">{typeText(type.id)?.description}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="field-label">02 · {e.labels.workType}</legend>
          <div className="flex flex-wrap gap-2">
            {table.workTypes.map((type) => {
              const text = (e.workTypes as Record<string, { label: string; description: string }>)[type.id];
              return (
                <label key={type.id} className="choice" title={text?.description}>
                  <input
                    type="radio"
                    name="workType"
                    value={type.id}
                    checked={draft.workType === type.id}
                    onChange={() => update("workType", type.id)}
                  />
                  {text?.label ?? type.id}
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <label htmlFor={`${uid}-area`} className="field-label">
              03 · {e.labels.area}
            </label>
            <div className="flex gap-2">
              <input
                id={`${uid}-area`}
                type="number"
                inputMode="decimal"
                min={1}
                step="any"
                dir="ltr"
                className="field min-w-0 flex-1 text-start"
                value={draft.area}
                onChange={(event) => update("area", event.target.value)}
                onBlur={() => setTouched((current) => ({ ...current, area: true }))}
                aria-invalid={Boolean(showError("area"))}
                aria-describedby={`${uid}-area-hint ${uid}-area-error`}
              />
              <fieldset className="flex shrink-0 rounded-md border border-charcoal/20 p-1">
                <legend className="sr-only">{e.labels.unit}</legend>
                {market.units.area.map((unit) => (
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
                      aria-label={dict.units[`${unit}Long`]}
                    />
                    {dict.units[unit]}
                  </label>
                ))}
              </fieldset>
            </div>
            <p id={`${uid}-area-hint`} className="mt-2 text-xs text-ink-muted">
              {e.labels.areaHint}
            </p>
            <FieldError id={`${uid}-area-error`} message={showError("area")} />
          </div>

          <div>
            <label htmlFor={`${uid}-floors`} className="field-label">
              04 · {e.labels.floors}
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                className="grid h-[3.25rem] w-12 shrink-0 place-items-center rounded-md border border-charcoal/20 hover:border-charcoal"
                onClick={() => stepFloors(-1)}
                aria-label={e.labels.removeFloor}
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
                dir="ltr"
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
                aria-label={e.labels.addFloor}
              >
                <Plus aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
            <FieldError id={`${uid}-floors-error`} message={showError("floors")} />
          </div>
        </div>

        <fieldset>
          <legend className="field-label">05 · {e.labels.finish}</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {finishLevels.map((level) => (
              <label key={level} className={choiceCard}>
                <input
                  type="radio"
                  name="finishLevel"
                  value={level}
                  checked={draft.finishLevel === level}
                  onChange={() => update("finishLevel", level as FinishLevel)}
                />
                <span>
                  <span className="block font-medium">{e.finishLevels[level].label}</span>
                  <span className="block text-xs opacity-70">{e.finishLevels[level].description}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor={`${uid}-region`} className="field-label">
            06 · {e.labels.location} ({l(market.regionLabel)})
          </label>
          <select
            id={`${uid}-region`}
            className="field"
            value={draft.region}
            onChange={(event) => update("region", event.target.value)}
            aria-describedby={`${uid}-region-hint`}
          >
            <option value="">{e.labels.anyLocation}</option>
            {market.regions.map((region) => (
              <option key={region.id} value={region.id}>
                {l(region.name)}
              </option>
            ))}
          </select>
          <p id={`${uid}-region-hint`} className="mt-2 text-xs text-ink-muted">
            {e.labels.locationHint}
          </p>
        </div>

        {groups.map((group, index) => (
          <fieldset key={group.key}>
            <legend className="field-label">
              {String(index + 7).padStart(2, "0")} · {group.label}
            </legend>
            <div className="flex flex-wrap gap-2">
              {table.addOns
                .filter((addOn) => addOn.group === group.key)
                .map((addOn) => (
                  <label key={addOn.id} className="choice">
                    <input type="checkbox" checked={draft.addOns.includes(addOn.id)} onChange={() => toggleAddOn(addOn.id)} />
                    {(e.addOns as Record<string, string>)[addOn.id] ?? addOn.id}
                  </label>
                ))}
            </div>
          </fieldset>
        ))}

        <button type="submit" className="btn btn-dark lg:hidden">
          {e.labels.show}
        </button>
      </form>

      <aside aria-label={e.summary.title} className="lg:col-span-5">
        <div
          ref={summaryRef}
          tabIndex={-1}
          className="sticky top-[calc(var(--header-h)+1.5rem)] scroll-mt-24 bg-charcoal p-6 text-ivory outline-none md:p-8"
        >
          <p className="eyebrow text-orange">{e.summary.title}</p>

          {outcome && outcome.ok && outcome.result.kind === "estimate" ? (
            showFigures ? (
              <EstimateFigures draft={draft} result={outcome.result} table={table} regionName={regionName} />
            ) : (
              <div className="mt-6 border-t border-line-inverse pt-6">
                <p className="font-display text-3xl leading-tight">{e.summary.noRatesTitle}</p>
                <p className="mt-3 text-sm leading-relaxed text-ivory/75">{e.summary.noRatesBody}</p>
              </div>
            )
          ) : outcome && outcome.ok && outcome.result.kind === "no-rates" ? (
            <div className="mt-6 border-t border-line-inverse pt-6">
              <p className="font-display text-2xl leading-tight">
                {t(e.summary.missingRate, {
                  type: typeText(draft.projectType)?.label ?? draft.projectType,
                  finish: e.finishLevels[draft.finishLevel].label,
                })}
              </p>
              <p className="mt-3 text-sm text-ivory/75">{e.summary.missingRateBody}</p>
            </div>
          ) : (
            <div className="mt-6 border-t border-line-inverse pt-6">
              <p className="font-display text-3xl leading-tight">{e.summary.emptyTitle}</p>
              {draft.area.trim() === "" ? (
                <p className="mt-3 text-sm text-ivory/70">{e.summary.emptyStart}</p>
              ) : (
                <>
                  <p className="mt-3 text-sm text-ivory/70">{e.summary.emptyCheck}</p>
                  <ul className="mt-3 space-y-1 text-sm text-ivory/70">
                    {Object.entries(errors).map(([key, error]) => (
                      <li key={key}>— {errorMessage(error, dict, unitLabel)}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}

          {table.status === "example" && (
            <button
              type="button"
              className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm text-ivory/80 underline underline-offset-4 hover:text-ivory"
              aria-pressed={preview}
              onClick={() => setPreview((value) => !value)}
            >
              {preview ? <EyeOff aria-hidden="true" className="h-4 w-4" /> : <Eye aria-hidden="true" className="h-4 w-4" />}
              {preview ? e.summary.hidePreview : e.summary.preview}
            </button>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <button
              type="button"
              onClick={() => handoff(outcome && outcome.ok && outcome.result.kind === "estimate" ? outcome.result : null)}
              className="btn btn-primary flex-1"
            >
              {e.summary.request} <ArrowRight aria-hidden="true" className="icon-dir h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setDraft(initialDraft);
                setTouched({});
                setPreview(false);
              }}
              className="btn btn-ghost-light"
            >
              <RotateCcw aria-hidden="true" className="h-4 w-4" /> {e.summary.reset}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function EstimateFigures({
  draft,
  result,
  table,
  regionName,
}: {
  draft: Draft;
  result: EstimateResult;
  table: RateTable;
  regionName: (id: string) => string;
}) {
  const { dict, market, l, t, tag } = useI18n();
  const e = dict.estimator;
  const money = (value: number) => formatMoney(value, result.currency, tag, market.currency.fractionDigits);
  const unitLabel = dict.units[draft.unit];
  const perUnitLow = result.low / fromSquareMetres(result.areaSqm, draft.unit);
  const perUnitHigh = result.high / fromSquareMetres(result.areaSqm, draft.unit);
  const label = (group: Record<string, { label: string }>, id: string) => group[id]?.label ?? id;
  const lineLabel = (id: string) =>
    id === "base"
      ? t(e.summary.base, { type: label(e.projectTypes, draft.projectType), work: label(e.workTypes, draft.workType) })
      : ((e.addOns as Record<string, string>)[id] ?? id);
  const includedLabel = (id: string) =>
    (e.included as Record<string, string>)[id] ?? (e.addOns as Record<string, string>)[id] ?? id;
  const date = (iso: string) => new Intl.DateTimeFormat(tag, { dateStyle: "medium" }).format(new Date(iso));

  return (
    <div className="mt-6 border-t border-line-inverse pt-6">
      {result.status === "example" && (
        <div className="mb-6 rounded-md border border-orange/60 bg-orange/10 p-4">
          <p className="eyebrow text-orange">{t(e.summary.exampleStamp, { market: l(market.name) })}</p>
          <p className="mt-2 text-xs leading-relaxed text-ivory/75">{e.summary.exampleBody}</p>
        </div>
      )}
      <p aria-live="polite" aria-atomic="true">
        <span className="sr-only">{e.summary.rangeSr} </span>
        <span className="block font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.1]">
          <span className="ltr-isolate">{money(result.low)}</span>
          <span className="text-ivory/50"> – </span>
          <br className="sm:hidden" />
          <span className="ltr-isolate">{money(result.high)}</span>
        </span>
      </p>
      <p className="eyebrow mt-3 text-ivory-muted">
        {t(e.summary.perUnit, { low: money(perUnitLow), high: money(perUnitHigh), unit: unitLabel })}
      </p>

      <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
        {[
          [e.summary.specs.project, label(e.projectTypes, draft.projectType)],
          [e.summary.specs.work, label(e.workTypes, draft.workType)],
          [
            e.summary.specs.area,
            `${formatNumber(result.areaSqm, tag)} ${dict.units.sqm} · ${formatNumber(result.areaSqft, tag)} ${dict.units.sqft}`,
          ],
          [e.summary.specs.floors, draft.floors],
          [e.summary.specs.finish, e.finishLevels[draft.finishLevel].label],
          [e.summary.specs.location, regionName(draft.region)],
        ].map(([term, value]) => (
          <div key={term}>
            <dt className="eyebrow text-ivory-muted">{term}</dt>
            <dd className="mt-1">{value}</dd>
          </div>
        ))}
      </dl>

      {result.lines.length > 1 && (
        <table className="mt-8 w-full text-start text-sm">
          <caption className="eyebrow mb-3 text-start text-ivory-muted">{e.summary.breakdown}</caption>
          <tbody>
            {result.lines.map((line) => (
              <tr key={line.id} className="border-t border-line-inverse">
                <th scope="row" className="py-2 pe-4 text-start font-normal text-ivory/80">
                  {lineLabel(line.id)}
                </th>
                <td className="py-2 text-end whitespace-nowrap">
                  <span className="ltr-isolate">
                    {money(line.low)} – {money(line.high)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-8 text-xs">
        <p className="eyebrow text-ivory-muted">{e.summary.covers}</p>
        <dl className="mt-2 grid gap-x-6 sm:grid-cols-2">
          {(
            [
              [e.summary.design, table.includes.design],
              [e.summary.permits, table.includes.permits],
              [e.summary.materialsIncl, table.includes.materials],
              [e.summary.specialistIncl, table.includes.specialistServices],
            ] as const
          ).map(([term, included]) => (
            <div key={term} className="flex justify-between gap-2 border-t border-line-inverse py-1.5">
              <dt className="text-ivory/75">{term}</dt>
              <dd className={included ? "text-ivory" : "text-ivory/60"}>{included ? e.summary.yes : e.summary.no}</dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-ivory/70">
        {result.taxIncluded
          ? t(e.summary.taxIncluded, { tax: l(market.tax.name) })
          : t(e.summary.tax, { tax: l(market.tax.name) })}{" "}
        {result.reviewedOn ? t(e.summary.reviewedOn, { date: date(result.reviewedOn) }) : e.summary.notReviewed}
      </p>

      {[
        { title: e.summary.included, items: result.included.map(includedLabel) },
        { title: e.summary.exclusions, items: result.exclusions.map((id) => (e.exclusions as Record<string, string>)[id] ?? id) },
        { title: e.summary.assumptions, items: result.assumptions.map((id) => (e.assumptions as Record<string, string>)[id] ?? id) },
      ].map((section, index) => (
        <details key={section.title} className={`accordion border-b border-line-inverse ${index === 0 ? "mt-6 border-t" : ""}`}>
          <summary className="flex items-center justify-between py-4 text-sm">
            {section.title}
            <Plus aria-hidden="true" className="accordion-icon h-4 w-4" />
          </summary>
          <ul className="space-y-1.5 pb-4 text-sm text-ivory/75">
            {section.items.map((item) => (
              <li key={item}>— {item}</li>
            ))}
          </ul>
        </details>
      ))}
    </div>
  );
}
