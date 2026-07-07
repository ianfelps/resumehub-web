/**
 * Declarative steps for the first-time guided tour. Each step names the route it
 * lives on and (optionally) a `data-tour` selector to spotlight. Steps without a
 * selector render as a centered card (welcome / closing). Copy is inline pt-BR —
 * the app has no i18n layer.
 */

export interface TourStep {
  /** Route the step lives on; the controller navigates here before showing it. */
  route: string;
  /** Element to spotlight. Omit for a centered, target-less step. */
  selector?: string;
  title: string;
  body: string;
  /** Preferred balloon side relative to the target; "auto" picks by space. */
  placement?: "top" | "bottom" | "auto";
}

export const tourSteps: TourStep[] = [
  {
    route: "/dashboard",
    title: "Bem-vindo ao ResumeHub!",
    body: "Vamos dar um tour rápido pelas telas principais. Leva menos de um minuto — e você pode pular quando quiser.",
  },
  {
    route: "/dashboard",
    selector: '[data-tour="dash-stats"]',
    title: "Sua visão geral",
    body: "Aqui você acompanha, num relance, quantos itens já cadastrou no cofre e seus perfis mais recentes.",
    placement: "bottom",
  },
  {
    route: "/cofre",
    selector: '[data-tour="cofre-add"]',
    title: "O Cofre é a base de tudo",
    body: "Cadastre experiências, projetos, habilidades e mais — uma única vez. Todo perfil é montado a partir daqui.",
    placement: "bottom",
  },
  {
    route: "/perfis",
    selector: '[data-tour="perfis-new"]',
    title: "Monte perfis por vaga",
    body: "Crie um perfil e escolha, do cofre, só o que importa para cada oportunidade. Reutilize sempre.",
    placement: "bottom",
  },
  {
    route: "/portfolio",
    selector: '[data-tour="portfolio-list"]',
    title: "Publique e compartilhe",
    body: "Perfis publicados ganham um link público /p/seu-slug para enviar a recrutadores.",
    placement: "auto",
  },
  {
    route: "/analises",
    selector: '[data-tour="analises-intro"]',
    title: "Meça seu currículo",
    body: "Escolha um perfil e receba uma nota ATS de 0 a 100, com os pontos a melhorar destacados direto na prévia do currículo.",
    placement: "bottom",
  },
  {
    route: "/configuracoes",
    selector: '[data-tour="config-form"]',
    title: "Ajuste sua conta",
    body: "Dados pessoais, segurança e tema claro/escuro ficam aqui. Mantenha seu perfil sempre atualizado.",
    placement: "auto",
  },
  {
    route: "/dashboard",
    title: "Tudo pronto!",
    body: "Comece cadastrando itens no Cofre e monte seu primeiro perfil. Bom trabalho!",
  },
];
