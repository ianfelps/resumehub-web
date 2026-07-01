"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { navItems } from "@/components/layout/nav";

/** Bottom tab bar shown on small screens (mirrors screen 06 · Mobile). */
export function MobileNav() {
  const pathname = usePathname();
  const items = navItems.filter((i) => i.enabled);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-border bg-bg2/95 px-2 py-1.5 backdrop-blur md:hidden">
      {items.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 rounded-[8px] py-1.5 text-[10.5px]",
              active ? "text-accent-text" : "text-text2",
            )}
          >
            <Icon className="h-[18px] w-[18px]" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
