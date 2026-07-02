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

const schema = z
  .object({
    fullName: z.string().trim().min(1, "Informe seu nome"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(8, "Mínimo de 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirme a senha"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });
type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async ({ fullName, email, password }) => {
    setServerError(null);
    try {
      await registerUser({ fullName, email, password });
      router.push("/dashboard");
    } catch (err) {
      setServerError(getErrorMessage(err, "Não foi possível criar a conta."));
    }
  });

  return (
    <Card className="p-6">
      <h1 className="text-[20px] font-semibold tracking-tight">Criar conta</h1>
      <p className="mb-5 mt-1 text-[13px] text-text2">
        Comece a montar seu inventário profissional.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <Field label="Nome" htmlFor="fullName" error={errors.fullName?.message}>
          <Input
            id="fullName"
            autoComplete="name"
            invalid={!!errors.fullName}
            placeholder="Seu nome"
            {...register("fullName")}
          />
        </Field>

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
            autoComplete="new-password"
            invalid={!!errors.password}
            placeholder="••••••••"
            {...register("password")}
          />
        </Field>

        <Field
          label="Confirmar senha"
          htmlFor="confirmPassword"
          error={errors.confirmPassword?.message}
        >
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            invalid={!!errors.confirmPassword}
            placeholder="••••••••"
            {...register("confirmPassword")}
          />
        </Field>

        {serverError ? (
          <p className="text-[12.5px] text-danger">{serverError}</p>
        ) : null}

        <Button type="submit" disabled={isSubmitting} className="mt-1 w-full">
          {isSubmitting ? "Criando…" : "Criar conta"}
        </Button>

        <p className="text-center text-[12px] leading-[1.6] text-text3">
          Ao criar uma conta, você concorda com os{" "}
          <Link
            href="/termos"
            target="_blank"
            className="text-accent-text hover:underline"
          >
            Termos de Uso
          </Link>{" "}
          e a{" "}
          <Link
            href="/privacidade"
            target="_blank"
            className="text-accent-text hover:underline"
          >
            Política de Privacidade
          </Link>
          .
        </p>
      </form>

      <p className="mt-5 text-center text-[13px] text-text2">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium text-accent-text">
          Entrar
        </Link>
      </p>
    </Card>
  );
}
