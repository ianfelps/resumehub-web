import { forwardRef } from "react";
import { cn } from "@/lib/cn";

const fieldBase =
  "w-full rounded-[9px] bg-bg border border-border px-3 py-2.5 text-[13.5px] text-text placeholder:text-text3 outline-none transition focus:border-accent focus:ring-3 focus:ring-accent-soft disabled:opacity-60";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(fieldBase, invalid && "border-danger", className)}
      {...props}
    />
  );
});

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, invalid, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        rows={5}
        className={cn(
          fieldBase,
          "min-h-[136px] resize-y leading-relaxed",
          invalid && "border-danger",
          className,
        )}
        {...props}
      />
    );
  },
);

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ className, invalid, children, ...props }, ref) {
    return (
      <select
        ref={ref}
        className={cn(
          fieldBase,
          "appearance-none cursor-pointer",
          invalid && "border-danger",
          className,
        )}
        {...props}
      >
        {children}
      </select>
    );
  },
);

/** Field wrapper: label + optional error message. */
export function Field({
  label,
  error,
  htmlFor,
  className,
  children,
}: {
  label: string;
  error?: string;
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="text-[11.5px] font-semibold text-text2"
      >
        {label}
      </label>
      {children}
      {error ? (
        <span className="text-[11.5px] text-danger">{error}</span>
      ) : null}
    </div>
  );
}
