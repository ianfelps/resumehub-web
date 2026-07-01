"use client";

import { useTheme } from "@/lib/use-theme";

/** Compact theme switch shown in the topbar / sidebar. */
export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Tema: ${theme === "dark" ? "escuro" : "claro"}`}
      title="Alternar tema"
      className="flex items-center gap-2 rounded-[9px] border border-border bg-bg2 px-3 py-2 text-[12.5px] font-medium text-text2 hover:bg-bg3"
    >
      <span className="block h-2.5 w-2.5 rounded-full bg-accent" />
      {theme === "dark" ? "Escuro" : "Claro"}
    </button>
  );
}
