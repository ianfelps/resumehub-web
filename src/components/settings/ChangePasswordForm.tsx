"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, SectionLabel } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { PasswordChecklist } from "@/components/ui/PasswordChecklist";
import { getErrorMessage } from "@/lib/api/client";
import { useChangePassword } from "@/lib/query/hooks";
import { passwordSchema } from "@/lib/validation/password";

const schema = z
  .object({
    currentPassword: z.string().min(1, "Informe a senha atual"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Confirme a nova senha"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });
type FormValues = z.infer<typeof schema>;

export function ChangePasswordForm() {
  const changePassword = useChangePassword();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const newPassword = watch("newPassword") ?? "";
  const confirmPassword = watch("confirmPassword") ?? "";

  const onSubmit = handleSubmit(async ({ currentPassword, newPassword }) => {
    setError(null);
    setFeedback(null);
    try {
      await changePassword.mutateAsync({ currentPassword, newPassword });
      reset();
      setFeedback("Senha alterada com sucesso.");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  });

  return (
    <Card className="p-5">
      <SectionLabel className="mb-1">SENHA</SectionLabel>
      <p className="mb-4 text-[12.5px] text-text2">
        Use uma senha forte com pelo menos 8 caracteres.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <Field label="Senha atual" error={errors.currentPassword?.message}>
          <PasswordInput
            autoComplete="current-password"
            invalid={!!errors.currentPassword}
            {...register("currentPassword")}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nova senha">
            <PasswordInput
              autoComplete="new-password"
              invalid={!!errors.newPassword}
              {...register("newPassword")}
            />
          </Field>
          <Field
            label="Confirmar nova senha"
            error={errors.confirmPassword?.message}
          >
            <PasswordInput
              autoComplete="new-password"
              invalid={!!errors.confirmPassword}
              {...register("confirmPassword")}
            />
          </Field>
        </div>

        <PasswordChecklist value={newPassword} confirmValue={confirmPassword} />

        {error ? <p className="text-[12.5px] text-danger">{error}</p> : null}
        {feedback ? <p className="text-[12.5px] text-pos">{feedback}</p> : null}

        <div className="flex justify-end">
          <Button type="submit" disabled={changePassword.isPending}>
            {changePassword.isPending ? "Alterando…" : "Alterar senha"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
