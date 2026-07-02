import type { Metadata } from "next";
import { LandingPage } from "@/components/marketing/LandingPage";

export const metadata: Metadata = {
  title: "ResumeHub — Seu centro de comando de carreira",
  description:
    "Cadastre sua trajetória uma vez e monte o currículo perfeito para cada vaga em poucos cliques — com export PDF impecável.",
};

export default function Home() {
  return <LandingPage />;
}
