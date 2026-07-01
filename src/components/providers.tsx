"use client";

import { AuthProvider } from "@/lib/auth/auth-context";
import { QueryProvider } from "@/lib/query/query-provider";

/** Composes the client-side providers used across the whole app. */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </QueryProvider>
  );
}
