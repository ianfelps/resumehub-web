import {
  languageProficiencyLabels,
  skillCategoryLabels,
  skillLevelLabels,
} from "@/lib/enums";
import { formatMonthYear, formatPeriod } from "@/lib/format";
import type { InventoryKind, InventoryShapes } from "@/lib/types";

export interface ItemSummary {
  title: string;
  subtitle?: string;
  meta?: string;
}

/** Produces a uniform title/subtitle/meta summary for any inventory item. */
export function describeItem<K extends InventoryKind>(
  kind: K,
  item: InventoryShapes[K]["response"],
): ItemSummary {
  switch (kind) {
    case "experiences": {
      const it = item as InventoryShapes["experiences"]["response"];
      return {
        title: `${it.role} · ${it.company}`,
        subtitle: it.location ?? undefined,
        meta: formatPeriod(it.startDate, it.endDate),
      };
    }
    case "projects": {
      const it = item as InventoryShapes["projects"]["response"];
      return { title: it.name, subtitle: it.description ?? undefined };
    }
    case "skills": {
      const it = item as InventoryShapes["skills"]["response"];
      return {
        title: it.name,
        subtitle: skillCategoryLabels[it.category],
        meta: skillLevelLabels[it.level],
      };
    }
    case "languages": {
      const it = item as InventoryShapes["languages"]["response"];
      return { title: it.name, meta: languageProficiencyLabels[it.proficiency] };
    }
    case "education": {
      const it = item as InventoryShapes["education"]["response"];
      return {
        title: it.degree,
        subtitle: [it.institution, it.field].filter(Boolean).join(" · "),
        meta: formatPeriod(it.startDate, it.endDate),
      };
    }
    case "courses": {
      const it = item as InventoryShapes["courses"]["response"];
      return {
        title: it.name,
        subtitle: it.provider ?? undefined,
        meta: it.completionDate ? formatMonthYear(it.completionDate) : undefined,
      };
    }
    default:
      return { title: "" };
  }
}
