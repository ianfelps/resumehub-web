"use client";

import { cn } from "@/lib/cn";
import { CheckIcon } from "@/components/ui/icons";
import { passwordRules } from "@/lib/validation/password";

type ChecklistItem = { label: string; done: boolean };

/**
 * Live password-requirement checklist. Each rule ticks as the user types.
 * Pass `confirmValue` to also show the "passwords match" step.
 */
export function PasswordChecklist({
  value,
  confirmValue,
  className,
}: {
  value: string;
  confirmValue?: string;
  className?: string;
}) {
  const items: ChecklistItem[] = passwordRules.map((rule) => ({
    label: rule.label,
    done: rule.test(value),
  }));

  if (confirmValue !== undefined) {
    items.push({
      label: "As senhas coincidem",
      done: value.length > 0 && value === confirmValue,
    });
  }

  return (
    <ul className={cn("flex flex-col gap-1.5", className)} aria-label="Requisitos da senha">
      {items.map((item) => (
        <li
          key={item.label}
          className={cn(
            "flex items-center gap-2 text-[12.5px] transition-colors",
            item.done ? "text-pos" : "text-text3",
          )}
        >
          <span
            className={cn(
              "grid h-4 w-4 shrink-0 place-items-center rounded-full border transition-colors",
              item.done ? "border-pos bg-pos/15" : "border-border",
            )}
          >
            {item.done ? <CheckIcon className="h-3 w-3" /> : null}
          </span>
          {item.label}
        </li>
      ))}
    </ul>
  );
}
