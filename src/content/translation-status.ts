import type { LanguageCode } from "@/config/markets";

/**
 * Review state of each language's content. "draft" shows a notice on every
 * page in that language. Change to "reviewed" (with reviewer and date) only
 * after a professional translator has checked the text.
 */
export const translationStatus: Record<LanguageCode, { status: "source" | "draft" | "reviewed"; reviewedOn: string | null }> = {
  en: { status: "source", reviewedOn: null },
  ar: { status: "draft", reviewedOn: null },
};
