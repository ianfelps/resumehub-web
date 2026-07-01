import type { PublicResumeResponse } from "@/lib/types";

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5087/api";

/**
 * Fetches the assembled public resume for a slug. Uses the native `fetch` so it
 * can run in a Server Component (no auth, no localStorage). Returns `null` when
 * the profile does not exist or is not public (API responds 404).
 */
export async function getPublicResume(
  slug: string,
): Promise<PublicResumeResponse | null> {
  const res = await fetch(`${baseURL}/public/${encodeURIComponent(slug)}`, {
    // Always fresh so profile/inventory edits appear immediately.
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to load resume: ${res.status}`);
  return (await res.json()) as PublicResumeResponse;
}
