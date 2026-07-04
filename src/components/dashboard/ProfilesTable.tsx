"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState, Skeleton } from "@/components/ui/Misc";
import { NewProfileButton } from "@/components/perfis/NewProfileButton";
import { formatLongDate } from "@/lib/format";
import { useProfiles } from "@/lib/query/hooks";
import type { ProfileResponse } from "@/lib/types";

function Row({ profile, index }: { profile: ProfileResponse; index: number }) {
  return (
    <Link
      href={`/perfis/${profile.id}`}
      className="rh-reveal grid grid-cols-[2fr_1fr_1fr] items-center gap-3 border-b border-border px-4 py-3.5 last:border-b-0 hover:bg-bg3/50 sm:px-5"
      style={{ "--rh-delay": `${index * 40}ms` } as CSSProperties}
    >
      <div className="min-w-0">
        <div className="truncate text-[13.5px] font-semibold">
          {profile.name}
        </div>
        <div className="truncate font-mono text-[12px] text-text2">
          /{profile.slug}
        </div>
      </div>
      <div>
        {profile.isPublic ? (
          <Badge tone="pos" dot>
            Publicado
          </Badge>
        ) : (
          <Badge tone="warn" dot>
            Rascunho
          </Badge>
        )}
      </div>
      <div className="text-right font-mono text-[12px] text-text2 sm:text-left">
        {formatLongDate(profile.updatedAt)}
      </div>
    </Link>
  );
}

export function ProfilesTable() {
  const { data, isLoading } = useProfiles();

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[14px] font-semibold">Seus perfis</h2>
        <Link
          href="/perfis"
          className="text-[12.5px] font-medium text-accent-text"
        >
          Ver todos →
        </Link>
      </div>

      {isLoading ? (
        <Card className="divide-y divide-border">
          {[0, 1, 2].map((i) => (
            <div key={i} className="px-5 py-4">
              <Skeleton className="h-4 w-48" />
            </div>
          ))}
        </Card>
      ) : data && data.length > 0 ? (
        <Card className="overflow-hidden">
          <div className="grid grid-cols-[2fr_1fr_1fr] gap-3 border-b border-border px-4 py-2.5 font-mono text-[10.5px] tracking-[0.1em] text-text2 sm:px-5">
            <span>PERFIL</span>
            <span>STATUS</span>
            <span className="text-right sm:text-left">ATUALIZADO</span>
          </div>
          {data.map((p, index) => (
            <Row key={p.id} profile={p} index={index} />
          ))}
        </Card>
      ) : (
        <EmptyState
          title="Nenhum perfil ainda"
          description="Crie um perfil curado para uma vaga, selecionando itens do seu cofre."
          action={<NewProfileButton />}
        />
      )}
    </section>
  );
}
