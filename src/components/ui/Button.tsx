import { forwardRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-[9px] font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-white hover:opacity-90",
  secondary:
    "bg-transparent border border-border text-text hover:bg-bg2",
  ghost: "bg-transparent text-text2 hover:bg-bg2",
  danger: "bg-transparent text-danger hover:bg-danger/10",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-[12.5px]",
  md: "px-4 py-2.5 text-[13px]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = "primary", size = "md", className, type, ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type ?? "button"}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  },
);
