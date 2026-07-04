"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import {
  Check,
  ChevronDown,
  Command,
  Download,
  Globe,
  Moon,
  Plus,
  Quote,
  RefreshCw,
  Smartphone,
  Sun,
  Target,
  X,
} from "lucide-react";
import { useTheme } from "@/lib/use-theme";
import { TypewriterText } from "@/components/ui/TypewriterText";

/* Paper document previews are always light, regardless of app theme. */
const paper = { background: "#fff", color: "#15171c" } as const;

const features = [
  {
    icon: Command,
    title: "Perfis ilimitados",
    body: "Uma versão para cada vaga. Todas saem do mesmo cofre, sem duplicar informação.",
  },
  {
    icon: Download,
    title: "Export PDF impecável",
    body: "Tipografia e espaçamento sempre alinhados. Nada de formatação quebrada ao salvar.",
  },
  {
    icon: Globe,
    title: "Portfólio online",
    body: "Publique um perfil como página pública. Atualiza sozinho quando você edita.",
  },
  {
    icon: RefreshCw,
    title: "Edite uma vez, propaga",
    body: "Corrigiu uma data ou um cargo? Todos os perfis que usam aquele item já refletem a mudança.",
  },
  {
    icon: Target,
    title: "Ajuste à vaga",
    body: "Veja o quanto cada perfil combina com a descrição da vaga antes de enviar.",
  },
  {
    icon: Smartphone,
    title: "Do desktop ao celular",
    body: "Ajuste um perfil rápido no celular quando a vaga aparecer — e envie na hora.",
  },
];

const stats = [
  { value: "10min", label: "para montar um perfil" },
  { value: "1", label: "cofre para toda a carreira" },
  { value: "∞", label: "perfis e exports" },
  { value: "0", label: "arquivos .docx perdidos" },
];

function ToggleOn() {
  return (
    <span className="relative block h-[18px] w-8 rounded-full bg-accent">
      <span className="absolute right-0.5 top-0.5 block h-3.5 w-3.5 rounded-full bg-white" />
    </span>
  );
}

function ToggleOff() {
  return (
    <span className="relative block h-[18px] w-8 rounded-full border border-border bg-bg3">
      <span className="absolute left-0.5 top-0.5 block h-3.5 w-3.5 rounded-full bg-text2 opacity-50" />
    </span>
  );
}

