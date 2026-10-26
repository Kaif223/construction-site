"use client";

import { useSyncExternalStore } from "react";

const STORAGE_EVENT = "construkt:storage";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(STORAGE_EVENT, callback);
  window.addEventListener("popstate", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(STORAGE_EVENT, callback);
    window.removeEventListener("popstate", callback);
  };
}

/** Storage can throw (private mode, blocked cookies) — treat that as empty. */
export function readSession(key: string) {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeSession(key: string, value: string | null) {
  try {
    if (value === null) window.sessionStorage.removeItem(key);
    else window.sessionStorage.setItem(key, value);
  } catch {
    // Non-essential convenience; ignore storage failures.
  }
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

/** Session-storage value that is `null` during server rendering and hydration. */
export function useSessionValue(key: string) {
  return useSyncExternalStore(
    subscribe,
    () => readSession(key),
    () => null,
  );
}

/** A single URL search parameter, read on the client only. */
export function useSearchParam(name: string) {
  return useSyncExternalStore(
    subscribe,
    () => new URLSearchParams(window.location.search).get(name),
    () => null,
  );
}

export const ESTIMATE_HANDOFF_KEY = "construkt:estimate-handoff";

export type EstimateHandoff = {
  summary: string;
  projectType: string;
  area: string;
  areaUnit: "sqm" | "sqft";
};
