import type { InventoryKind } from "@/lib/types";

/** Centralized React Query keys. */
export const queryKeys = {
  inventory: (kind: InventoryKind) => ["inventory", kind] as const,
  profiles: ["profiles"] as const,
  profile: (id: string) => ["profiles", id] as const,
  profileItems: (id: string) => ["profiles", id, "items"] as const,
  account: ["account"] as const,
};
