"use client";

import { Modal, ModalFooter } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

/**
 * In-app confirmation dialog. Replaces the browser's native `window.confirm`
 * so destructive actions match the app's design instead of the OS chrome.
 */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  danger = false,
  busy = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      labelledBy="confirm-title"
      className="max-w-[440px]"
    >
      <div className="px-6 py-5">
        <div id="confirm-title" className="text-[16px] font-semibold">
          {title}
        </div>
        {message ? (
          <div className="mt-2 text-[13px] text-text2">{message}</div>
        ) : null}
      </div>

      <ModalFooter className="justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={busy}>
          {cancelLabel}
        </Button>
        <Button
          variant={danger ? "danger" : "primary"}
          onClick={onConfirm}
          disabled={busy}
        >
          {busy ? "Processando…" : confirmLabel}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
