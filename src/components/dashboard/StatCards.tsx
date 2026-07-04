"use client";

import type { CSSProperties } from "react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Misc";
import { useInventory } from "@/lib/query/hooks";
import type { InventoryKind } from "@/lib/types";

const stats: { kind: InventoryKind; label: string }[] = [
  { kind: "experiences", label: "Experiências" },
  { kind: "projects", label: "Projetos" },
  { kind: "skills", label: "Habilidades" },
  { kind: "education", label: "Formação" },
  { kind: "languages", label: "Idiomas" },
  { kind: "courses", label: "Cursos" },
];

function StatCard({
  kind,
  label,
  index,
}: {
  kind: InventoryKind;
  label: string;
  index: number;
}) {
  const { data, isLoading } = useInventory(kind);
  return (
    <Card
      className="rh-reveal px-4 py-3.5"
      style={{ "--rh-delay": `${index * 35}ms` } as CSSProperties}
    >
      {isLoading ? (
        <Skeleton className="h-6 w-10" />
      ) : (
        <div className="font-mono text-[24px] font-semibold leading-none tracking-tight">
          {data?.length ?? 0}
        </div>
      )}
      <div className="mt-2 text-[11.5px] text-text2">{label}</div>
    </Card>
  );
}

export function StatCards() {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
      {stats.map((s, index) => (
        <StatCard key={s.kind} {...s} index={index} />
      ))}
    </div>
  );
}
