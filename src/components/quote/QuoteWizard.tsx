"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  FileText,
  Info,
  LoaderCircle,
  Mail,
  Paperclip,
  X,
} from "lucide-react";
import {
  STEPS,
  applicableFields,
  budgetFallbacks,
  contactChannels,
  emptyQuote,
  errorsForStep,
  normaliseQuote,
  quoteProjectTypes,
  quoteToText,
  siteConditions,
  siteTypes,
  startTimeframes,
  stepFields,
  validateQuote,
  workTypes,
  type QuoteContext,
  type QuoteError,
  type QuoteErrors,
  type QuoteField,
  type QuoteInput,
  type StepId,
} from "@/lib/quote";
import { submitQuote, type SubmitOutcome } from "@/lib/quote-client";
import { convertArea, formatMoney, type AreaUnit } from "@/lib/estimate";
import { mailtoLink } from "@/lib/contact";
import { ESTIMATE_HANDOFF_KEY, useSearchParam, useSessionValue, writeSession, type EstimateHandoff } from "@/hooks/useBrowserValue";
import { useI18n } from "@/i18n/client";
import type { ClientDictionary } from "@/i18n/dictionaries";

type Option = { id: string; label: string };

type Props = {
  serviceOptions: Option[];
  materialOptions: Option[];
};

function parseHandoff(raw: string | null): EstimateHandoff | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as EstimateHandoff;
    return typeof value.summary === "string" ? value : null;
  } catch {
    return null;
  }
}

/**
 * Reads prefill values (URL and estimator handoff) once they are available on
 * the client, then mounts the form with them as its initial state. Keying the
 * form by its prefill means server HTML and hydration match, and the form only
 * re-initialises if the visitor arrives with different prefill values.
 */
export function QuoteWizard(props: Props) {
  const intent = useSearchParam("intent");
  const type = useSearchParam("type");
  const service = useSearchParam("service");
  const region = useSearchParam("region");
  const handoff = parseHandoff(useSessionValue(ESTIMATE_HANDOFF_KEY));
  const key = [intent, type, service, region, handoff?.summary].join("|");
  return (
    <QuoteForm
      key={key}
      {...props}
      prefill={{ intent: intent === "consultation" ? "consultation" : "quote", type, service, region, handoff }}
    />
  );
}

type Status =
  | { state: "editing" }
  | { state: "submitting" }
  | { state: "done"; outcome: Exclude<SubmitOutcome, { status: "invalid" }>; text: string };

type DocumentEntry = { name: string; size: number; error: string | null };

