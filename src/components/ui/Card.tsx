import { cn } from "@/lib/cn";

/** Surface panel matching the mockup's bg2 + 1px border + rounded corners. */
export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[12px] border border-border bg-bg2",
        className,
      )}
      {...props}
    />
  );
}

/** Uppercase mono section eyebrow used throughout the console UI. */
export function SectionLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "font-mono text-[11px] tracking-[0.12em] text-text2",
        className,
      )}
      {...props}
    />
  );
}
