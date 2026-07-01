"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { MobileNav } from "@/components/layout/MobileNav";

/**
 * Client-side auth guard + chrome for the authenticated area. Tokens live in
 * localStorage (invisible to middleware), so the gate runs on the client.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { status } = useAuth();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status !== "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-3 font-mono text-[13px] text-text2">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-accent" />
          carregando…
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col pb-16 md:pb-0">
        <Topbar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
