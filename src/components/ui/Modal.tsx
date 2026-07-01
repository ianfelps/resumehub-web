"use client";

import { useEffect } from "react";
import { cn } from "@/lib/cn";

/**
 * Centered dialog with a dimmed backdrop. Closes on ESC and backdrop click.
 * Mirrors screen 04 (Detalhe) of the design.
 */
export function Modal({
  open,
  onClose,
  children,
  className,
  labelledBy,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  labelledBy?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      style={{ background: "rgba(4,6,10,.55)" }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={cn(
          "flex max-h-[90vh] w-full max-w-[760px] flex-col overflow-hidden rounded-[16px] border border-border bg-bg2 shadow-[var(--shadow)]",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({
  title,
  subtitle,
  icon,
  onClose,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border px-6 py-4">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <div id="modal-title" className="text-[16px] font-semibold">
            {title}
          </div>
          {subtitle ? (
            <div className="mt-0.5 font-mono text-[12px] text-text2">
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="flex h-7.5 w-7.5 items-center justify-center rounded-[8px] border border-border p-1.5 text-text2 hover:bg-bg3"
      >
        ×
      </button>
    </div>
  );
}

export function ModalFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-t border-border px-6 py-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
