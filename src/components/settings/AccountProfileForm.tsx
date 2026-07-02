"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, SectionLabel } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";
import { Skeleton } from "@/components/ui/Misc";
import { getErrorMessage } from "@/lib/api/client";
import { useAccount, useUpdateAccount } from "@/lib/query/hooks";
import { useAuth } from "@/lib/auth/auth-context";

const optionalUrl = z
  .string()
  .trim()
  .max(300)
  .refine(
    (v) => v === "" || /^(https?:\/\/)?[\w-]+(\.[\w-]+)+/.test(v),
    "URL inválida",
  )
  .optional();

const schema = z.object({
  fullName: z.string().trim().max(200).optional(),
  headline: z.string().trim().max(200).optional(),
  location: z.string().trim().max(200).optional(),
  phoneNumber: z.string().trim().max(40).optional(),
  showEmailOnResume: z.boolean(),
  linkedInUrl: optionalUrl,
  gitHubUrl: optionalUrl,
  websiteUrl: optionalUrl,
});
type FormValues = z.infer<typeof schema>;

/** Edits the account identity shown on every public resume (owner line). */
export function AccountProfileForm() {
  const { data, isLoading } = useAccount();
  const update = useUpdateAccount();
  const { updateUser } = useAuth();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      fullName: data?.fullName ?? "",
      headline: data?.headline ?? "",
      location: data?.location ?? "",
      phoneNumber: data?.phoneNumber ?? "",
      showEmailOnResume: data?.showEmailOnResume ?? false,
      linkedInUrl: data?.linkedInUrl ?? "",
      gitHubUrl: data?.gitHubUrl ?? "",
      websiteUrl: data?.websiteUrl ?? "",
    },
  });

  const showEmailOnResume = watch("showEmailOnResume");

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    setFeedback(null);
    try {
      const saved = await update.mutateAsync({
        fullName: values.fullName?.trim() || null,
        headline: values.headline?.trim() || null,
        location: values.location?.trim() || null,
        phoneNumber: values.phoneNumber?.trim() || null,
        showEmailOnResume: values.showEmailOnResume,
        linkedInUrl: values.linkedInUrl?.trim() || null,
        gitHubUrl: values.gitHubUrl?.trim() || null,
        websiteUrl: values.websiteUrl?.trim() || null,
      });
      updateUser({ fullName: saved.fullName ?? null });
      setFeedback("Perfil atualizado.");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  });

  return (
    <Card className="p-5">
      <SectionLabel className="mb-1">PERFIL DA CONTA</SectionLabel>
      <p className="mb-4 text-[12.5px] text-text2">
        Nome, subtítulo e localização aparecem no topo dos seus currículos públicos.
      </p>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="E-mail">
              <Input value={data?.email ?? ""} disabled readOnly />
            </Field>
            <Field label="Nome completo" error={errors.fullName?.message}>
              <Input {...register("fullName")} placeholder="Ian Felipe" />
            </Field>
          </div>
          <Field
            label="Subtítulo padrão"
            error={errors.headline?.message}
          >
            <Input {...register("headline")} placeholder="Desenvolvedor Backend" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Localização" error={errors.location?.message}>
              <Input {...register("location")} placeholder="São Paulo · Remoto" />
            </Field>
            <Field label="Celular · opcional" error={errors.phoneNumber?.message}>
              <Input {...register("phoneNumber")} placeholder="(11) 99999-9999" />
            </Field>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-[10px] border border-border bg-bg2 px-4 py-3">
            <div className="min-w-0">
              <div className="text-[13px] font-medium">Exibir e-mail no currículo</div>
              <div className="text-[12px] text-text2">
                Quando ativo, {data?.email ?? "seu e-mail"} aparece nos contatos do currículo.
              </div>
            </div>
            <Toggle
              checked={showEmailOnResume}
              onChange={(v) =>
                setValue("showEmailOnResume", v, { shouldDirty: true })
              }
              label="Exibir e-mail no currículo"
            />
          </div>

          <SectionLabel className="mt-1">REDES · aparecem no currículo</SectionLabel>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="LinkedIn" error={errors.linkedInUrl?.message}>
              <Input
                {...register("linkedInUrl")}
                placeholder="linkedin.com/in/voce"
              />
            </Field>
            <Field label="GitHub" error={errors.gitHubUrl?.message}>
              <Input {...register("gitHubUrl")} placeholder="github.com/voce" />
            </Field>
          </div>
          <Field label="Link personalizado" error={errors.websiteUrl?.message}>
            <Input {...register("websiteUrl")} placeholder="seusite.com" />
          </Field>

          {error ? <p className="text-[12.5px] text-danger">{error}</p> : null}
          {feedback ? (
            <p className="text-[12.5px] text-pos">{feedback}</p>
          ) : null}

          <div className="flex justify-end">
            <Button type="submit" disabled={update.isPending || !isDirty}>
              {update.isPending ? "Salvando…" : "Salvar alterações"}
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}
