/** Fills {placeholders} in a dictionary string. Unknown placeholders are left as-is. */
export function format(template: string, values: Record<string, string | number> = {}) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

/** Grammatical forms of a counted noun, keyed by CLDR plural category. `other` is required. */
export type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };

/** Types a dictionary entry as plural forms (so languages may supply different categories). */
export const forms = (value: PluralForms) => value;

/**
 * Picks the right form for a count using the language's plural rules —
 * Arabic, for example, distinguishes 1, 2, 3–10 and 11+.
 */
export function plural(value: PluralForms, count: number, localeTag: string) {
  const category = new Intl.PluralRules(localeTag).select(count);
  return format(value[category] ?? value.other, { count });
}
