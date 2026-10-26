"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { AlertCircle, ArrowRight, Check, Copy, Info, LoaderCircle, Mail, X } from "lucide-react";
import {
  budgetRanges,
  contactMethods,
  drawingStatuses,
  emptyInquiry,
  inquiryProjectTypes,
  inquiryToText,
  normaliseInquiry,
  occupancyOptions,
  plotStatuses,
  projectGroup,
  specialistTrades,
  startTimeframes,
  validateInquiry,
  type InquiryErrors,
  type InquiryField,
  type InquiryInput,
} from "@/lib/inquiry";
import { submitInquiry, type SubmitOutcome } from "@/lib/inquiry-client";
import {
  ESTIMATE_HANDOFF_KEY,
  useSearchParam,
  useSessionValue,
  writeSession,
  type EstimateHandoff,
} from "@/hooks/useBrowserValue";

type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "done"; outcome: Exclude<SubmitOutcome, { status: "invalid" }>; text: string };

const intents: Record<string, { title: string; note: string }> = {
  quotation: {
    title: "Request a quotation",
    note: "Share as much detail as you can — a site visit will still be needed for an itemised quotation.",
  },
  consultation: {
    title: "Schedule a consultation",
    note: "Tell us a little about the project and when you are available, and we will propose a time.",
  },
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

export function InquiryForm({
  serviceOptions,
  contactEmail,
}: {
  serviceOptions: { id: string; label: string }[];
  contactEmail: string;
}) {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const inFlight = useRef(false);
  const [values, setValues] = useState<InquiryInput>(emptyInquiry);
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [copied, setCopied] = useState(false);

  const intent = intents[useSearchParam("intent") ?? ""];
  const handoff = parseHandoff(useSessionValue(ESTIMATE_HANDOFF_KEY));
  const group = projectGroup(values.projectType);
  const serviceLabels = Object.fromEntries(serviceOptions.map((option) => [option.id, option.label]));

  const id = (field: InquiryField) => `${uid}-${field}`;
  const describedBy = (field: InquiryField, hint = false) =>
    [hint ? `${id(field)}-hint` : null, errors[field] ? `${id(field)}-error` : null].filter(Boolean).join(" ") ||
    undefined;

  function set<K extends InquiryField>(field: K, value: InquiryInput[K]) {
    const next = { ...values, [field]: value };
    setValues(next);
    // After a failed submit, re-validate live so errors clear as they are fixed.
    if (attempted) setErrors(validateInquiry(next));
  }

  function toggleService(serviceId: string) {
    set(
      "services",
      values.services.includes(serviceId)
        ? values.services.filter((item) => item !== serviceId)
        : [...values.services, serviceId],
    );
  }

  function applyHandoff(data: EstimateHandoff) {
    setValues((current) => ({
      ...current,
      projectType: current.projectType || data.projectType,
      area: current.area || data.area,
      areaUnit: data.areaUnit,
    }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return; // Guards against double clicks and repeated Enter presses.

    const payload = normaliseInquiry({
      ...values,
      estimateSummary: handoff?.summary ?? "",
      description: intent ? `[${intent.title}] ${values.description}` : values.description,
    });
    const found = validateInquiry({ ...payload, description: values.description.trim() });
    setAttempted(true);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    inFlight.current = true;
    setStatus({ state: "submitting" });
    const outcome = await submitInquiry(payload);
    inFlight.current = false;

    if (outcome.status === "invalid") {
      setErrors(outcome.errors);
      setStatus({ state: "idle" });
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setStatus({ state: "done", outcome, text: inquiryToText(payload, serviceLabels) });
    if (outcome.status === "delivered") writeSession(ESTIMATE_HANDOFF_KEY, null);
    requestAnimationFrame(() => document.getElementById(`${uid}-result`)?.focus());
  }

  if (status.state === "done" && status.outcome.status !== "error") {
    const { outcome } = status;
    const delivered = outcome.status === "delivered";
    const mailto = `mailto:${contactEmail}?subject=${encodeURIComponent(
      `Project inquiry — ${values.fullName}`,
    )}&body=${encodeURIComponent(status.text)}`;

    return (
      <div id={`${uid}-result`} tabIndex={-1} role="status" className="bg-paper p-6 outline-none md:p-10">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-orange text-charcoal">
          {delivered ? (
            <Check aria-hidden="true" className="h-5 w-5" />
          ) : (
            <Info aria-hidden="true" className="h-5 w-5" />
          )}
        </span>
        {delivered ? (
          <>
            <h2 className="display-md mt-6">Thank you — your inquiry was received.</h2>
            <p className="mt-4 max-w-xl text-ink-muted">
              Reference <span className="font-mono text-charcoal">{outcome.reference}</span>. We will reply
              using your preferred contact method.
            </p>
          </>
        ) : (
          <>
            <h2 className="display-md mt-6">Your inquiry is ready — but it has not been sent.</h2>
            <p className="mt-4 max-w-xl text-ink-muted">
              Your details passed validation, but this website is not yet connected to an inquiry inbox, so
              nothing has been stored or delivered. To reach us now, send it by email or copy the summary below.
            </p>
          </>
        )}

        <pre className="mt-8 max-h-72 overflow-auto rounded-md border border-line bg-ivory p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap">
          {status.text}
        </pre>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {!delivered && (
            <a href={mailto} className="btn btn-dark">
              <Mail aria-hidden="true" className="h-4 w-4" /> Open in email app
            </a>
          )}
          <button
            type="button"
            className="btn btn-ghost-dark"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(status.text);
                setCopied(true);
              } catch {
                setCopied(false);
              }
            }}
          >
            <Copy aria-hidden="true" className="h-4 w-4" /> {copied ? "Copied" : "Copy summary"}
          </button>
          <button
            type="button"
            className="btn btn-ghost-dark"
            onClick={() => {
              setStatus({ state: "idle" });
              setCopied(false);
            }}
          >
            Edit inquiry
          </button>
        </div>
      </div>
    );
  }

  const errorEntries = Object.entries(errors) as [InquiryField, string][];
  const submitting = status.state === "submitting";

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="space-y-10" aria-busy={submitting}>
      {intent && (
        <div className="border-l-2 border-orange bg-paper px-5 py-4">
          <p className="font-medium">{intent.title}</p>
          <p className="mt-1 text-sm text-ink-muted">{intent.note}</p>
        </div>
      )}

      {handoff && (
        <div className="rounded-md border border-line bg-paper p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow text-orange-ink">Preliminary estimate attached</p>
              <pre className="mt-3 font-sans text-sm leading-relaxed whitespace-pre-wrap text-ink-muted">
                {handoff.summary}
              </pre>
            </div>
            <button
              type="button"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full hover:bg-ivory-deep"
              aria-label="Remove attached estimate"
              onClick={() => writeSession(ESTIMATE_HANDOFF_KEY, null)}
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
          <button type="button" className="link-line mt-3 text-sm font-medium" onClick={() => applyHandoff(handoff)}>
            Use these details in the form
          </button>
        </div>
      )}

      {status.state === "done" && status.outcome.status === "error" && (
        <div role="alert" className="flex gap-3 rounded-md border border-danger/40 bg-danger/5 p-5 text-sm">
          <AlertCircle aria-hidden="true" className="h-5 w-5 shrink-0 text-danger" />
          <div>
            <p className="font-medium">We couldn’t send your inquiry.</p>
            <p className="mt-1 text-ink-muted">
              {status.outcome.message} Your answers are still here — please try again, or email{" "}
              <a className="underline" href={`mailto:${contactEmail}`}>
                {contactEmail}
              </a>
              .
            </p>
          </div>
        </div>
      )}

      {attempted && errorEntries.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-md border border-danger/40 bg-danger/5 p-5 outline-none"
        >
          <p className="font-medium">
            Please fix {errorEntries.length === 1 ? "1 field" : `${errorEntries.length} fields`} to continue:
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            {errorEntries.map(([field, message]) => (
              <li key={field}>
                <a href={`#${id(field)}`} className="underline underline-offset-2">
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Honeypot: hidden from people and assistive technology. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("website")}>Leave this field empty</label>
        <input
          id={id("website")}
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(event) => set("website", event.target.value)}
        />
      </div>

      <fieldset className="grid gap-6 md:grid-cols-2">
        <legend className="eyebrow mb-6 text-ink-muted">01 — About you</legend>
        <Field label="Full name" field="fullName" id={id} errors={errors} required>
          <input
            id={id("fullName")}
            className="field"
            autoComplete="name"
            value={values.fullName}
            onChange={(event) => set("fullName", event.target.value)}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={describedBy("fullName")}
            required
          />
        </Field>
        <Field label="Email address" field="email" id={id} errors={errors} required>
          <input
            id={id("email")}
            type="email"
            className="field"
            autoComplete="email"
            inputMode="email"
            value={values.email}
            onChange={(event) => set("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy("email")}
            required
          />
        </Field>
        <fieldset className="md:col-span-1">
          <legend className="field-label">Preferred contact method</legend>
          <div className="flex flex-wrap gap-2">
            {contactMethods.map((method) => (
              <label key={method.id} className="choice">
                <input
                  type="radio"
                  name="contactMethod"
                  value={method.id}
                  checked={values.contactMethod === method.id}
                  onChange={() => set("contactMethod", method.id)}
                />
                {method.label}
              </label>
            ))}
          </div>
        </fieldset>
        <Field
          label={values.contactMethod === "email" ? "Phone number (optional)" : "Phone number"}
          field="phone"
          id={id}
          errors={errors}
          required={values.contactMethod !== "email"}
        >
          <input
            id={id("phone")}
            type="tel"
            className="field"
            autoComplete="tel"
            inputMode="tel"
            value={values.phone}
            onChange={(event) => set("phone", event.target.value)}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={describedBy("phone")}
            required={values.contactMethod !== "email"}
          />
        </Field>
      </fieldset>

      <fieldset className="grid gap-6 md:grid-cols-2">
        <legend className="eyebrow mb-6 text-ink-muted">02 — Your project</legend>
        <Field label="Project type" field="projectType" id={id} errors={errors} required>
          <select
            id={id("projectType")}
            className="field"
            value={values.projectType}
            onChange={(event) => set("projectType", event.target.value)}
            aria-invalid={Boolean(errors.projectType)}
            aria-describedby={describedBy("projectType")}
            required
          >
            <option value="">Select a project type</option>
            {inquiryProjectTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Project location" field="location" id={id} errors={errors} required>
          <input
            id={id("location")}
            className="field"
            autoComplete="address-level2"
            placeholder="City or area"
            value={values.location}
            onChange={(event) => set("location", event.target.value)}
            aria-invalid={Boolean(errors.location)}
            aria-describedby={describedBy("location")}
            required
          />
        </Field>

        {group === "build" && (
          <>
            <Field label="Plot status" field="plotStatus" id={id} errors={errors}>
              <select
                id={id("plotStatus")}
                className="field"
                value={values.plotStatus}
                onChange={(event) => set("plotStatus", event.target.value)}
              >
                <option value="">Select (optional)</option>
                {plotStatuses.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
            <DrawingsField values={values} set={set} id={id} errors={errors} />
          </>
        )}
        {group === "renovation" && (
          <>
            <Field label="During the work, the property will be" field="occupancy" id={id} errors={errors}>
              <select
                id={id("occupancy")}
                className="field"
                value={values.occupancy}
                onChange={(event) => set("occupancy", event.target.value)}
              >
                <option value="">Select (optional)</option>
                {occupancyOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
            <DrawingsField values={values} set={set} id={id} errors={errors} />
          </>
        )}
        {group === "specialist" && (
          <Field label="Which trade do you need?" field="trade" id={id} errors={errors} required>
            <select
              id={id("trade")}
              className="field"
              value={values.trade}
              onChange={(event) => set("trade", event.target.value)}
              aria-invalid={Boolean(errors.trade)}
              aria-describedby={describedBy("trade")}
              required
            >
              <option value="">Select a trade</option>
              {specialistTrades.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
        )}

        <Field label="Approximate area (optional)" field="area" id={id} errors={errors}>
          <div className="flex gap-2">
            <input
              id={id("area")}
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
              className="field min-w-0 flex-1"
              value={values.area}
              onChange={(event) => set("area", event.target.value)}
              aria-invalid={Boolean(errors.area)}
              aria-describedby={describedBy("area")}
            />
            <select
              aria-label="Area unit"
              className="field !w-24 shrink-0"
              value={values.areaUnit}
              onChange={(event) => set("areaUnit", event.target.value === "sqft" ? "sqft" : "sqm")}
            >
              <option value="sqm">m²</option>
              <option value="sqft">ft²</option>
            </select>
          </div>
        </Field>
        <Field label="Estimated budget (optional)" field="budget" id={id} errors={errors}>
          <select
            id={id("budget")}
            className="field"
            value={values.budget}
            onChange={(event) => set("budget", event.target.value)}
          >
            <option value="">Select a range</option>
            {budgetRanges.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Expected start (optional)" field="start" id={id} errors={errors}>
          <select
            id={id("start")}
            className="field"
            value={values.start}
            onChange={(event) => set("start", event.target.value)}
          >
            <option value="">Select a timeframe</option>
            {startTimeframes.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <fieldset className="md:col-span-2">
          <legend className="field-label">Services you may need (optional)</legend>
          <div className="flex flex-wrap gap-2">
            {serviceOptions.map((option) => (
              <label key={option.id} className="choice">
                <input
                  type="checkbox"
                  checked={values.services.includes(option.id)}
                  onChange={() => toggleService(option.id)}
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="md:col-span-2">
          <Field label="Project description" field="description" id={id} errors={errors} required>
            <textarea
              id={id("description")}
              className="field"
              rows={6}
              maxLength={3000}
              value={values.description}
              onChange={(event) => set("description", event.target.value)}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={describedBy("description", true)}
              required
            />
          </Field>
          <p id={`${id("description")}-hint`} className="mt-2 text-xs text-ink-muted">
            What would you like to build or change? Include anything important — timing, constraints, inspiration.
            ({values.description.trim().length}/3000)
          </p>
        </div>
      </fieldset>

      <div className="space-y-5 border-t border-line pt-8">
        <label className="flex cursor-pointer items-start gap-3 text-sm">
          <input
            type="checkbox"
            className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-orange)]"
            checked={values.consent}
            onChange={(event) => set("consent", event.target.checked)}
          />
          <span>
            Optional: I’d like to receive occasional follow-up about my project and relevant updates. You can opt out
            at any time.
          </span>
        </label>
        <p className="text-xs leading-relaxed text-ink-muted">
          We use the details you share only to respond to this inquiry. Read our{" "}
          <Link href="/privacy" className="underline underline-offset-2">
            privacy policy
          </Link>{" "}
          for how information is handled.
        </p>
        <button type="submit" className="btn btn-dark w-full sm:w-auto" disabled={submitting}>
          {submitting ? (
            <>
              <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" /> Sending…
            </>
          ) : (
            <>
              Send inquiry <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  field,
  id,
  errors,
  required = false,
  children,
}: {
  label: string;
  field: InquiryField;
  id: (field: InquiryField) => string;
  errors: InquiryErrors;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id(field)} className="field-label">
        {label}
        {required && (
          <span aria-hidden="true" className="text-orange-ink">
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {errors[field] && (
        <p id={`${id(field)}-error`} className="mt-2 text-sm text-danger">
          {errors[field]}
        </p>
      )}
    </div>
  );
}

function DrawingsField({
  values,
  set,
  id,
  errors,
}: {
  values: InquiryInput;
  set: <K extends InquiryField>(field: K, value: InquiryInput[K]) => void;
  id: (field: InquiryField) => string;
  errors: InquiryErrors;
}) {
  return (
    <Field label="Existing drawings" field="drawings" id={id} errors={errors}>
      <select
        id={id("drawings")}
        className="field"
        value={values.drawings}
        onChange={(event) => set("drawings", event.target.value)}
      >
        <option value="">Select (optional)</option>
        {drawingStatuses.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}
