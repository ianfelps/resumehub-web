"use client";

import { NewProfileButton } from "@/components/perfis/NewProfileButton";

/** Top bar with the primary action. */
export function Topbar() {
  return (
    <header className="flex items-center justify-end gap-3 border-b border-border px-5 py-3.5">
      <NewProfileButton className="hidden sm:inline-flex" />
    </header>
  );
}
