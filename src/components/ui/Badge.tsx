import { cn } from "@/lib/cn";

type Tone = "neutral" | "accent" | "pos" | "warn";

const tones: Record<Tone, string> = {
  neutral: "text-text2 bg-bg3 border-border",
  accent: "text-accent-text bg-accent-soft border-accent",
  pos: "text-pos bg-pos-soft border-transparent",
  warn: "text-warn bg-warn-soft border-transparent",
};

/** Pill status badge. With `dot`, prepends a colored status dot. */
export function Badge({
  tone = "neutral",
  dot = false,
  className,
  children,
}: {
  tone?: Tone;
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-medium",
        tones[tone],
        className,
      )}
    >
      {dot ? (
        <span
          className="block h-1.5 w-1.5 rounded-full"
          style={{ background: "currentColor" }}
        />
      ) : null}
      {children}
    </span>
  );
}

/** Small mono tag chip (e.g. tech tags). */
export function Tag({
  active = false,
  dashed = false,
  className,
  children,
}: {
  active?: boolean;
  dashed?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[7px] border px-2.5 py-1 text-[12px]",
        active
          ? "border-accent bg-accent-soft text-accent-text"
          : "border-border bg-bg2 text-text2",
        dashed && "border-dashed",
        className,
      )}
    >
      {children}
    </span>
  );
}
