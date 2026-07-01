import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import type { AuthResponse } from "@/lib/types";
import { clearTokens, getTokens, setTokens } from "@/lib/auth/token-store";

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5087/api";

/** Custom event fired when the session can no longer be recovered. */
export const AUTH_EXPIRED_EVENT = "rh:auth-expired";

function notifyAuthExpired() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
  }
}

/** Bare client without interceptors — used for the refresh call itself. */
const bare = axios.create({ baseURL, headers: { "Content-Type": "application/json" } });

/** Main client: injects the Bearer token and refreshes once on 401. */
export const api: AxiosInstance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const tokens = getTokens();
  if (tokens?.accessToken) {
    config.headers.set("Authorization", `Bearer ${tokens.accessToken}`);
  }
  return config;
});

// --- Single-flight refresh so concurrent 401s share one refresh request. ---
let refreshPromise: Promise<AuthResponse> | null = null;

async function refreshTokens(): Promise<AuthResponse> {
  const tokens = getTokens();
  if (!tokens?.refreshToken) throw new Error("No refresh token");
  if (!refreshPromise) {
    refreshPromise = bare
      .post<AuthResponse>("/auth/refresh", { refreshToken: tokens.refreshToken })
      .then((res) => {
        setTokens(res.data);
        return res.data;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retried?: boolean })
      | undefined;

    const status = error.response?.status;
    const url = original?.url ?? "";
    const isAuthCall = url.includes("/auth/");

    if (status === 401 && original && !original._retried && !isAuthCall) {
      original._retried = true;
      try {
        const refreshed = await refreshTokens();
        original.headers.set("Authorization", `Bearer ${refreshed.accessToken}`);
        return api(original);
      } catch {
        clearTokens();
        notifyAuthExpired();
      }
    }
    return Promise.reject(error);
  },
);

/** Extracts a human-readable message from an API error (ProblemDetails-aware). */
export function getErrorMessage(error: unknown, fallback = "Algo deu errado."): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { detail?: string; title?: string; errors?: Record<string, string[]> }
      | undefined;
    if (data?.errors) {
      const first = Object.values(data.errors).flat()[0];
      if (first) return first;
    }
    return data?.detail ?? data?.title ?? error.message ?? fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
