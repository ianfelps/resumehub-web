"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { getErrorMessage } from "@/lib/api/client";
import { useDeleteAccount } from "@/lib/query/hooks";
import { useAuth } from "@/lib/auth/auth-context";

export function DeleteAccountForm() {
  const deleteAccount = useDeleteAccount();
  const { logout } = useAuth();
  const [confirming, setConfirming] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const cancel = () => {
    setConfirming(false);
    setPassword("");
    setError(null);
  };

  const onDelete = async () => {
    setError(null);
    try {
      await deleteAccount.mutateAsync({ password });
      // Session is gone — clear tokens and redirect to login.
      logout();
    } catch (err) {
      setError(getErrorMessage(err, "Não foi possível excluir a conta."));
    }
  };

  return (
    <Card className="p-5">
      <div className="mb-1 font-mono text-[11px] tracking-[0.12em] text-danger">
        EXCLUIR CONTA
      </div>
      <p className="mb-4 text-[12.5px] text-text2">
        Remove permanentemente sua conta e todos os dados relacionados — inventário,
        perfis e portfólios. Esta ação não pode ser desfeita.
      </p>

      {confirming ? (
        <div className="flex flex-col gap-4">
          <Field label="Confirme com sua senha" error={error ?? undefined}>
            <PasswordInput
              autoComplete="current-password"
              invalid={!!error}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={cancel} disabled={deleteAccount.isPending}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={onDelete}
              disabled={deleteAccount.isPending || password.length === 0}
            >
              {deleteAccount.isPending ? "Excluindo…" : "Excluir permanentemente"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-end">
          <Button variant="danger" onClick={() => setConfirming(true)}>
            Excluir conta
          </Button>
        </div>
      )}
    </Card>
  );
}
