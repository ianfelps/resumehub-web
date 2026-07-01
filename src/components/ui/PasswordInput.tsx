"use client";

import { forwardRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Input, type InputProps } from "@/components/ui/Input";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icons";

/** Password field with a show/hide toggle. Forwards ref for RHF `register`. */
export const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  function PasswordInput({ className, ...props }, ref) {
    const [visible, setVisible] = useState(false);
    return (
      <div className="relative">
        <Input
          ref={ref}
          type={visible ? "text" : "password"}
          className={cn("pr-10", className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          title={visible ? "Ocultar senha" : "Mostrar senha"}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text2 hover:text-text"
          tabIndex={-1}
        >
          {visible ? (
            <EyeOffIcon className="h-4 w-4" />
          ) : (
            <EyeIcon className="h-4 w-4" />
          )}
        </button>
      </div>
    );
  },
);
