import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

export function TypewriterText({
  children,
  className,
  durationMs = 1400,
}: {
  children: string;
  className?: string;
  durationMs?: number;
}) {
  const caretSteps = Math.max(1, Math.ceil(durationMs / 900) + 1);

  return (
    <span
      className={cn("rh-typewriter", className)}
      style={
        {
          "--rh-chars": children.length,
          "--rh-type-duration": `${durationMs}ms`,
          "--rh-caret-steps": caretSteps,
        } as CSSProperties
      }
    >
      {children}
    </span>
  );
}
