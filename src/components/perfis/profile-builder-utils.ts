export function reorderIds(ids: string[], fromId: string, toId: string): string[] {
  if (fromId === toId) return ids;

  const from = ids.indexOf(fromId);
  const to = ids.indexOf(toId);
  if (from < 0 || to < 0) return ids;

  const next = [...ids];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

export function orderSelectedFirst<T extends { id: string }>(
  items: T[],
  selectedIds: string[],
): T[] {
  const byId = new Map(items.map((item) => [item.id, item]));
  const selected = selectedIds
    .map((id) => byId.get(id))
    .filter((item): item is T => Boolean(item));
  const selectedSet = new Set(selectedIds);
  const unselected = items.filter((item) => !selectedSet.has(item.id));

  return [...selected, ...unselected];
}

export function buildPublicLink(origin: string, slug: string): string {
  return `${origin.replace(/\/$/, "")}/p/${encodeURIComponent(slug)}`;
}
