"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SectionLabel } from "@/components/ui/Card";
import { Toggle } from "@/components/ui/Toggle";
import { Field, Input, Textarea } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Misc";
import { ExternalIcon } from "@/components/ui/icons";
import { ResumeDocument } from "@/components/resume/ResumeDocument";
import { describeItem } from "@/components/cofre/describe";
import { inventoryMeta } from "@/components/cofre/forms";
import { useAuth } from "@/lib/auth/auth-context";
import { getErrorMessage } from "@/lib/api/client";
import {
  useAccount,
  useInventory,
  useProfile,
  useProfileItems,
  useSetProfileItems,
  useUpdateProfile,
} from "@/lib/query/hooks";
import type {
  InventoryKind,
  InventoryShapes,
  ProfileItemSelection,
  PublicResumeResponse,
} from "@/lib/types";

const KINDS = Object.keys(inventoryMeta) as InventoryKind[];
type Selection = Record<InventoryKind, string[]>;
type AnyItem = InventoryShapes[InventoryKind]["response"];

const emptySelection = (): Selection => ({
  experiences: [],
  projects: [],
  skills: [],
  languages: [],
  education: [],
  courses: [],
});

export function ProfileBuilder({ profileId }: { profileId: string }) {
  const { user } = useAuth();
  const accountQuery = useAccount();
  const profileQuery = useProfile(profileId);
  const itemsQuery = useProfileItems(profileId);
  const updateProfile = useUpdateProfile();
  const setItems = useSetProfileItems(profileId);

  const queries = {
    experiences: useInventory("experiences"),
    projects: useInventory("projects"),
    skills: useInventory("skills"),
    languages: useInventory("languages"),
    education: useInventory("education"),
    courses: useInventory("courses"),
  } as const;

  const inventoryLoaded = KINDS.every((k) => queries[k].data !== undefined);

  // Editable profile fields.
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [headline, setHeadline] = useState("");
  const [summary, setSummary] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [selection, setSelection] = useState<Selection>(emptySelection);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  // Seed editable state from the loaded profile and its saved item selection
  // (read back from GET /profiles/{id}/items), in display order.
  useEffect(() => {
    if (initialized || !profileQuery.data || !inventoryLoaded || !itemsQuery.data)
      return;
    /* eslint-disable react-hooks/set-state-in-effect */
    setName(profileQuery.data.name);
    setSlug(profileQuery.data.slug);
    setHeadline(profileQuery.data.headline ?? "");
    setSummary(profileQuery.data.summary ?? "");
    setIsPublic(profileQuery.data.isPublic);
    const items = itemsQuery.data;
    const next = emptySelection();
    for (const k of KINDS) next[k] = items[k].map((s) => s.id);
    setSelection(next);
    setInitialized(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [initialized, profileQuery.data, inventoryLoaded, itemsQuery.data]);

  const toggle = (kind: InventoryKind, id: string) => {
    setSelection((prev) => {
      const has = prev[kind].includes(id);
      return {
        ...prev,
        [kind]: has
          ? prev[kind].filter((x) => x !== id)
          : [...prev[kind], id],
      };
    });
  };

  // Plain locals keep the memo dependency list compiler-friendly.
  const experiencesData = queries.experiences.data;
  const projectsData = queries.projects.data;
  const skillsData = queries.skills.data;
  const languagesData = queries.languages.data;
  const educationData = queries.education.data;
  const coursesData = queries.courses.data;

  // Assemble the live preview document from the current selection. Computed on
  // each render (cheap; small arrays) — the React Compiler memoizes it.
  const pickSelected = <T extends { id: string }>(
    all: T[] | undefined,
    order: string[],
  ): T[] =>
    (all ?? [])
      .filter((i) => order.includes(i.id))
      .sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));

  const account = accountQuery.data;
  const assembled: PublicResumeResponse = {
    name: name || "Perfil sem nome",
    summary: summary || null,
    owner: {
      fullName: account?.fullName ?? user?.fullName ?? user?.email ?? null,
      headline: headline || account?.headline || null,
      location: account?.location ?? null,
      linkedInUrl: account?.linkedInUrl ?? null,
      gitHubUrl: account?.gitHubUrl ?? null,
      websiteUrl: account?.websiteUrl ?? null,
    },
    experiences: pickSelected(experiencesData, selection.experiences),
    projects: pickSelected(projectsData, selection.projects),
    skills: pickSelected(skillsData, selection.skills),
    languages: pickSelected(languagesData, selection.languages),
    education: pickSelected(educationData, selection.education),
    courses: pickSelected(coursesData, selection.courses),
  };

  const save = async (publishOverride?: boolean) => {
    if (!profileQuery.data) return;
    setError(null);
    const nextPublic = publishOverride ?? isPublic;
    try {
      const updated = await updateProfile.mutateAsync({
        id: profileId,
        body: {
          name: name.trim() || "Novo perfil",
          slug: slug.trim() || null,
          headline: headline.trim() || null,
          summary: summary.trim() || null,
          isPublic: nextPublic,
        },
      });
      // The API may normalize/disambiguate the slug — reflect it back.
      setSlug(updated.slug);
      const toSel = (ids: string[]): ProfileItemSelection[] =>
        ids.map((id, i) => ({ id, displayOrder: i }));
      await setItems.mutateAsync({
        experiences: toSel(selection.experiences),
        projects: toSel(selection.projects),
        skills: toSel(selection.skills),
        languages: toSel(selection.languages),
        education: toSel(selection.education),
        courses: toSel(selection.courses),
      });
      if (publishOverride !== undefined) setIsPublic(publishOverride);
      setSavedAt(new Date().toLocaleTimeString("pt-BR").slice(0, 5));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const busy = updateProfile.isPending || setItems.isPending;
  const profile = profileQuery.data;

  if (profileQuery.isLoading || !initialized) {
    return (
      <div className="flex flex-col gap-3 p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[60vh] w-full" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8 text-[13.5px] text-text2">Perfil não encontrado.</div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-57px)] flex-col">
      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-3">
        <Link href="/perfis" className="text-text2 hover:text-text">
          ←
        </Link>
        <div className="text-[14px] font-semibold">{profile.name}</div>
        {isPublic ? (
          <Badge tone="pos" dot>
            Publicado
          </Badge>
        ) : (
          <Badge tone="warn" dot>
            Rascunho
          </Badge>
        )}
        {savedAt ? (
          <span className="font-mono text-[11.5px] text-text2">
            salvo {savedAt}
          </span>
        ) : null}
        <div className="flex-1" />
        {isPublic ? (
          <Link
            href={`/p/${profile.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-accent-text"
          >
            <ExternalIcon className="h-3.5 w-3.5" /> Ver público
          </Link>
        ) : null}
        <Button
          variant="secondary"
          onClick={() => save(!isPublic)}
          disabled={busy}
        >
          {isPublic ? "Despublicar" : "Publicar"}
        </Button>
        <Button onClick={() => save()} disabled={busy}>
          {busy ? "Salvando…" : "Salvar"}
        </Button>
      </div>

      {error ? (
        <div className="border-b border-border bg-danger/10 px-5 py-2 text-[12.5px] text-danger">
          {error}
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col lg:flex-row">
        {/* Composer */}
        <div className="min-w-0 flex-1 overflow-y-auto border-b border-border p-5 lg:border-b-0 lg:border-r">
          <SectionLabel className="mb-2">IDENTIDADE</SectionLabel>
          <div className="mb-5 flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nome do perfil">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex.: Front-end — Nubank"
                />
              </Field>
              <Field label="Link público (slug)">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[12.5px] text-text3">/p/</span>
                  <Input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="front-end-nubank"
                  />
                </div>
              </Field>
            </div>
            <Field label="Subtítulo do currículo">
              <Input
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="ex.: Desenvolvedor Backend"
              />
            </Field>
            <Field label="Apresentação · suporta Markdown">
              <Textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Resumo profissional… **negrito**, listas, links."
              />
            </Field>
          </div>

          {KINDS.map((kind) => {
            const items = (queries[kind].data ?? []) as AnyItem[];
            if (items.length === 0) return null;
            const included = selection[kind];
            return (
              <div key={kind} className="mb-5">
                <SectionLabel className="mb-2">
                  {inventoryMeta[kind].plural.toUpperCase()} ·{" "}
                  {included.length} DE {items.length}
                </SectionLabel>
                <div className="flex flex-col gap-2">
                  {items.map((item) => (
                    <ToggleRow
                      key={item.id}
                      kind={kind}
                      item={item}
                      included={included.includes(item.id)}
                      onToggle={() => toggle(kind, item.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Live preview */}
        <div className="w-full flex-none bg-bg3 p-5 lg:w-[420px]">
          <div className="mb-3 flex items-center justify-between">
            <SectionLabel>PREVIEW · AO VIVO</SectionLabel>
            <span className="font-mono text-[11px] text-pos">● ao vivo</span>
          </div>
          <div className="lg:sticky lg:top-5">
            <ResumeDocument data={assembled} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  kind,
  item,
  included,
  onToggle,
}: {
  kind: InventoryKind;
  item: AnyItem;
  included: boolean;
  onToggle: () => void;
}) {
  const { title, meta } = describeItem(kind, item);
  return (
    <div
      className={[
        "flex items-center gap-3 rounded-[10px] border px-3.5 py-2.5",
        included ? "border-border bg-bg2" : "border-dashed border-border opacity-60",
      ].join(" ")}
    >
      <span
        className="h-7 w-1.5 flex-none rounded-[4px]"
        style={{ background: included ? "var(--accent)" : "var(--text2)" }}
      />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-semibold">{title}</div>
        {meta ? (
          <div className="truncate text-[11.5px] text-text2">{meta}</div>
        ) : null}
      </div>
      <Toggle checked={included} onChange={onToggle} label={`Incluir ${title}`} />
    </div>
  );
}
