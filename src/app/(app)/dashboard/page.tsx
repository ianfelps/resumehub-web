"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { StatCards } from "@/components/dashboard/StatCards";
import { ProfilesTable } from "@/components/dashboard/ProfilesTable";
import { useAuth } from "@/lib/auth/auth-context";

const today = new Intl.DateTimeFormat("pt-BR", {
  weekday: "short",
  day: "2-digit",
  month: "short",
  year: "numeric",
})
  .format(new Date())
  .toUpperCase();

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.fullName?.split(" ")[0] ?? "de volta";

  return (
    <PageContainer>
      <div className="font-mono text-[11.5px] tracking-[0.12em] text-accent-text">
        {today}
      </div>
      <h1 className="mt-1.5 text-[22px] font-semibold tracking-tight">
        Bem-vindo, {firstName}.
      </h1>
      <p className="mb-6 mt-1 text-[13.5px] text-text2">
        Seu cofre alimenta cada perfil. Cadastre uma vez, reutilize sempre.
      </p>

      <div className="mb-7" data-tour="dash-stats">
        <StatCards />
      </div>

      <ProfilesTable />
    </PageContainer>
  );
}
