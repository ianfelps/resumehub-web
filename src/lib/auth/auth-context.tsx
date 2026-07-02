"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { AUTH_EXPIRED_EVENT } from "@/lib/api/client";
import { login as loginApi, register as registerApi } from "@/lib/api/auth";
import {
  clearTokens,
  getTokens,
  hasValidSession,
  setTokens,
} from "@/lib/auth/token-store";
import { setTourPending } from "@/lib/tour/tour-store";
import type { LoginRequest, RegisterRequest } from "@/lib/types";

export interface AuthUser {
  email: string;
  fullName: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  status: "loading" | "authenticated" | "unauthenticated";
  login: (body: LoginRequest) => Promise<void>;
  register: (body: RegisterRequest) => Promise<void>;
  logout: () => void;
  /** Patch the locally displayed user (e.g. after editing the account profile). */
  updateUser: (patch: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Decodes the JWT payload to surface email / name claims (best-effort). */
function readUserFromToken(token: string): AuthUser | null {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    ) as Record<string, string>;
    const email =
      payload.email ??
      payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ??
      "";
    const fullName =
      payload.name ??
      payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ??
      null;
    return { email, fullName: fullName || null };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthContextValue["status"]>("loading");

  // Hydrate from any persisted session on mount (localStorage is client-only).
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    const tokens = getTokens();
    if (tokens && hasValidSession()) {
      setUser(readUserFromToken(tokens.accessToken));
      setStatus("authenticated");
    } else {
      setStatus("unauthenticated");
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    setStatus("unauthenticated");
    router.push("/login");
  }, [router]);

  // React to irrecoverable 401s emitted by the API client.
  useEffect(() => {
    const handler = () => logout();
    window.addEventListener(AUTH_EXPIRED_EVENT, handler);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handler);
  }, [logout]);

  const login = useCallback(async (body: LoginRequest) => {
    const res = await loginApi(body);
    setTokens(res);
    setUser(readUserFromToken(res.accessToken));
    setStatus("authenticated");
  }, []);

  const register = useCallback(async (body: RegisterRequest) => {
    const res = await registerApi(body);
    setTokens(res);
    setUser(
      readUserFromToken(res.accessToken) ?? {
        email: body.email,
        fullName: body.fullName ?? null,
      },
    );
    // Mark that this fresh signup should get the first-time guided tour.
    setTourPending();
    setStatus("authenticated");
  }, []);

  const updateUser = useCallback((patch: Partial<AuthUser>) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, login, register, logout, updateUser }),
    [user, status, login, register, logout, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
