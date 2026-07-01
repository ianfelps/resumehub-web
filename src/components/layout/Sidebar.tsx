"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { useAuth } from "@/lib/auth/auth-context";
import { initials } from "@/lib/format";
import { navItems } from "@/components/layout/nav";
import { LogoutIcon } from "@/components/ui/icons";

/** Persistent left navigation (desktop). Mirrors the mockup's aside. */
export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="hidden w-[236px] flex-none flex-col border-r border-border bg-bg2 p-4 md:flex">
      <Link
        href="/dashboard"
        className="flex items-center gap-2.5 px-2 pb-5 pt-1"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-accent font-mono text-[14px] font-semibold text-white">
          R
        </span>
        <span className="text-[15px] font-semibold tracking-tight">
          ResumeHub
        </span>
      </Link>

      <nav className="flex flex-col gap-0.5">
        {navItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          const content = (
            <>
              <Icon className="opacity-80" />
              <span>{item.label}</span>
              {!item.enabled ? (
                <span className="ml-auto font-mono text-[9.5px] uppercase tracking-wider text-text3">
                  em breve
                </span>
              ) : null}
            </>
          );
          const classes = cn(
            "flex items-center gap-3 rounded-[8px] px-2.5 py-2.5 text-[13.5px]",
            active
              ? "bg-accent-soft font-medium text-accent-text"
              : "text-text2 hover:bg-bg3",
            !item.enabled && "cursor-not-allowed opacity-50 hover:bg-transparent",
          );
          return item.enabled ? (
            <Link key={item.href} href={item.href} className={classes}>
              {content}
            </Link>
          ) : (
            <span key={item.href} className={classes} aria-disabled>
              {content}
            </span>
          );
        })}
      </nav>

      <div className="mt-auto flex items-center gap-2.5 rounded-[10px] border border-border p-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-accent-soft text-[12.5px] font-semibold text-accent-text">
          {initials(user?.fullName ?? user?.email)}
        </span>
        <div className="min-w-0 leading-tight">
          <div className="truncate text-[13px] font-medium">
            {user?.fullName ?? user?.email ?? "—"}
          </div>
          <div className="truncate font-mono text-[11.5px] text-text2">
            conta ativa
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          aria-label="Sair"
          title="Sair"
          className="ml-auto flex-none rounded-[7px] p-1.5 text-text2 hover:bg-bg3"
        >
          <LogoutIcon />
        </button>
      </div>
    </aside>
  );
}
