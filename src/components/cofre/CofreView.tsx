"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { EmptyState, InitialsTile, Skeleton } from "@/components/ui/Misc";
import { PlusIcon } from "@/components/ui/icons";
import { PageContainer } from "@/components/layout/PageContainer";
import { initials } from "@/lib/format";
import { skillCategoryLabels } from "@/lib/enums";
import { useInventory } from "@/lib/query/hooks";
import { SkillCategory } from "@/lib/types";
import type { InventoryKind, InventoryShapes } from "@/lib/types";
import { inventoryMeta } from "@/components/cofre/forms";
import { describeItem } from "@/components/cofre/describe";
import { ItemFormModal } from "@/components/cofre/ItemFormModal";

const KINDS = Object.keys(inventoryMeta) as InventoryKind[];

type AnyItem = InventoryShapes[InventoryKind]["response"];

function ItemRow({
  kind,
  item,
  onEdit,
  hideSubtitle,
}: {
  kind: InventoryKind;
  item: AnyItem;
  onEdit: () => void;
  hideSubtitle?: boolean;
}) {
  const { title, subtitle: rawSubtitle, meta } = describeItem(kind, item);
  const subtitle = hideSubtitle ? undefined : rawSubtitle;
  return (
    <button
      type="button"
      onClick={onEdit}
      className="flex w-full items-center gap-3.5 rounded-[11px] border border-border bg-bg2 px-4 py-3 text-left hover:border-accent/40"
    >
      <InitialsTile className="h-9 w-9">{initials(title)}</InitialsTile>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13.5px] font-semibold">{title}</div>
        {subtitle ? (
          <div className="truncate text-[12px] text-text2">{subtitle}</div>
        ) : null}
      </div>
      {meta ? (
        <span className="hidden flex-none font-mono text-[12px] text-text2 sm:block">
          {meta}
        </span>
      ) : null}
      <span className="flex-none text-text2">⋯</span>
    </button>
  );
}

function ProjectCard({
  item,
  onEdit,
}: {
  item: InventoryShapes["projects"]["response"];
  onEdit: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onEdit}
      className="flex flex-col rounded-[11px] border border-border bg-bg2 px-4 py-3.5 text-left hover:border-accent/40"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-[13.5px] font-semibold leading-snug">
          {item.name}
        </div>
        {item.url ? (
          <span className="flex-none rounded-[5px] border border-accent bg-accent-soft px-1.5 py-0.5 font-mono text-[9px] tracking-wider text-accent-text">
            LINK
          </span>
        ) : null}
      </div>
      {item.description ? (
        <p className="mt-2 line-clamp-2 text-[12px] text-text2">
          {item.description}
        </p>
      ) : null}
    </button>
  );
}

const SKILL_CATEGORY_ORDER = [
  SkillCategory.Technology,
  SkillCategory.Tool,
  SkillCategory.SoftSkill,
] as const;

function SkillGroups({
  items,
  onEdit,
}: {
  items: InventoryShapes["skills"]["response"][];
  onEdit: (item: InventoryShapes["skills"]["response"]) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      {SKILL_CATEGORY_ORDER.map((category) => {
        const group = items
          .filter((it) => it.category === category)
          .sort((a, b) => b.level - a.level);
        if (group.length === 0) return null;
        return (
          <section key={category} className="flex flex-col gap-2">
            <h2 className="font-mono text-[11px] uppercase tracking-wider text-text2">
              {skillCategoryLabels[category]} · {group.length}
            </h2>
            {group.map((it) => (
              <ItemRow
                key={it.id}
                kind="skills"
                item={it}
                onEdit={() => onEdit(it)}
                hideSubtitle
              />
            ))}
          </section>
        );
      })}
    </div>
  );
}

export function CofreView() {
  const [active, setActive] = useState<InventoryKind>("experiences");
  const [modal, setModal] = useState<{ open: boolean; item: AnyItem | null }>({
    open: false,
    item: null,
  });

  // One query per kind keeps tab counts live; React Query dedupes/caches them.
  const queries = {
    experiences: useInventory("experiences"),
    projects: useInventory("projects"),
    skills: useInventory("skills"),
    languages: useInventory("languages"),
    education: useInventory("education"),
    courses: useInventory("courses"),
  } as const;

  const activeQuery = queries[active];
  const items = (activeQuery.data ?? []) as AnyItem[];

  const openCreate = () => setModal({ open: true, item: null });
  const openEdit = (item: AnyItem) => setModal({ open: true, item });
  const close = () => setModal((m) => ({ ...m, open: false }));

  return (
    <PageContainer>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-[20px] font-semibold tracking-tight">Cofre</h1>
          <p className="mt-0.5 text-[12.5px] text-text2">
            Seu banco de talentos. Cadastrado uma vez, reutilizável para sempre.
          </p>
        </div>
        <div className="flex-1" />
        <Button onClick={openCreate} data-tour="cofre-add">
          <PlusIcon className="h-4 w-4" />
          Adicionar {inventoryMeta[active].singular}
        </Button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {KINDS.map((kind) => {
          const count = queries[kind].data?.length ?? 0;
          const isActive = kind === active;
          return (
            <button
              key={kind}
              type="button"
              onClick={() => setActive(kind)}
              className={cn(
                "rounded-[8px] border px-3 py-1.5 font-mono text-[12.5px]",
                isActive
                  ? "border-accent bg-accent-soft text-accent-text"
                  : "border-border bg-bg2 text-text2 hover:bg-bg3",
              )}
            >
              {inventoryMeta[kind].plural} · {count}
            </button>
          );
        })}
      </div>

      {activeQuery.isLoading ? (
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title={`Nenhuma ${inventoryMeta[active].singular} cadastrada`}
          description="Adicione itens ao cofre para reutilizá-los em qualquer perfil."
          action={
            <Button onClick={openCreate}>
              <PlusIcon className="h-4 w-4" />
              Adicionar
            </Button>
          }
        />
      ) : active === "projects" ? (
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {(items as InventoryShapes["projects"]["response"][]).map((it) => (
            <ProjectCard key={it.id} item={it} onEdit={() => openEdit(it)} />
          ))}
        </div>
      ) : active === "skills" ? (
        <SkillGroups
          items={items as InventoryShapes["skills"]["response"][]}
          onEdit={openEdit}
        />
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((it) => (
            <ItemRow
              key={it.id}
              kind={active}
              item={it}
              onEdit={() => openEdit(it)}
            />
          ))}
        </div>
      )}

      <ItemFormModal
        kind={active}
        item={modal.item}
        open={modal.open}
        onClose={close}
      />
    </PageContainer>
  );
}
