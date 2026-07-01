"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/lib/auth/auth-context";
import { getErrorMessage } from "@/lib/api/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";

const schema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Informe a senha"),
});
type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await login(values);
      router.push("/dashboard");
    } catch (err) {
      setServerError(getErrorMessage(err, "Não foi possível entrar."));
    }
  });

  return (
    <Card className="p-6">
      <h1 className="text-[20px] font-semibold tracking-tight">Entrar</h1>
      <p className="mb-5 mt-1 text-[13px] text-text2">
        Acesse seu console de carreira.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <Field label="E-mail" htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            invalid={!!errors.email}
            placeholder="voce@email.com"
            {...register("email")}
          />
        </Field>

        <Field label="Senha" htmlFor="password" error={errors.password?.message}>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            invalid={!!errors.password}
            placeholder="••••••••"
            {...register("password")}
          />
        </Field>

        {serverError ? (
          <p className="text-[12.5px] text-danger">{serverError}</p>
        ) : null}

        <Button type="submit" disabled={isSubmitting} className="mt-1 w-full">
          {isSubmitting ? "Entrando…" : "Entrar"}
        </Button>
      </form>

      <p className="mt-5 text-center text-[13px] text-text2">
        Não tem conta?{" "}
        <Link href="/register" className="font-medium text-accent-text">
          Criar conta
        </Link>
      </p>
    </Card>
  );
}
