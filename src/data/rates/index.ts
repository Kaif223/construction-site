import type { RateTable } from "../../lib/estimate";
import { aeExampleRates } from "./ae-example.ts";

/** Rate tables by id. A market references one via `rateTable` in its config. */
export const rateTables: Record<string, RateTable> = {
  [aeExampleRates.id]: aeExampleRates,
};

export function getRateTable(id: string | null) {
  return id ? (rateTables[id] ?? null) : null;
}
