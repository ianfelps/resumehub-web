/** Small formatting helpers shared across the UI. */

const monthYear = new Intl.DateTimeFormat("pt-BR", {
  month: "short",
  year: "numeric",
});

const longDate = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

/** Parse an ISO date-only / datetime string without timezone surprises. */
function parse(value?: string | null): Date | null {
  if (!value) return null;
  // Date-only strings ("2024-01-12") parse as UTC midnight; append noon to
  // avoid the displayed day shifting backwards in negative-offset locales.
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00` : value;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatMonthYear(value?: string | null): string {
  const d = parse(value);
  return d ? monthYear.format(d) : "";
}

export function formatLongDate(value?: string | null): string {
  const d = parse(value);
  return d ? longDate.format(d) : "";
}

/** "Jan 2022 — atual" style period from start/end dates. */
export function formatPeriod(
  startDate?: string | null,
  endDate?: string | null,
): string {
  const start = formatMonthYear(startDate);
  const end = endDate ? formatMonthYear(endDate) : "atual";
  if (!start) return end;
  return `${start} — ${end}`;
}

/** Up to two uppercase initials from a name/company. */
export function initials(value?: string | null): string {
  if (!value) return "—";
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "—";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Splits a multiline / semicolon / bullet string into trimmed entries. */
export function splitLines(value?: string | null): string[] {
  if (!value) return [];
  return value
    .split(/\r?\n|;|•/)
    .map((s) => s.trim())
    .filter(Boolean);
}
