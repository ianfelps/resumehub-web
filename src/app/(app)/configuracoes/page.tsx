"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { Card, SectionLabel } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LogoutIcon } from "@/components/ui/icons";
import { AccountProfileForm } from "@/components/settings/AccountProfileForm";
import { ChangePasswordForm } from "@/components/settings/ChangePasswordForm";
import { DeleteAccountForm } from "@/components/settings/DeleteAccountForm";
import { useAuth } from "@/lib/auth/auth-context";
import { useTour } from "@/lib/tour/tour-context";

export default function ConfiguracoesPage() {
  const { logout } = useAuth();
  const { start: startTour } = useTour();

  return (
    <PageContainer className="max-w-[1280px]">
      <h1 className="text-[20px] font-semibold tracking-tight">Configurações</h1>
      <p className="mb-5 mt-0.5 text-[12.5px] text-text2">
        Gerencie sua conta, segurança e preferências.
      </p>

      <div className="grid items-start gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div data-tour="config-form">
          <AccountProfileForm />
        </div>

        <div className="flex flex-col gap-4">
          <ChangePasswordForm />

          <Card className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <SectionLabel className="mb-1">APARÊNCIA</SectionLabel>
              <p className="text-[12.5px] text-text2">Tema claro ou escuro.</p>
            </div>
            <ThemeToggle />
          </Card>

          <Card className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <SectionLabel className="mb-1">TUTORIAL</SectionLabel>
              <p className="text-[12.5px] text-text2">
                Rever o tour guiado pelas telas.
              </p>
            </div>
            <Button variant="secondary" onClick={startTour}>
              Rever tutorial
            </Button>
          </Card>

          <Card className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <SectionLabel className="mb-1">SESSÃO</SectionLabel>
              <p className="text-[12.5px] text-text2">Encerrar a sessão neste dispositivo.</p>
            </div>
            <Button variant="secondary" onClick={logout}>
              <LogoutIcon className="h-4 w-4" />
              Sair
            </Button>
          </Card>

          <DeleteAccountForm />
        </div>
      </div>
    </PageContainer>
  );
}
