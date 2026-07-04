"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Badge } from "@/components/ui/Badge";
import { EmptyState, Skeleton } from "@/components/ui/Misc";
import { ExternalIcon } from "@/components/ui/icons";
import { PageContainer } from "@/components/layout/PageContainer";
import { NewProfileButton } from "@/components/perfis/NewProfileButton";
import { useProfiles, useRemoveProfile } from "@/lib/query/hooks";
import { formatLongDate } from "@/lib/format";

export function ProfilesList({ publicOnly = false }: { publicOnly?: boolean }) {
  const { data, isLoading } = useProfiles();
  const remove = useRemoveProfile();
  const [toDelete, setToDelete] = useState<{ id: string; name: string } | null>(
    null,
  );

  const profiles = (data ?? []).filter((p) => (publicOnly ? p.isPublic : true));

  return (
    <PageContainer>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-[20px] font-semibold tracking-tight">
            {publicOnly ? "Portfólio público" : "Perfis"}
          </h1>
          <p className="mt-0.5 text-[12.5px] text-text2">
            {publicOnly
              ? "Perfis publicados, visíveis por link para recrutadores."
              : "Perfis curados por vaga, montados a partir do seu cofre."}
          </p>
        </div>
        <div className="flex-1" />
        {!publicOnly ? <NewProfileButton data-tour="perfis-new" /> : null}
      </div>

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : profiles.length === 0 ? (
        <EmptyState
          title={publicOnly ? "Nenhum perfil publicado" : "Nenhum perfil ainda"}
          description={
            publicOnly
              ? "Publique um perfil na tela de montagem para que ele apareça aqui."
              : "Crie um perfil e selecione itens do cofre para montá-lo."
          }
          action={!publicOnly ? <NewProfileButton /> : undefined}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((p, index) => (
            <Card
              key={p.id}
              className="rh-reveal flex flex-col p-4"
              style={{ "--rh-delay": `${index * 45}ms` } as CSSProperties}
            >
              <div className="flex items-start justify-between gap-2">
                <Link
                  href={`/perfis/${p.id}`}
                  className="text-[14px] font-semibold leading-snug hover:text-accent-text"
                >
                  {p.name}
                </Link>
                {p.isPublic ? (
                  <Badge tone="pos" dot>
                    Público
                  </Badge>
                ) : (
                  <Badge tone="warn" dot>
                    Rascunho
                  </Badge>
                )}
              </div>
              <div className="mt-1 font-mono text-[12px] text-text2">
                /{p.slug}
              </div>
              <div className="mt-1 text-[11.5px] text-text3">
                atualizado {formatLongDate(p.updatedAt)}
              </div>

              <div className="mt-4 flex items-center gap-3 border-t border-border pt-3 text-[12.5px]">
                <Link
                  href={`/perfis/${p.id}`}
                  className="font-medium text-accent-text"
                >
                  Editar
                </Link>
                {p.isPublic ? (
                  <Link
                    href={`/p/${p.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-text2 hover:text-text"
                  >
                    <ExternalIcon className="h-3.5 w-3.5" /> Ver
                  </Link>
                ) : null}
                <div className="flex-1" />
                <button
                  type="button"
                  onClick={() => setToDelete({ id: p.id, name: p.name })}
                  className="text-text2 hover:text-danger"
                >
                  Excluir
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        danger
        title="Excluir perfil"
        message={
          toDelete
            ? `Tem certeza que deseja excluir o perfil "${toDelete.name}"? Esta ação não pode ser desfeita.`
            : undefined
        }
        confirmLabel="Excluir"
        busy={remove.isPending}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (!toDelete) return;
          remove.mutate(toDelete.id, { onSettled: () => setToDelete(null) });
        }}
      />
    </PageContainer>
  );
}
