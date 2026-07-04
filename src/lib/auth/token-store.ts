import type { AuthResponse } from "@/lib/types";

/**
 * Persists the JWT pair in localStorage. This is a client-only concern; every
 * function guards against SSR where `window` is undefined.
 *
 * Note: per the project's chosen architecture (direct browser → API calls),
 * tokens live in localStorage. That trades some XSS exposure for simplicity.
 */

const ACCESS_KEY = "rh.accessToken";
const EXPIRES_KEY = "rh.accessTokenExpiresAt";

export interface StoredTokens {
  accessToken: string;
  accessTokenExpiresAt: string;
}

const isBrowser = () => typeof window !== "undefined";

export function getTokens(): StoredTokens | null {
  if (!isBrowser()) return null;
  const accessToken = localStorage.getItem(ACCESS_KEY);
  const accessTokenExpiresAt = localStorage.getItem(EXPIRES_KEY);
  if (!accessToken || !accessTokenExpiresAt) return null;
  return { accessToken, accessTokenExpiresAt };
}

export function setTokens(tokens: AuthResponse): void {
  if (!isBrowser()) return;
  localStorage.setItem(ACCESS_KEY, tokens.accessToken);
  localStorage.setItem(EXPIRES_KEY, tokens.accessTokenExpiresAt);
}

export function clearTokens(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(EXPIRES_KEY);
}

export function getAccessToken(): string | null {
  return getTokens()?.accessToken ?? null;
}

export function hasValidSession(): boolean {
  const tokens = getTokens();
  if (!tokens) return false;
  const expiry = new Date(tokens.accessTokenExpiresAt).getTime();
  // Keep the session if the refresh token is around even when the access token
  // is expired — the client interceptor will refresh on the next call.
  return Number.isFinite(expiry) && expiry > Date.now();
}
