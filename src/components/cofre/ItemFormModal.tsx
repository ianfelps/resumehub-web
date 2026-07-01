"use client";

import { useState } from "react";
import { Modal, ModalFooter, ModalHeader } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { InitialsTile } from "@/components/ui/Misc";
import { getErrorMessage } from "@/lib/api/client";
import {
  useCreateInventory,
  useRemoveInventory,
  useUpdateInventory,
} from "@/lib/query/hooks";
import type { InventoryKind, InventoryShapes } from "@/lib/types";
import { inventoryMeta } from "@/components/cofre/forms";

type Res<K extends InventoryKind> = InventoryShapes[K]["response"];
type Req<K extends InventoryKind> = InventoryShapes[K]["request"];

const FORM_ID = "inventory-item-form";

export function ItemFormModal<K extends InventoryKind>({
  kind,
  item,
  open,
  onClose,
}: {
  kind: K;
  item: Res<K> | null;
  open: boolean;
  onClose: () => void;
}) {
  const meta = inventoryMeta[kind];
  const create = useCreateInventory(kind);
  const update = useUpdateInventory(kind);
  const remove = useRemoveInventory(kind);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(item);
  const busy = create.isPending || update.isPending || remove.isPending;

  const handleSubmit = async (body: Req<K>) => {
    setError(null);
    try {
      if (item) {
        await update.mutateAsync({ id: item.id, body });
      } else {
        await create.mutateAsync(body);
      }
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    if (!item) return;
    if (!window.confirm("Excluir este item do cofre?")) return;
    setError(null);
    try {
      await remove.mutateAsync(item.id);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const Form = meta.Form;

  return (
    <Modal open={open} onClose={onClose} labelledBy="modal-title">
      <ModalHeader
        title={`${isEditing ? "Editar" : "Nova"} ${meta.singular}`}
        subtitle={isEditing ? "atualiza todos os perfis que usam" : undefined}
        icon={<InitialsTile className="h-10 w-10 text-[13px]">+</InitialsTile>}
        onClose={onClose}
      />

      <div className="flex-1 overflow-y-auto px-6 py-5">
        <Form formId={FORM_ID} defaultValues={item ?? undefined} onSubmit={handleSubmit} />
        {error ? (
          <p className="mt-3 text-[12.5px] text-danger">{error}</p>
        ) : null}
      </div>

      <ModalFooter>
        {isEditing ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={busy}
            className="text-[12.5px] font-medium text-danger hover:underline disabled:opacity-50"
          >
            Excluir do cofre
          </button>
        ) : (
          <span />
        )}
        <div className="flex gap-2.5">
          <Button variant="secondary" onClick={onClose} disabled={busy}>
            Cancelar
          </Button>
          <Button type="submit" form={FORM_ID} disabled={busy}>
            {busy ? "Salvando…" : "Salvar"}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
