"use client";

import { cn } from "@/lib/cn";

/** iOS-style switch matching the mockup's include/exclude toggles. */
export function Toggle({
  checked,
  onChange,
  disabled,
  label,
  className,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-5 w-9 flex-none rounded-full border transition-colors disabled:opacity-50",
        checked ? "border-accent bg-accent" : "border-border bg-bg3",
        className,
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 block h-3.5 w-3.5 rounded-full transition-all",
          checked ? "right-0.5 bg-white" : "left-0.5 bg-text2",
        )}
      />
    </button>
  );
}