function QuoteForm({
  serviceOptions,
  materialOptions,
  prefill,
}: Props & {
  prefill: {
    intent: "quote" | "consultation";
    type: string | null;
    service: string | null;
    region: string | null;
    handoff: EstimateHandoff | null;
  };
}) {
  const { dict, market, l, t, p, tag, href } = useI18n();
  const q = dict.quote;
  const uid = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const inFlight = useRef(false);
  const idempotencyKey = useRef<string | null>(null);

  const regionIds = market.regions.map((item) => item.id);
  const context: QuoteContext = {
    markets: [market.id],
    regions: { [market.id]: regionIds },
    budgets: { [market.id]: market.quotation.budgetRanges.map((range) => range.id) },
    serviceCategories: serviceOptions.map((option) => option.id),
    materials: materialOptions.map((option) => option.id),
  };

  const [values, setValues] = useState<QuoteInput>(() => {
    const { handoff } = prefill;
    const typeFromService = quoteProjectTypes.find((item) => item.category === prefill.service)?.id;
    const projectType =
      [prefill.type, handoff?.projectType, typeFromService].find(
        (candidate) => candidate && quoteProjectTypes.some((item) => item.id === candidate),
      ) ?? "";
    const services = [prefill.service].filter(
      (slug): slug is string => Boolean(slug) && serviceOptions.some((option) => option.id === slug),
    );
    return {
      ...emptyQuote,
      intent: prefill.intent,
      market: market.id,
      projectType,
      services,
      region: [prefill.region, handoff?.region].find((id) => id && regionIds.includes(id)) ?? "",
      area: handoff?.area ?? "",
      areaUnit: handoff?.areaUnit ?? market.units.defaultArea,
      floors: handoff?.floors ?? "",
    };
  });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [status, setStatus] = useState<Status>({ state: "editing" });
  const [documents, setDocuments] = useState<DocumentEntry[]>([]);
  const [documentsError, setDocumentsError] = useState<string | null>(null);
  const [estimateAttached, setEstimateAttached] = useState(Boolean(prefill.handoff));
  const [copied, setCopied] = useState(false);

  const stepId: StepId = STEPS[step];
  const applies = applicableFields(values.projectType);
  const id = (field: string) => `${uid}-${field}`;

  // ── Labels ──────────────────────────────────────────────────────────────
  const money = (value: number) => formatMoney(value, market.currency.code, tag, market.currency.fractionDigits);
  const budgetLabel = (budgetId: string) => {
    if (budgetId === "advice") return q.budget.advice;
    if (budgetId === "prefer-not") return q.budget.preferNot;
    const range = market.quotation.budgetRanges.find((item) => item.id === budgetId);
    if (!range) return budgetId;
    if (range.min === null && range.max !== null) return t(q.budget.under, { max: money(range.max) });
    if (range.max === null && range.min !== null) return t(q.budget.over, { min: money(range.min) });
    return t(q.budget.between, { min: money(range.min ?? 0), max: money(range.max ?? 0) });
  };
  const regionLabel = (regionId: string) => {
    const match = market.regions.find((item) => item.id === regionId);
    return match ? l(match.name) : regionId;
  };
  const optionLabel = (options: Option[], optionId: string) => options.find((option) => option.id === optionId)?.label ?? optionId;
  const valueLabel = (field: QuoteField, value: string): string => {
    if (!value) return "";
    switch (field) {
      case "projectType":
        return (q.projectTypes as Record<string, string>)[value] ?? value;
      case "region":
        return regionLabel(value);
      case "siteType":
        return (q.location.siteTypes as Record<string, string>)[value] ?? value;
      case "workType":
        return (q.details.workTypes as Record<string, string>)[value] ?? value;
      case "start":
        return (q.details.starts as Record<string, string>)[value] ?? value;
      case "condition":
        return (q.details.conditions as Record<string, string>)[value] ?? value;
      case "budget":
        return budgetLabel(value);
      case "contactMethod":
        return (q.contact.methods as Record<string, string>)[value] ?? value;
      case "services":
        return optionLabel(serviceOptions, value);
      case "materials":
        return optionLabel(materialOptions, value);
      case "areaUnit":
        return dict.units[value as AreaUnit];
      default:
        return value;
    }
  };
  const heading = (field: QuoteField) => (q.headings as Record<string, string>)[field] ?? field;
  const errorText = (error: QuoteError | undefined) =>
    error ? t((dict.errors as Record<string, string>)[error.code] ?? dict.errors.invalid, error.values) : undefined;

  // ── State helpers ───────────────────────────────────────────────────────
  function set<K extends QuoteField>(field: K, value: QuoteInput[K]) {
    const next = { ...values, [field]: value };
    setValues(next);
    // Once a step has shown errors, re-check it live so messages clear as they are fixed.
    if (Object.keys(errors).length > 0) setErrors(errorsForStep(validateQuote(next, context), stepId));
  }

  function toggle(field: "services" | "materials", optionId: string) {
    const list = values[field];
    set(field, list.includes(optionId) ? list.filter((item) => item !== optionId) : [...list, optionId]);
  }

  function changeUnit(unit: AreaUnit) {
    const area = Number(values.area);
    const converted = values.area.trim() !== "" && Number.isFinite(area) && area > 0 ? String(convertArea(area, values.areaUnit, unit)) : values.area;
    setValues({ ...values, areaUnit: unit, area: converted });
  }

  function goTo(index: number) {
    setErrors({});
    setStep(index);
    requestAnimationFrame(() => {
      headingRef.current?.focus({ preventScroll: true });
      headingRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "center",
      });
    });
  }

  function next() {
    const found = errorsForStep(validateQuote(values, context), stepId);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    goTo(step + 1);
  }

  function addDocuments(fileList: FileList | null) {
    if (!fileList) return;
    const { maxFiles, maxFileSizeMb, acceptedExtensions } = market.uploads;
    const incoming = Array.from(fileList).map((file) => {
      const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
      let error: string | null = null;
      if (!acceptedExtensions.includes(extension)) error = t(q.documents.typeError, { name: file.name });
      else if (file.size > maxFileSizeMb * 1024 * 1024) error = t(q.documents.sizeError, { name: file.name, size: maxFileSizeMb });
      return { name: file.name, size: file.size, error };
    });
    const combined = [...documents, ...incoming];
    setDocumentsError(combined.length > maxFiles ? t(q.documents.countError, { files: p(dict.plurals.file, maxFiles) }) : null);
    setDocuments(combined.slice(0, maxFiles));
  }

  async function submit() {
    if (inFlight.current) return; // Guards against double clicks and repeated Enter presses.
    const payload = normaliseQuote({
      ...values,
      estimateSummary: estimateAttached ? (prefill.handoff?.summary ?? "") : "",
    });
    const all = validateQuote(payload, context);
    const firstInvalid = STEPS.findIndex((stepName) => Object.keys(errorsForStep(all, stepName)).length > 0);
    if (firstInvalid !== -1) {
      setStep(firstInvalid);
      setErrors(errorsForStep(all, STEPS[firstInvalid]));
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    inFlight.current = true;
    idempotencyKey.current ??= crypto.randomUUID();
    setStatus({ state: "submitting" });
    const outcome = await submitQuote(payload, idempotencyKey.current);
    inFlight.current = false;

    if (outcome.status === "invalid") {
      const index = STEPS.findIndex((stepName) => Object.keys(errorsForStep(outcome.errors, stepName)).length > 0);
      setStatus({ state: "editing" });
      setStep(Math.max(0, index));
      setErrors(errorsForStep(outcome.errors, STEPS[Math.max(0, index)]));
      return;
    }
    setStatus({ state: "done", outcome, text: quoteToText(payload, valueLabel, heading) });
    if (outcome.status === "delivered") {
      writeSession(ESTIMATE_HANDOFF_KEY, null);
      idempotencyKey.current = null;
    }
    requestAnimationFrame(() => document.getElementById(id("result"))?.focus());
  }

  // ── Result screens ──────────────────────────────────────────────────────
  if (status.state === "done" && status.outcome.status !== "error") {
    const { outcome, text } = status;
    const delivered = outcome.status === "delivered";
    const mailto = mailtoLink(market.contact.email, t(q.result.emailSubject, { name: values.fullName }), text);
    return (
      <div id={id("result")} tabIndex={-1} role="status" className="bg-paper p-6 outline-none md:p-10">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-orange text-charcoal">
          {delivered ? <Check aria-hidden="true" className="h-5 w-5" /> : <Info aria-hidden="true" className="h-5 w-5" />}
        </span>
        <h2 className="display-md mt-6">{delivered ? q.result.deliveredTitle : q.result.demoTitle}</h2>
        <p className="mt-4 max-w-xl text-ink-muted">
          {delivered ? t(q.result.deliveredBody, { reference: outcome.reference }) : q.result.demoBody}
        </p>
        <pre dir="auto" className="mt-8 max-h-72 overflow-auto rounded-md border border-line bg-ivory p-4 font-sans text-xs leading-relaxed whitespace-pre-wrap">
          {text}
        </pre>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {!delivered && mailto && (
            <a href={mailto} className="btn btn-dark">
              <Mail aria-hidden="true" className="h-4 w-4" /> {q.result.openEmail}
            </a>
          )}
          <button
            type="button"
            className="btn btn-ghost-dark"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(text);
                setCopied(true);
              } catch {
                setCopied(false);
              }
            }}
          >
            <Copy aria-hidden="true" className="h-4 w-4" /> {copied ? q.result.copied : q.result.copy}
          </button>
          <button
            type="button"
            className="btn btn-ghost-dark"
            onClick={() => {
              setStatus({ state: "editing" });
              setCopied(false);
              goTo(STEPS.length - 1);
            }}
          >
            {q.result.edit}
          </button>
        </div>
      </div>
    );
  }

  const submitting = status.state === "submitting";
  const errorEntries = Object.entries(errors) as [QuoteField, QuoteError][];
  const described = (field: QuoteField, hint = false) =>
    [hint ? id(`${field}-hint`) : null, errors[field] ? id(`${field}-error`) : null].filter(Boolean).join(" ") || undefined;
  const fieldProps = (field: QuoteField) => ({
    fieldId: id(field),
    hintId: id(`${field}-hint`),
    errorId: id(`${field}-error`),
    error: errorText(errors[field]),
    optionalLabel: q.optional,
  });

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-12">
      {/* Step indicator */}
      <nav aria-label={q.progress} className="lg:col-span-3">
        <ol className="no-scrollbar -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] lg:mx-0 lg:flex-col lg:gap-0 lg:px-0">
          {q.steps.map((name, index) => {
            const current = index === step;
            const reachable = index < step;
            return (
              <li key={name} className="shrink-0 lg:border-b lg:border-line">
                <button
                  type="button"
                  disabled={!reachable || submitting}
                  onClick={() => goTo(index)}
                  aria-current={current ? "step" : undefined}
                  className={`flex min-h-11 w-full items-center gap-3 rounded-full border px-4 text-start text-sm whitespace-nowrap lg:rounded-none lg:border-0 lg:px-0 lg:py-3 ${
                    current
                      ? "border-charcoal bg-charcoal text-ivory lg:bg-transparent lg:text-charcoal lg:font-medium"
                      : reachable
                        ? "border-line text-charcoal hover:border-charcoal"
                        : "border-line text-ink-muted disabled:cursor-default"
                  }`}
                >
                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs ${index < step ? "bg-orange text-charcoal" : current ? "lg:bg-charcoal lg:text-ivory" : "border border-line"}`}>
                    {index < step ? <Check aria-hidden="true" className="h-3.5 w-3.5" /> : index + 1}
                  </span>
                  {name}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <form
        noValidate
        aria-busy={submitting}
        className="lg:col-span-9"
        onSubmit={(event) => {
          event.preventDefault();
          if (stepId === "review") submit();
          else next();
        }}
      >
        {values.intent === "consultation" && step === 0 && (
          <div className="mb-8 border-s-2 border-orange bg-paper px-5 py-4">
            <p className="font-medium">{q.consultation.title}</p>
            <p className="mt-1 text-sm text-ink-muted">{q.consultation.note}</p>
          </div>
        )}

        <p className="eyebrow text-ink-muted">{t(q.stepOf, { n: step + 1, total: STEPS.length })}</p>
        <h2 ref={headingRef} tabIndex={-1} className="display-md mt-2 outline-none" aria-live="polite">
          {stepHeading(stepId, q)}
        </h2>

        {status.state === "done" && status.outcome.status === "error" && (
          <div role="alert" className="mt-6 flex gap-3 rounded-md border border-danger/40 bg-danger/5 p-5 text-sm">
            <AlertCircle aria-hidden="true" className="h-5 w-5 shrink-0 text-danger" />
            <div>
              <p className="font-medium">{q.result.errorTitle}</p>
              <p className="mt-1 text-ink-muted">
                {t(q.result.errorBody, {
                  message: { "rate-limited": q.result.rateLimited, timeout: q.result.timeout, network: q.result.network, server: q.result.server }[
                    status.outcome.reason
                  ],
                  email: market.contact.email ?? "",
                })}
              </p>
            </div>
          </div>
        )}

        {errorEntries.length > 0 && (
          <div ref={summaryRef} tabIndex={-1} role="alert" className="mt-6 rounded-md border border-danger/40 bg-danger/5 p-5 outline-none">
            <p className="font-medium">
              {t(q.result.fixFields, { fields: p(dict.plurals.field, errorEntries.length) })}
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              {errorEntries.map(([field, error]) => (
                <li key={field}>
                  <a href={`#${id(field)}`} className="underline underline-offset-2">
                    {heading(field)}: {errorText(error)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Honeypot: hidden from people and assistive technology. */}
        <div aria-hidden="true" className="absolute -start-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={id("website")}>Leave this field empty</label>
          <input id={id("website")} tabIndex={-1} autoComplete="off" value={values.website} onChange={(event) => set("website", event.target.value)} />
        </div>

        <div className="mt-8 space-y-8">
          {stepId === "type" && (
            <fieldset>
              <legend className="sr-only">{q.type.heading}</legend>
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3" id={id("projectType")}>
                {quoteProjectTypes.map((type) => (
                  <label key={type.id} className="choice !rounded-md !px-4 !py-3">
                    <input
                      type="radio"
                      name="projectType"
                      value={type.id}
                      checked={values.projectType === type.id}
                      onChange={() => set("projectType", type.id)}
                      aria-describedby={described("projectType")}
                    />
                    {(q.projectTypes as Record<string, string>)[type.id]}
                  </label>
                ))}
              </div>
              {errors.projectType && (
                <p id={id("projectType-error")} className="mt-2 text-sm text-danger">
                  {errorText(errors.projectType)}
                </p>
              )}
            </fieldset>
          )}

          {stepId === "location" && (
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="field-label">{q.location.country}</p>
                <p className="field flex items-center bg-ivory-deep">{l(market.name)}</p>
              </div>
              <FieldShell {...fieldProps("region")} label={l(market.regionLabel)} required hint={q.location.coverage}>
                <select
                  id={id("region")}
                  className="field"
                  value={values.region}
                  onChange={(event) => set("region", event.target.value)}
                  aria-invalid={Boolean(errors.region)}
                  aria-describedby={described("region", true)}
                  required
                >
                  <option value="">{q.location.regionPlaceholder}</option>
                  {market.regions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {l(item.name)}
                    </option>
                  ))}
                </select>
              </FieldShell>
              <FieldShell {...fieldProps("cityArea")} label={q.location.cityArea} hint={q.location.cityAreaHint}>
                <input
                  id={id("cityArea")}
                  className="field"
                  autoComplete="address-level2"
                  maxLength={120}
                  value={values.cityArea}
                  onChange={(event) => set("cityArea", event.target.value)}
                  aria-invalid={Boolean(errors.cityArea)}
                  aria-describedby={described("cityArea", true)}
                />
              </FieldShell>
              {applies.siteType && (
                <FieldShell {...fieldProps("siteType")} label={q.location.siteType}>
                  <select id={id("siteType")} className="field" value={values.siteType} onChange={(event) => set("siteType", event.target.value)}>
                    <option value="">{q.select}</option>
                    {siteTypes.map((item) => (
                      <option key={item} value={item}>
                        {valueLabel("siteType", item)}
                      </option>
                    ))}
                  </select>
                </FieldShell>
              )}
            </div>
          )}

          {stepId === "details" && (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                <FieldShell {...fieldProps("area")} label={q.details.area}>
                  <div className="flex gap-2">
                    <input
                      id={id("area")}
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step="any"
                      dir="ltr"
                      className="field min-w-0 flex-1 text-start"
                      value={values.area}
                      onChange={(event) => set("area", event.target.value)}
                      aria-invalid={Boolean(errors.area)}
                      aria-describedby={described("area")}
                    />
                    <select
                      aria-label={dict.estimator.labels.unit}
                      className="field !w-28 shrink-0"
                      value={values.areaUnit}
                      onChange={(event) => changeUnit(event.target.value === "sqm" ? "sqm" : "sqft")}
                    >
                      {market.units.area.map((unit) => (
                        <option key={unit} value={unit}>
                          {dict.units[unit]}
                        </option>
                      ))}
                    </select>
                  </div>
                </FieldShell>
                {applies.floors && (
                  <FieldShell {...fieldProps("floors")} label={q.details.floors}>
                    <input
                      id={id("floors")}
                      type="number"
                      inputMode="numeric"
                      min={1}
                      step={1}
                      dir="ltr"
                      className="field text-start"
                      value={values.floors}
                      onChange={(event) => set("floors", event.target.value)}
                      aria-invalid={Boolean(errors.floors)}
                      aria-describedby={described("floors")}
                    />
                  </FieldShell>
                )}
                {applies.workType && (
                  <FieldShell {...fieldProps("workType")} label={q.details.workType}>
                    <select id={id("workType")} className="field" value={values.workType} onChange={(event) => set("workType", event.target.value)}>
                      <option value="">{q.select}</option>
                      {workTypes.map((item) => (
                        <option key={item} value={item}>
                          {valueLabel("workType", item)}
                        </option>
                      ))}
                    </select>
                  </FieldShell>
                )}
                <FieldShell {...fieldProps("start")} label={q.details.start}>
                  <select id={id("start")} className="field" value={values.start} onChange={(event) => set("start", event.target.value)}>
                    <option value="">{q.select}</option>
                    {startTimeframes.map((item) => (
                      <option key={item} value={item}>
                        {valueLabel("start", item)}
                      </option>
                    ))}
                  </select>
                </FieldShell>
                {applies.condition && (
                  <FieldShell {...fieldProps("condition")} label={q.details.condition}>
                    <select id={id("condition")} className="field" value={values.condition} onChange={(event) => set("condition", event.target.value)}>
                      <option value="">{q.select}</option>
                      {siteConditions.map((item) => (
                        <option key={item} value={item}>
                          {valueLabel("condition", item)}
                        </option>
                      ))}
                    </select>
                  </FieldShell>
                )}
              </div>
              <fieldset>
                <legend className="field-label">
                  {q.details.services} <span className="normal-case">({q.optional})</span>
                </legend>
                <div className="flex flex-wrap gap-2" id={id("services")}>
                  {serviceOptions.map((option) => (
                    <label key={option.id} className="choice">
                      <input type="checkbox" checked={values.services.includes(option.id)} onChange={() => toggle("services", option.id)} />
                      {option.label}
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="field-label">
                  {q.details.materials} <span className="normal-case">({q.optional})</span>
                </legend>
                <div className="flex flex-wrap gap-2" id={id("materials")}>
                  {materialOptions.map((option) => (
                    <label key={option.id} className="choice">
                      <input type="checkbox" checked={values.materials.includes(option.id)} onChange={() => toggle("materials", option.id)} />
                      {option.label}
                    </label>
                  ))}
                </div>
              </fieldset>
              <FieldShell {...fieldProps("requirements")} label={q.details.requirements} hint={q.details.requirementsHint}>
                <textarea
                  id={id("requirements")}
                  className="field"
                  rows={5}
                  maxLength={3000}
                  value={values.requirements}
                  onChange={(event) => set("requirements", event.target.value)}
                  aria-invalid={Boolean(errors.requirements)}
                  aria-describedby={described("requirements", true)}
                />
              </FieldShell>
            </>
          )}

          {stepId === "budget" && (
            <fieldset>
              <legend className="text-ink-muted">{t(q.budget.intro, { currency: market.currency.code })}</legend>
              <div className="mt-4 grid gap-2 sm:grid-cols-2" id={id("budget")}>
                {[...market.quotation.budgetRanges.map((range) => range.id), ...budgetFallbacks].map((budgetId) => (
                  <label key={budgetId} className="choice !rounded-md !px-4 !py-3">
                    <input
                      type="radio"
                      name="budget"
                      value={budgetId}
                      checked={values.budget === budgetId}
                      onChange={() => set("budget", budgetId)}
                      aria-describedby={described("budget")}
                    />
                    {budgetLabel(budgetId)}
                  </label>
                ))}
              </div>
              {errors.budget && (
                <p id={id("budget-error")} className="mt-2 text-sm text-danger">
                  {errorText(errors.budget)}
                </p>
              )}
              <p className="mt-5 text-sm">
                <Link href={href("/estimate")} target="_blank" className="link-line font-medium">
                  {q.budget.estimator}
                </Link>{" "}
                <span className="sr-only">{dict.common.opensNewTab}</span>
              </p>
            </fieldset>
          )}

          {stepId === "documents" && (
            <div>
              <p className="text-ink-muted">{q.documents.intro}</p>
              <p role="note" className="mt-5 flex gap-3 border-s-2 border-orange bg-paper px-5 py-4 text-sm leading-relaxed">
                <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-orange-ink" />
                {q.documents.notConnected}
              </p>
              <label className="btn btn-ghost-dark mt-6 cursor-pointer has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-orange">
                <Paperclip aria-hidden="true" className="h-4 w-4" />
                {q.documents.choose}
                <input
                  type="file"
                  multiple
                  accept={market.uploads.acceptedExtensions.join(",")}
                  className="sr-only"
                  aria-describedby={id("documents-hint")}
                  onChange={(event) => {
                    addDocuments(event.target.files);
                    event.target.value = "";
                  }}
                />
              </label>
              <p id={id("documents-hint")} className="mt-3 text-xs text-ink-muted">
                {t(q.documents.formats, {
                  formats: market.uploads.acceptedExtensions.join(", "),
                  files: p(dict.plurals.file, market.uploads.maxFiles),
                  size: market.uploads.maxFileSizeMb,
                })}
              </p>
              {documentsError && (
                <p role="alert" className="mt-3 text-sm text-danger">
                  {documentsError}
                </p>
              )}
              {documents.length > 0 && (
                <ul className="mt-6 divide-y divide-line border-y border-line" aria-label={q.documents.selected}>
                  {documents.map((doc, index) => (
                    <li key={`${doc.name}-${index}`} className="flex items-center justify-between gap-4 py-3 text-sm">
                      <span className="flex min-w-0 items-start gap-3">
                        <FileText aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted" />
                        <span className="min-w-0">
                          <span className="block truncate" dir="auto">
                            {doc.name}
                          </span>
                          <span className={`block text-xs ${doc.error ? "text-danger" : "text-ink-muted"}`}>
                            {doc.error ?? `${formatSize(doc.size)} · ${q.documents.notSent}`}
                          </span>
                        </span>
                      </span>
                      <button
                        type="button"
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-full hover:bg-ivory-deep"
                        aria-label={t(q.documents.remove, { name: doc.name })}
                        onClick={() => setDocuments(documents.filter((_, i) => i !== index))}
                      >
                        <X aria-hidden="true" className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {stepId === "contact" && (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                <FieldShell {...fieldProps("fullName")} label={q.contact.fullName} required>
                  <input
                    id={id("fullName")}
                    className="field"
                    autoComplete="name"
                    value={values.fullName}
                    onChange={(event) => set("fullName", event.target.value)}
                    aria-invalid={Boolean(errors.fullName)}
                    aria-describedby={described("fullName")}
                    required
                  />
                </FieldShell>
                <FieldShell {...fieldProps("email")} label={q.contact.email} required>
                  <input
                    id={id("email")}
                    type="email"
                    dir="ltr"
                    className="field text-start"
                    autoComplete="email"
                    inputMode="email"
                    value={values.email}
                    onChange={(event) => set("email", event.target.value)}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={described("email")}
                    required
                  />
                </FieldShell>
                <fieldset>
                  <legend className="field-label">{q.contact.method}</legend>
                  <div className="flex flex-wrap gap-2" id={id("contactMethod")}>
                    {contactChannels.map((channel) => (
                      <label key={channel} className="choice">
                        <input
                          type="radio"
                          name="contactMethod"
                          value={channel}
                          checked={values.contactMethod === channel}
                          onChange={() => set("contactMethod", channel)}
                        />
                        {valueLabel("contactMethod", channel)}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <FieldShell
                  {...fieldProps("phone")}
                  label={q.contact.phone}
                  required={values.contactMethod !== "email" || values.whatsappOptIn}
                  hint={t(q.contact.phoneHint, { example: market.contact.phoneHint })}
                >
                  <input
                    id={id("phone")}
                    type="tel"
                    dir="ltr"
                    className="field text-start"
                    autoComplete="tel"
                    inputMode="tel"
                    value={values.phone}
                    onChange={(event) => set("phone", event.target.value)}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={described("phone", true)}
                  />
                </FieldShell>
              </div>
              {values.contactMethod !== "whatsapp" && (
                <label className="flex cursor-pointer items-start gap-3 text-sm">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-orange)]"
                    checked={values.whatsappOptIn}
                    onChange={(event) => set("whatsappOptIn", event.target.checked)}
                  />
                  {q.contact.whatsappOptIn}
                </label>
              )}
              <FieldShell {...fieldProps("notes")} label={q.contact.notes}>
                <textarea
                  id={id("notes")}
                  className="field"
                  rows={4}
                  maxLength={2000}
                  value={values.notes}
                  onChange={(event) => set("notes", event.target.value)}
                  aria-invalid={Boolean(errors.notes)}
                  aria-describedby={described("notes")}
                />
              </FieldShell>
              <div className="space-y-4 border-t border-line pt-6">
                <label className="flex cursor-pointer items-start gap-3 text-sm" id={id("consent")}>
                  <input
                    type="checkbox"
                    className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-orange)]"
                    checked={values.consent}
                    onChange={(event) => set("consent", event.target.checked)}
                    aria-invalid={Boolean(errors.consent)}
                    aria-describedby={described("consent")}
                    required
                  />
                  <span>
                    {q.contact.consent.split("{link}")[0]}
                    <Link href={href("/privacy")} className="underline underline-offset-2" target="_blank">
                      {q.contact.consentLink}
                    </Link>
                    {q.contact.consent.split("{link}")[1]}
                    <span aria-hidden="true" className="text-orange-ink"> *</span>
                  </span>
                </label>
                {errors.consent && (
                  <p id={id("consent-error")} className="text-sm text-danger">
                    {errorText(errors.consent)}
                  </p>
                )}
                <label className="flex cursor-pointer items-start gap-3 text-sm">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-orange)]"
                    checked={values.marketingConsent}
                    onChange={(event) => set("marketingConsent", event.target.checked)}
                  />
                  {q.contact.marketing}
                </label>
                <p className="text-xs leading-relaxed text-ink-muted">{q.contact.privacyNote}</p>
              </div>
            </>
          )}

          {stepId === "review" && (
            <div className="space-y-8">
              <p className="text-ink-muted">{q.review.intro}</p>
              {estimateAttached && prefill.handoff && (
                <div className="rounded-md border border-line bg-paper p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="eyebrow text-orange-ink">{q.review.estimate}</p>
                      <pre dir="auto" className="mt-3 font-sans text-sm leading-relaxed whitespace-pre-wrap text-ink-muted">
                        {prefill.handoff.summary}
                      </pre>
                    </div>
                    <button
                      type="button"
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-full hover:bg-ivory-deep"
                      aria-label={q.review.removeEstimate}
                      onClick={() => setEstimateAttached(false)}
                    >
                      <X aria-hidden="true" className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
              {STEPS.slice(0, -1).map((name, index) => {
                const fields = stepFields[name].filter((field) => field !== "consent");
                const rows =
                  name === "documents"
                    ? [[q.steps[index], documents.length > 0 ? t(q.review.documents, { documents: p(dict.plurals.document, documents.length) }) : q.review.noDocuments]]
                    : fields
                        .map((field) => {
                          const raw = values[field];
                          const text = Array.isArray(raw)
                            ? raw.map((item) => valueLabel(field, item)).join(", ")
                            : field === "area" && raw
                              ? `${raw} ${dict.units[values.areaUnit]}`
                              : typeof raw === "string"
                                ? valueLabel(field, raw)
                                : "";
                          return [heading(field), text];
                        })
                        .filter(([, text]) => text);
                return (
                  <section key={name} className="border-t border-line pt-5">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="eyebrow text-ink-muted">
                        {index + 1}. {q.steps[index]}
                      </h3>
                      <button type="button" className="link-line text-sm font-medium" onClick={() => goTo(index)}>
                        {q.edit}
                      </button>
                    </div>
                    <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                      {rows.map(([term, detail]) => (
                        <div key={term}>
                          <dt className="text-ink-muted">{term}</dt>
                          <dd dir="auto" className="break-words">
                            {detail}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </section>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-between">
          {step > 0 ? (
            <button type="button" className="btn btn-ghost-dark" onClick={() => goTo(step - 1)} disabled={submitting}>
              <ArrowLeft aria-hidden="true" className="icon-dir h-4 w-4" /> {q.back}
            </button>
          ) : (
            <span />
          )}
          <button type="submit" className="btn btn-dark" disabled={submitting}>
            {stepId === "review" ? (
              submitting ? (
                <>
                  <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" /> {q.submitting}
                </>
              ) : (
                <>
                  {q.submit} <ArrowRight aria-hidden="true" className="icon-dir h-4 w-4" />
                </>
              )
            ) : (
              <>
                {q.continue} <ArrowRight aria-hidden="true" className="icon-dir h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

/** Label, hint and error around a form control. Defined at module level so inputs keep focus between renders. */
function FieldShell({
  fieldId,
  hintId,
  errorId,
  error,
  optionalLabel,
  label,
  required = false,
  hint,
  children,
}: {
  fieldId: string;
  hintId: string;
  errorId: string;
  error?: string;
  optionalLabel: string;
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={fieldId} className="field-label">
        {label}
        {required ? (
          <span aria-hidden="true" className="text-orange-ink">
            {" "}
            *
          </span>
        ) : (
          <span className="normal-case"> ({optionalLabel})</span>
        )}
      </label>
      {children}
      {hint && (
        <p id={hintId} className="mt-2 text-xs text-ink-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function stepHeading(step: StepId, q: ClientDictionary["quote"]) {
  const headings: Record<StepId, string> = {
    type: q.type.heading,
    location: q.location.heading,
    details: q.details.heading,
    budget: q.budget.heading,
    documents: q.documents.heading,
    contact: q.contact.heading,
    review: q.review.heading,
  };
  return headings[step];
}
