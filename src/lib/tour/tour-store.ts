/**
 * Client-only persistence for the onboarding tour, following the app's `rh.*`
 * localStorage convention (see `token-store.ts`, `use-theme.ts`). All access is
 * wrapped in try/catch because storage can throw (private mode, quota, SSR).
 *
 * - `rh.tourPending` is set once at signup and marks that the tour should run.
 * - `rh.tourSeen` is set when the user finishes or skips, so it never re-opens.
 */

const PENDING_KEY = "rh.tourPending";
const SEEN_KEY = "rh.tourSeen";

export function getTourPending(): boolean {
  try {
    return localStorage.getItem(PENDING_KEY) === "1";
  } catch {
    return false;
  }
}

export function setTourPending(): void {
  try {
    localStorage.setItem(PENDING_KEY, "1");
  } catch {
    /* ignore storage errors */
  }
}

export function clearTourPending(): void {
  try {
    localStorage.removeItem(PENDING_KEY);
  } catch {
    /* ignore storage errors */
  }
}

export function getTourSeen(): boolean {
  try {
    return localStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

export function setTourSeen(): void {
  try {
    localStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* ignore storage errors */
  }
}
