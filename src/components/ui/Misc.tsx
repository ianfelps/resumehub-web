import { cn } from "@/lib/cn";

/** Thin progress bar (used for "ajuste à vaga" in the dashboard). */
export function ProgressBar({
  value,
  className,
}: {
  value: number; // 0..100
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-[4px] bg-bg3",
        className,
      )}
    >
      <div
        className="h-full rounded-[4px] bg-accent transition-[width]"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/** Loading placeholder block. */
export function Skeleton({
  className,
}: {
  className?: string;
}) {
  return <div className={cn("rh-skeleton", className)} />;
}

/** Empty-state panel with an optional action slot. */
export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-[12px] border border-dashed border-border bg-bg2 px-6 py-12 text-center",
        className,
      )}
    >
      <div className="text-[14px] font-semibold">{title}</div>
      {description ? (
        <p className="max-w-sm text-[13px] text-text2">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

/** Square icon tile with mono initials (avatars, company badges). */
export function InitialsTile({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex flex-none items-center justify-center rounded-[9px] border border-border bg-bg3 font-mono text-[12.5px] font-semibold text-text2",
        className,
      )}
    >
      {children}
    </span>
  );
}