export function LandingPage() {
  const { theme, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* ===== NAV ===== */}
      <nav className="sticky top-0 z-50 border-b border-border bg-bg/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1120px] items-center gap-3.5 px-[26px] py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-[29px] w-[29px] items-center justify-center rounded-lg bg-accent font-mono text-[15px] font-semibold text-white">
              R
            </span>
            <span className="text-[16px] font-semibold tracking-[-0.01em]">
              ResumeHub
            </span>
          </div>
          <div className="ml-[22px] hidden items-center gap-1 md:flex">
            <a href="#como" className="rounded-[7px] px-3 py-[7px] text-[13.5px] text-text2 hover:bg-bg2">
              Como funciona
            </a>
            <a href="#recursos" className="rounded-[7px] px-3 py-[7px] text-[13.5px] text-text2 hover:bg-bg2">
              Recursos
            </a>
            <a href="#precos" className="rounded-[7px] px-3 py-[7px] text-[13.5px] text-text2 hover:bg-bg2">
              Preços
            </a>
          </div>
          <div className="flex-1" />
          <button
            type="button"
            onClick={toggle}
            aria-label="Alternar tema"
            className="flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-border bg-bg2 text-text2 hover:bg-bg3"
          >
            {theme === "dark" ? (
              <Sun size={16} strokeWidth={1.8} aria-hidden />
            ) : (
              <Moon size={16} strokeWidth={1.8} aria-hidden />
            )}
          </button>
          <Link href="/login" className="hidden px-3 py-2 text-[13.5px] text-text2 sm:block">
            Entrar
          </Link>
          <Link
            href="/register"
            className="rounded-[9px] bg-accent px-4 py-[9px] text-[13.5px] font-semibold text-white hover:opacity-90"
          >
            Criar cofre grátis
          </Link>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <header className="mx-auto max-w-[1120px] px-[26px] pb-[30px] pt-[70px] text-center">
        <div className="mb-[26px] inline-flex items-center gap-[9px] rounded-[30px] border border-border bg-bg2 px-3.5 py-1.5 font-mono text-[12px] text-text2">
          <span className="rh-status-dot block h-[7px] w-[7px] rounded-full bg-pos" />
          Um cofre. Infinitos currículos.
        </div>
        <h1 className="mx-auto max-w-[820px] text-[56px] font-bold leading-[1.04] tracking-[-0.03em]">
          Seu centro de comando
          <br />
          de{" "}
          <TypewriterText className="text-accent" durationMs={1100}>
            carreira
          </TypewriterText>
          .
        </h1>
        <p className="mx-auto mt-[22px] max-w-[560px] text-[17px] leading-[1.6] text-text2">
          Cadastre sua trajetória uma vez. Monte o currículo perfeito para cada
          vaga em poucos cliques — e exporte um PDF impecável, sem nunca
          reescrever nada.
        </p>
        <div className="mt-[30px] flex items-center justify-center gap-3">
          <Link
            href="/register"
            className="rounded-[11px] bg-accent px-6 py-[13px] text-[15px] font-semibold text-white hover:opacity-90"
          >
            Começar agora — é grátis
          </Link>
          <a
            href="#como"
            className="rounded-[11px] border border-border bg-bg2 px-5 py-[13px] text-[15px] font-semibold text-text hover:bg-bg3"
          >
            Ver demonstração
          </a>
        </div>
        <div className="mt-4 font-mono text-[12px] text-text3">
          sem cartão de crédito · exporte quantos PDFs quiser
        </div>

        {/* product mock */}
        <div className="rh-reveal mt-[52px] overflow-hidden rounded-2xl border border-border text-left shadow-[var(--shadow)] [--rh-delay:120ms]">
          <div className="flex items-center gap-2.5 border-b border-border bg-bg2 px-3.5 py-[11px]">
            <div className="flex gap-[7px]">
              <span className="block h-[11px] w-[11px] rounded-full bg-[#ff5f57]" />
              <span className="block h-[11px] w-[11px] rounded-full bg-[#febc2e]" />
              <span className="block h-[11px] w-[11px] rounded-full bg-[#28c840]" />
            </div>
            <div className="flex flex-1 justify-center">
              <div className="rounded-[7px] border border-border bg-bg3 px-4 py-[5px] font-mono text-[12px] text-text2">
                resumehub/perfil/front-end
              </div>
            </div>
            <div className="w-[54px]" />
          </div>
          <div className="flex h-[420px] bg-bg">
            {/* cofre rail */}
            <div className="hidden w-[210px] flex-none overflow-hidden border-r border-border bg-bg2 px-[13px] py-4 sm:block">
              <div className="mb-3 font-mono text-[10.5px] tracking-[0.14em] text-text2">
                COFRE · 52
              </div>
              <div className="flex flex-col gap-[7px]">
                <div className="flex items-center gap-[9px] rounded-lg border border-accent bg-accent-soft px-2.5 py-2">
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded bg-accent text-white">
                    <Check size={9} strokeWidth={3.5} aria-hidden />
                  </span>
                  <span className="text-[12px] font-medium text-accent-text">Empresa X · Front</span>
                </div>
                <div className="flex items-center gap-[9px] rounded-lg border border-border px-2.5 py-2">
                  <span className="block h-3.5 w-3.5 rounded border-[1.5px] border-border" />
                  <span className="text-[12px]">Empresa Z · Mobile</span>
                </div>
                <div className="flex items-center gap-[9px] rounded-lg border border-accent bg-accent-soft px-2.5 py-2">
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded bg-accent text-white">
                    <Check size={9} strokeWidth={3.5} aria-hidden />
                  </span>
                  <span className="text-[12px] font-medium text-accent-text">Empresa Y · Web</span>
                </div>
              </div>
              <div className="mb-2.5 mt-4 font-mono text-[10.5px] tracking-[0.14em] text-text2">
                SKILLS
              </div>
              <div className="flex flex-wrap gap-[5px]">
                <span className="rounded-md border border-accent bg-accent-soft px-2 py-[3px] text-[11px] text-accent-text">React</span>
                <span className="rounded-md border border-accent bg-accent-soft px-2 py-[3px] text-[11px] text-accent-text">TS</span>
                <span className="rounded-md border border-border bg-bg3 px-2 py-[3px] text-[11px] text-text2">Go</span>
              </div>
            </div>
            {/* composer */}
            <div className="flex-1 overflow-hidden border-r border-border px-5 py-[18px]">
              <div className="mb-4 flex items-center gap-[9px]">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-bg2 px-[11px] py-1.5 text-[13.5px] font-semibold">
                  Perfil Front-end
                  <ChevronDown size={14} strokeWidth={2} aria-hidden />
                </span>
                <span className="inline-flex items-center gap-[5px] rounded-full bg-warn-soft px-[9px] py-[3px] text-[11px] text-warn">
                  <span className="block h-[5px] w-[5px] rounded-full bg-warn" />
                  Rascunho
                </span>
              </div>
              <div className="mb-2 font-mono text-[10px] tracking-[0.12em] text-text2">
                EXPERIÊNCIAS INCLUÍDAS
              </div>
              <div className="flex flex-col gap-[7px]">
                <div className="flex items-center gap-2.5 rounded-[9px] border border-border bg-bg2 px-3 py-2.5">
                  <span className="block h-6 w-[5px] rounded-[3px] bg-accent" />
                  <div className="flex-1 text-[12.5px] font-semibold">Front-end · Empresa X</div>
                  <ToggleOn />
                </div>
                <div className="flex items-center gap-2.5 rounded-[9px] border border-border bg-bg2 px-3 py-2.5">
                  <span className="block h-6 w-[5px] rounded-[3px] bg-accent" />
                  <div className="flex-1 text-[12.5px] font-semibold">Web · Empresa Y</div>
                  <ToggleOn />
                </div>
                <div className="flex items-center gap-2.5 rounded-[9px] border border-dashed border-border px-3 py-2.5 opacity-55">
                  <span className="block h-6 w-[5px] rounded-[3px] bg-text2 opacity-40" />
                  <div className="flex-1 text-[12.5px] font-semibold text-text2">Mobile · Empresa Z</div>
                  <ToggleOff />
                </div>
              </div>
            </div>
            {/* pdf */}
            <div className="hidden w-[212px] flex-none flex-col items-center bg-bg3 p-4 lg:flex">
              <div className="mb-2.5 flex w-full justify-between">
                <span className="font-mono text-[9.5px] tracking-[0.1em] text-text2">PDF · AO VIVO</span>
                <span className="font-mono text-[9.5px] text-pos">●</span>
              </div>
              <div className="w-[172px] rounded-[3px] px-4 pt-4 shadow-[0_12px_30px_rgba(0,0,0,0.4)]" style={paper}>
                <div className="text-[14px] font-bold text-[#101113]">Marina Rocha</div>
                <div className="mt-px text-[8.5px] font-semibold text-[#2f5fff]">Desenvolvedora Front-end</div>
                <div className="my-2 h-px bg-[#e6e8ec]" />
                <div className="text-[7px] font-bold tracking-[0.1em] text-[#2f5fff]">EXPERIÊNCIA</div>
                <div className="mt-1.5 text-[8px] font-bold text-[#101113]">Front-end · Empresa X</div>
                <div className="mt-[5px] h-[2.5px] w-full rounded-sm bg-[#eceef2]" />
                <div className="mt-[3px] h-[2.5px] w-[88%] rounded-sm bg-[#eceef2]" />
                <div className="mt-[9px] text-[8px] font-bold text-[#101113]">Web · Empresa Y</div>
                <div className="mt-[5px] h-[2.5px] w-full rounded-sm bg-[#eceef2]" />
                <div className="mt-[3px] h-[2.5px] w-[70%] rounded-sm bg-[#eceef2]" />
                <div className="h-4" />
              </div>
            </div>
          </div>
        </div>

      </header>

      {/* ===== PROBLEMA ===== */}
      <section className="rh-reveal mx-auto max-w-[1120px] px-[26px] pb-5 pt-[60px]">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div>
            <div className="mb-3.5 font-mono text-[12px] tracking-[0.14em] text-accent">O PROBLEMA</div>
            <h2 className="text-[32px] font-bold leading-[1.12] tracking-[-0.02em]">
              O caos de manter dez versões do mesmo currículo.
            </h2>
            <p className="mt-4 text-[15.5px] leading-[1.65] text-text2">
              Arquivos Word espalhados, formatação que quebra no PDF, e a mesma
              experiência reescrita do zero a cada vaga. Você perde tempo — e às
              vezes esquece de mencionar o que mais importava.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 font-mono text-[12.5px]">
            {[
              "curriculo_final_v3_REAL.docx",
              "cv_frontend_copia (2).docx",
              "resume_ATUALIZADO_usar_esse.pdf",
            ].map((f, index) => (
              <div key={f} className="rh-reveal flex items-center gap-[11px] rounded-[9px] border border-border bg-bg2 px-3.5 py-3 text-text2" style={{ "--rh-delay": `${index * 45}ms` } as CSSProperties}>
                <X size={14} strokeWidth={2.4} className="text-danger" aria-hidden /> {f}
              </div>
            ))}
            <div className="rh-reveal flex items-center gap-[11px] rounded-[9px] border border-accent bg-accent-soft px-3.5 py-3 font-semibold text-accent-text [--rh-delay:135ms]">
              <Check size={14} strokeWidth={2.4} aria-hidden /> resumehub · 1 cofre, tudo no lugar
            </div>
          </div>
        </div>
      </section>

      {/* ===== 3 PASSOS ===== */}
      <section id="como" className="mx-auto max-w-[1120px] px-[26px] pb-5 pt-14">
        <div className="mb-11 text-center">
          <div className="mb-3.5 font-mono text-[12px] tracking-[0.14em] text-accent">COMO FUNCIONA</div>
          <h2 className="text-[34px] font-bold leading-[1.1] tracking-[-0.02em]">
            Três passos. Zero retrabalho.
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {/* passo 1 */}
          <div className="rh-reveal grid grid-cols-1 items-center gap-10 rounded-2xl border border-border bg-bg2 px-10 py-9 md:grid-cols-2">
            <div>
              <div className="mb-4 flex items-center gap-[11px]">
                <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-accent font-mono text-[15px] font-semibold text-white">1</span>
                <span className="font-mono text-[12px] tracking-[0.12em] text-text2">O INVENTÁRIO</span>
              </div>
              <h3 className="text-[24px] font-bold tracking-[-0.015em]">Cadastre uma vez só.</h3>
              <p className="mt-3 text-[15px] leading-[1.6] text-text2">
                Registre toda a sua vida profissional — empresas, projetos,
                tecnologias, idiomas e formação. Esse é o seu cofre. Uma vez lá
                dentro, você nunca mais digita de novo.
              </p>
            </div>
            <div className="flex flex-col gap-[9px] rounded-xl border border-border bg-bg3 p-5">
              {[
                { tag: "NU", title: "Front-end · Empresa X", date: "2022 — atual" },
                { tag: "ST", title: "Web · Empresa Y", date: "2019 — 2022" },
              ].map((e) => (
                <div key={e.tag} className="flex items-center gap-[11px] rounded-[9px] border border-border bg-bg2 px-[13px] py-[11px]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-bg3 font-mono text-[11px] font-semibold text-text2">{e.tag}</span>
                  <div className="flex-1">
                    <div className="text-[12.5px] font-semibold">{e.title}</div>
                    <div className="mt-px font-mono text-[10.5px] text-text2">{e.date}</div>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-[11px] rounded-[9px] border border-dashed border-border px-[13px] py-[11px] text-[12.5px] text-text2">
                <Plus size={15} strokeWidth={2} aria-hidden /> Adicionar do cofre
              </div>
            </div>
          </div>

          {/* passo 2 */}
          <div className="rh-reveal grid grid-cols-1 items-center gap-10 rounded-2xl border border-border bg-bg2 px-10 py-9 md:grid-cols-2 [--rh-delay:70ms]">
            <div className="order-2 rounded-xl border border-border bg-bg3 p-5 md:order-1">
              <div className="mb-2.5 font-mono text-[10px] tracking-[0.12em] text-text2">SELECIONE AS PEÇAS</div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2.5 rounded-[9px] border border-border bg-bg2 px-3 py-2.5">
                  <div className="flex-1 text-[12.5px] font-semibold">Projetos visuais</div>
                  <ToggleOn />
                </div>
                <div className="flex items-center gap-2.5 rounded-[9px] border border-border bg-bg2 px-3 py-2.5">
                  <div className="flex-1 text-[12.5px] font-semibold">Skills de front-end</div>
                  <ToggleOn />
                </div>
                <div className="flex items-center gap-2.5 rounded-[9px] border border-dashed border-border px-3 py-2.5 opacity-55">
                  <div className="flex-1 text-[12.5px] font-semibold text-text2">Experiência de back-end</div>
                  <ToggleOff />
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="mb-4 flex items-center gap-[11px]">
                <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-accent font-mono text-[15px] font-semibold text-white">2</span>
                <span className="font-mono text-[12px] tracking-[0.12em] text-text2">A MONTAGEM DO PERFIL</span>
              </div>
              <h3 className="text-[24px] font-bold tracking-[-0.015em]">Molde para a vaga em segundos.</h3>
              <p className="mt-3 text-[15px] leading-[1.6] text-text2">
                Surgiu uma vaga de Front-end? Crie um perfil, ligue as peças que
                importam, oculte o que não tem relação e adicione um texto
                focado. Nada de apagar e reescrever no Word.
              </p>
            </div>
          </div>

          {/* passo 3 */}
          <div className="rh-reveal grid grid-cols-1 items-center gap-10 rounded-2xl border border-border bg-bg2 px-10 py-9 md:grid-cols-2 [--rh-delay:140ms]">
            <div>
              <div className="mb-4 flex items-center gap-[11px]">
                <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-accent font-mono text-[15px] font-semibold text-white">3</span>
                <span className="font-mono text-[12px] tracking-[0.12em] text-text2">O RESULTADO FINAL</span>
              </div>
              <h3 className="text-[24px] font-bold tracking-[-0.015em]">PDF impecável e portfólio no ar.</h3>
              <p className="mt-3 text-[15px] leading-[1.6] text-text2">
                Com um clique, o ResumeHub gera um PDF perfeitamente alinhado,
                pronto para o recrutador — e, se quiser, atualiza seu portfólio
                online com a versão mais recente do perfil.
              </p>
              <div className="mt-[18px] flex gap-[9px]">
                <button type="button" className="inline-flex items-center gap-1.5 rounded-[9px] bg-accent px-4 py-2.5 text-[13.5px] font-semibold text-white hover:opacity-90">
                  <Download size={15} strokeWidth={2} aria-hidden /> Baixar PDF
                </button>
                <button type="button" className="rounded-[9px] border border-border bg-transparent px-4 py-2.5 text-[13.5px] font-semibold text-text hover:bg-bg3">Publicar portfólio</button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-[236px] rounded-[5px] px-[22px] pt-[22px] shadow-[var(--shadow)]" style={paper}>
                <div className="text-[18px] font-bold text-[#101113]">Marina Rocha</div>
                <div className="mt-0.5 text-[10px] font-semibold text-[#2f5fff]">Desenvolvedora Front-end</div>
                <div className="mt-[5px] font-mono text-[8px] text-[#6b7280]">marina@email.com · são paulo</div>
                <div className="my-3 h-px bg-[#e6e8ec]" />
                <div className="text-[8px] font-bold tracking-[0.1em] text-[#2f5fff]">EXPERIÊNCIA</div>
                <div className="mt-[7px] text-[9.5px] font-bold text-[#101113]">Front-end · Empresa X</div>
                <div className="mt-[5px] h-[3px] w-full rounded-sm bg-[#eceef2]" />
                <div className="mt-1 h-[3px] w-[90%] rounded-sm bg-[#eceef2]" />
                <div className="mt-[9px] text-[9.5px] font-bold text-[#101113]">Web · Empresa Y</div>
                <div className="mt-[5px] h-[3px] w-full rounded-sm bg-[#eceef2]" />
                <div className="mt-[11px] text-[8px] font-bold tracking-[0.1em] text-[#2f5fff]">HABILIDADES</div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  <span className="rounded font-mono text-[8px] bg-[#eef3ff] px-[7px] py-0.5 text-[#1d44c7]">React</span>
                  <span className="rounded font-mono text-[8px] bg-[#eef3ff] px-[7px] py-0.5 text-[#1d44c7]">TypeScript</span>
                </div>
                <div className="h-[22px]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== RECURSOS ===== */}
      <section id="recursos" className="mx-auto max-w-[1120px] px-[26px] pb-5 pt-14">
        <div className="mb-10 text-center">
          <div className="mb-3.5 font-mono text-[12px] tracking-[0.14em] text-accent">RECURSOS</div>
          <h2 className="text-[34px] font-bold leading-[1.1] tracking-[-0.02em]">
            Feito para quem vive em movimento.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, index) => (
            <div key={f.title} className="rh-reveal rounded-[14px] border border-border bg-bg2 p-6" style={{ "--rh-delay": `${index * 45}ms` } as CSSProperties}>
              <div className="mb-4 flex h-[38px] w-[38px] items-center justify-center rounded-[10px] border border-accent bg-accent-soft text-accent-text">
                <f.icon size={18} strokeWidth={1.8} aria-hidden />
              </div>
              <h3 className="text-[16px] font-semibold">{f.title}</h3>
              <p className="mt-2 text-[13.5px] leading-[1.6] text-text2">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PROVA ===== */}
      {false && (
      <section className="mx-auto max-w-[1120px] px-[26px] pb-5 pt-14">
        <div className="grid grid-cols-1 items-center gap-11 rounded-[18px] border border-border bg-bg2 px-12 py-11 md:grid-cols-[1.3fr_1fr]">
          <div>
            <Quote size={26} strokeWidth={2} className="mb-4 text-accent" aria-hidden />

            <p className="text-[21px] font-medium leading-[1.5] tracking-[-0.01em]">
              Eu tinha seis versões do meu currículo em pastas diferentes. Agora
              é um cofre só — em dez minutos monto o perfil certo para cada
              processo.
            </p>
            <div className="mt-[22px] flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-accent font-mono text-[14px] font-semibold text-white">MR</span>
              <div>
                <div className="text-[14px] font-semibold">Marina Rocha</div>
                <div className="text-[12.5px] text-text2">Desenvolvedora Front-end</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-mono text-[34px] font-semibold tracking-[-0.02em] text-accent">{s.value}</div>
                <div className="mt-1.5 text-[12.5px] text-text2">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ===== PREÇOS (desativada) ===== */}
      {false && (
      <section id="precos" className="mx-auto max-w-[1120px] px-[26px] pb-5 pt-14">
        <div className="mb-10 text-center">
          <div className="mb-3.5 font-mono text-[12px] tracking-[0.14em] text-accent">PREÇOS</div>
          <h2 className="text-[34px] font-bold leading-[1.1] tracking-[-0.02em]">
            Comece de graça. Cresça quando precisar.
          </h2>
        </div>
        <div className="mx-auto grid max-w-[760px] grid-cols-1 gap-4 sm:grid-cols-2">
          {/* free */}
          <div className="rounded-2xl border border-border bg-bg2 px-7 py-[30px]">
            <div className="font-mono text-[12px] tracking-[0.12em] text-text2">FREE</div>
            <div className="mb-1 mt-3 flex items-baseline gap-1.5">
              <span className="text-[38px] font-bold tracking-[-0.02em]">R$0</span>
              <span className="text-[13px] text-text2">/ sempre</span>
            </div>
            <p className="mb-5 text-[13px] text-text2">Tudo que você precisa para começar.</p>
            <div className="flex flex-col gap-2.5 text-[13.5px]">
              <div className="flex items-center gap-[9px]"><span className="text-pos">✓</span> Cofre completo</div>
              <div className="flex items-center gap-[9px]"><span className="text-pos">✓</span> Até 3 perfis</div>
              <div className="flex items-center gap-[9px]"><span className="text-pos">✓</span> Export PDF ilimitado</div>
              <div className="flex items-center gap-[9px] text-text3"><span>—</span> Portfólio online</div>
            </div>
            <Link href="/register" className="mt-6 block rounded-[10px] border border-border bg-bg3 py-[11px] text-center text-[14px] font-semibold text-text hover:bg-bg2">
              Criar cofre grátis
            </Link>
          </div>
          {/* pro */}
          <div className="relative rounded-2xl border-[1.5px] border-accent bg-bg2 px-7 py-[30px] shadow-[var(--shadow)]">
            <span className="absolute -top-[11px] right-6 rounded-full bg-accent px-2.5 py-1 font-mono text-[10.5px] tracking-[0.08em] text-white">POPULAR</span>
            <div className="font-mono text-[12px] tracking-[0.12em] text-accent-text">PRO</div>
            <div className="mb-1 mt-3 flex items-baseline gap-1.5">
              <span className="text-[38px] font-bold tracking-[-0.02em]">R$19</span>
              <span className="text-[13px] text-text2">/ mês</span>
            </div>
            <p className="mb-5 text-[13px] text-text2">Para quem está em processo ativo.</p>
            <div className="flex flex-col gap-2.5 text-[13.5px]">
              <div className="flex items-center gap-[9px]"><span className="text-pos">✓</span> Tudo do Free</div>
              <div className="flex items-center gap-[9px]"><span className="text-pos">✓</span> Perfis ilimitados</div>
              <div className="flex items-center gap-[9px]"><span className="text-pos">✓</span> Portfólio online + domínio</div>
              <div className="flex items-center gap-[9px]"><span className="text-pos">✓</span> Ajuste à vaga e análises</div>
            </div>
            <Link href="/register" className="mt-6 block rounded-[10px] bg-accent py-[11px] text-center text-[14px] font-semibold text-white hover:opacity-90">
              Assinar o Pro
            </Link>
          </div>
        </div>
      </section>
      )}

      {/* ===== CTA FINAL ===== */}
      <section className="mx-auto max-w-[1120px] px-[26px] py-[60px]">
        <div className="rh-reveal relative overflow-hidden rounded-[20px] bg-accent px-10 py-14 text-center">
          <div className="mb-4 font-mono text-[12px] tracking-[0.16em] text-white/75">RESUMEHUB</div>
          <h2 className="mx-auto max-w-[600px] text-[38px] font-bold leading-[1.1] tracking-[-0.02em] text-white">
            Pare de reescrever. Comece a selecionar.
          </h2>
          <p className="mx-auto mt-4 max-w-[460px] text-[16px] leading-[1.55] text-white/85">
            Monte seu cofre hoje e tenha o currículo perfeito pronto para a
            próxima vaga.
          </p>
          <Link href="/register" className="mt-7 inline-block rounded-xl bg-white px-7 py-3.5 text-[15px] font-bold text-accent hover:opacity-90">
            Criar meu cofre grátis
          </Link>
          <div className="mt-3.5 font-mono text-[12px] text-white/70">sem cartão · pronto em minutos</div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-[1120px] flex-wrap items-start gap-10 px-[26px] py-10">
          <div className="min-w-[220px] flex-1">
            <div className="mb-3 flex items-center gap-2.5">
              <span className="flex h-[27px] w-[27px] items-center justify-center rounded-[7px] bg-accent font-mono text-[14px] font-semibold text-white">R</span>
              <span className="text-[15px] font-semibold">ResumeHub</span>
            </div>
            <p className="max-w-[280px] text-[13px] leading-[1.6] text-text2">
              Seu centro de comando de carreira. Um cofre, infinitos currículos.
            </p>
          </div>
          <div className="flex flex-wrap gap-14">
            <div className="flex flex-col gap-[9px]">
              <div className="mb-[3px] font-mono text-[11px] tracking-[0.1em] text-text3">PRODUTO</div>
              <a href="#como" className="text-[13px] text-text2 hover:text-text">Como funciona</a>
              <a href="#recursos" className="text-[13px] text-text2 hover:text-text">Recursos</a>
              <a href="#precos" className="text-[13px] text-text2 hover:text-text">Preços</a>
            </div>
            <div className="flex flex-col gap-[9px] hidden">
              <div className="mb-[3px] font-mono text-[11px] tracking-[0.1em] text-text3">EMPRESA</div>
              <a href="#" className="text-[13px] text-text2 hover:text-text">Sobre</a>
              <a href="#" className="text-[13px] text-text2 hover:text-text">Blog</a>
              <a href="#" className="text-[13px] text-text2 hover:text-text">Contato</a>
            </div>
            <div className="flex flex-col gap-[9px]">
              <div className="mb-[3px] font-mono text-[11px] tracking-[0.1em] text-text3">LEGAL</div>
              <Link href="/privacidade" className="text-[13px] text-text2 hover:text-text">Privacidade</Link>
              <Link href="/termos" className="text-[13px] text-text2 hover:text-text">Termos</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto flex max-w-[1120px] flex-wrap justify-between gap-2.5 px-[26px] py-[18px] font-mono text-[11.5px] text-text3">
            <span>© {new Date().getFullYear()} ResumeHub</span>
            <span>feito para quem constrói</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
