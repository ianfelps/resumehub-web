"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge, Tag } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState, Skeleton } from "@/components/ui/Misc";
import { AlertIcon, CheckIcon, XIcon } from "@/components/ui/icons";
import { PageContainer } from "@/components/layout/PageContainer";
import {
  ResumeDocument,
  type ResumeAnnotations,
  type ResumeRegionKey,
} from "@/components/resume/ResumeDocument";
import { useProfileAnalysis, useProfiles } from "@/lib/query/hooks";
import type {
  AnalysisCheck,
  AnalysisStatus,
  ProfileAnalysisResponse,
} from "@/lib/types";

export function AnalysisView() {
  const { data: profiles, isLoading } = useProfiles();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = (profiles ?? []).find((p) => p.id === selectedId) ?? null;

  return (
    <PageContainer>
      <div className="mb-5" data-tour="analises-intro">
        <h1 className="text-[20px] font-semibold tracking-tight">Análises</h1>
        <p className="mt-0.5 text-[12.5px] text-text2">
          Teste ATS geral do seu currículo — uma nota de 0 a 100 a partir do PDF
          gerado, sem depender de vaga específica.
        </p>
      </div>

      {selected ? (
        <AnalysisPanel
          profileId={selected.id}
          profileName={selected.name}
          onBack={() => setSelectedId(null)}
        />
      ) : isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : (profiles ?? []).length === 0 ? (
        <EmptyState
          title="Nenhum perfil para analisar"
          description="Crie um perfil na aba Perfis e monte-o com itens do cofre para poder analisá-lo aqui."
        />
      ) : (
        <div>
          <p className="mb-3 text-[12.5px] text-text2">
            Selecione um perfil para analisar:
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(profiles ?? []).map((p, index) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedId(p.id)}
                className="rh-reveal text-left"
                style={{ "--rh-delay": `${index * 45}ms` } as CSSProperties}
              >
                <Card className="flex flex-col p-4 transition-colors hover:border-accent">
                  <span className="text-[14px] font-semibold leading-snug">
                    {p.name}
                  </span>
                  <span className="mt-1 font-mono text-[12px] text-text2">
                    /{p.slug}
                  </span>
                  <span className="mt-3 text-[12.5px] font-medium text-accent-text">
                    Analisar →
                  </span>
                </Card>
              </button>
            ))}
          </div>

          <CriteriaSection />
        </div>
      )}
    </PageContainer>
  );
}

function CriteriaSection() {
  const grouped = groupCriteria(CRITERIA);

  return (
    <div className="mt-8">
      <h2 className="text-[15px] font-semibold tracking-tight">
        Como calculamos a nota
      </h2>
      <p className="mt-0.5 text-[12.5px] text-text2">
        A nota vai de 0 a 100, somando {CRITERIA.length} critérios de boas
        práticas aplicados ao texto do currículo. Sem IA e sem vaga específica.
      </p>

      <div className="mt-3 gap-3 sm:columns-2">
        {grouped.map(([category, items]) => (
          <Card key={category} className="mb-3 break-inside-avoid p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-text2">
                {category}
              </span>
              <Badge tone="neutral">
                {items.reduce((sum, c) => sum + c.points, 0)} pts
              </Badge>
            </div>
            <ul className="flex flex-col gap-3">
              {items.map((c) => (
                <li key={c.label}>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[13px] font-medium">{c.label}</span>
                    <span className="font-mono text-[11px] tabular-nums text-text3">
                      {c.points}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[12px] text-text2">{c.description}</p>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AnalysisPanel({
  profileId,
  profileName,
  onBack,
}: {
  profileId: string;
  profileName: string;
  onBack: () => void;
}) {
  const { data, isLoading, isError, refetch, isFetching } =
    useProfileAnalysis(profileId);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Button variant="secondary" size="sm" onClick={onBack}>
          ← Perfis
        </Button>
        <div className="text-[14px] font-semibold">{profileName}</div>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          {isFetching ? "Analisando…" : "Reanalisar"}
        </Button>
      </div>

      {isLoading ? (
        <AnalysisLoading />
      ) : isError || !data ? (
        <EmptyState
          title="Não foi possível analisar"
          description="Ocorreu um erro ao gerar a análise deste currículo. Tente novamente."
          action={
            <Button size="sm" onClick={() => refetch()}>
              Tentar de novo
            </Button>
          }
        />
      ) : (
        <AnalysisResult data={data} />
      )}
    </div>
  );
}

const LOADING_STEPS = [
  "Gerando o PDF do currículo…",
  "Lendo o texto como um ATS…",
  "Avaliando os critérios…",
  "Destacando pontos a melhorar…",
];

function AnalysisLoading() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const timer = setInterval(
      () => setStep((s) => (s + 1) % LOADING_STEPS.length),
      1400,
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,380px)_1fr]">
      <Card className="flex flex-col items-center gap-4 p-6">
        <IndeterminateGauge />
        <div className="h-5 overflow-hidden text-center">
          <span key={step} className="rh-reveal inline-block text-[13px] font-medium text-text2">
            {LOADING_STEPS[step]}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {LOADING_STEPS.map((label, i) => (
            <span
              key={label}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === step ? 20 : 6,
                background:
                  i === step ? "var(--color-accent)" : "var(--color-bg3)",
              }}
            />
          ))}
        </div>
      </Card>

      <div className="lg:sticky lg:top-6">
        <div className="mb-2 text-[12px] text-text2">
          Analisando o currículo…
        </div>
        <div className="rounded-[12px] border border-border bg-bg3 p-4 sm:p-6">
          <DocScanSkeleton />
        </div>
      </div>
    </div>
  );
}

function IndeterminateGauge() {
  const r = 52;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative h-[132px] w-[132px]">
      <svg
        className="rh-spin h-full w-full"
        viewBox="0 0 132 132"
        style={{ transformOrigin: "center" }}
      >
        <circle cx="66" cy="66" r={r} fill="none" strokeWidth="10" className="stroke-bg3" />
        <circle
          cx="66"
          cy="66"
          r={r}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          stroke="var(--color-accent)"
          strokeDasharray={`${circ * 0.28} ${circ}`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[26px] font-bold leading-none text-text3">…</span>
      </div>
    </div>
  );
}

function DocScanSkeleton() {
  return (
    <div
      className="relative mx-auto w-full max-w-[720px] overflow-hidden rounded-[6px] bg-white px-8 py-9 sm:px-12 sm:py-12"
      style={{ boxShadow: "0 18px 44px rgba(0,0,0,.18)" }}
    >
      <div className="rh-shimmer-doc h-6 w-1/2" />
      <div className="rh-shimmer-doc mt-2.5 h-3 w-1/3" />
      <div className="rh-shimmer-doc mt-3 h-2.5 w-2/3" />

      <div className="mt-6 flex flex-col gap-2">
        <div className="rh-shimmer-doc h-2.5 w-full" />
        <div className="rh-shimmer-doc h-2.5 w-11/12" />
        <div className="rh-shimmer-doc h-2.5 w-4/5" />
      </div>

      {[0, 1, 2].map((s) => (
        <div key={s} className="mt-6">
          <div className="rh-shimmer-doc h-3 w-40" />
          <div className="mt-3 flex flex-col gap-2">
            <div className="rh-shimmer-doc h-2.5 w-1/2" />
            <div className="rh-shimmer-doc h-2.5 w-full" />
            <div className="rh-shimmer-doc h-2.5 w-5/6" />
          </div>
        </div>
      ))}

      <div
        className="rh-scanline pointer-events-none absolute inset-x-0 h-[3px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
          boxShadow:
            "0 0 14px 2px color-mix(in srgb, var(--color-accent) 55%, transparent)",
        }}
      />
    </div>
  );
}

function AnalysisResult({ data }: { data: ProfileAnalysisResponse }) {
  const grouped = groupByCategory(data.checks);
  const [activeRegion, setActiveRegion] = useState<ResumeRegionKey | null>(null);

  // Number the improvable checks that map to a document region, and aggregate
  // those numbers/tones per region for the preview highlights.
  const numberByCheckId = new Map<string, number>();
  const regionData = new Map<
    ResumeRegionKey,
    { tone: "warn" | "fail"; markers: number[] }
  >();
  let counter = 0;
  for (const c of data.checks) {
    const region = CHECK_REGION[c.id];
    if (!region || c.status === "pass") continue;
    counter += 1;
    numberByCheckId.set(c.id, counter);
    const entry = regionData.get(region) ?? { tone: "warn" as const, markers: [] };
    entry.markers.push(counter);
    if (c.status === "fail") entry.tone = "fail";
    regionData.set(region, entry);
  }

  const annotations: ResumeAnnotations = {};
  for (const [region, entry] of regionData) {
    annotations[region] = { ...entry, active: activeRegion === region };
  }

  const focusRegion = (region: ResumeRegionKey | null) => {
    setActiveRegion(region);
    if (region) {
      document
        .getElementById(`rh-region-${region}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const hasPreview = Boolean(data.resume);

  return (
    <div
      className={
        hasPreview
          ? "grid items-start gap-4 lg:grid-cols-[minmax(0,380px)_1fr]"
          : "grid items-start gap-4"
      }
    >
      <div className="flex flex-col gap-4">
        <Card className="flex flex-col items-center gap-3 p-6">
          <ScoreGauge score={data.score} />
          <Badge tone={scoreTone(data.score)}>{data.rating}</Badge>
          <p className="text-center text-[12px] text-text2">
            Pontuação ATS geral baseada em {data.checks.length} critérios de
            boas práticas.
          </p>
        </Card>

        {grouped.map(([category, checks]) => (
          <Card key={category} className="p-4">
            <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-text2">
              {category}
            </div>
            <ul className="flex flex-col divide-y divide-border">
              {checks.map((c) => (
                <CheckRow
                  key={c.id}
                  check={c}
                  number={numberByCheckId.get(c.id)}
                  region={CHECK_REGION[c.id]}
                  onHover={setActiveRegion}
                  onSelect={focusRegion}
                />
              ))}
            </ul>
          </Card>
        ))}

        <Card className="p-4">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-text2">
            Palavras-chave mais frequentes
          </div>
          {data.topKeywords.length === 0 ? (
            <p className="text-[12.5px] text-text2">
              Nenhuma palavra-chave relevante detectada.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {data.topKeywords.map((k) => (
                <Tag key={k.term}>
                  {k.term}
                  <span className="ml-1.5 font-mono text-[11px] text-text3">
                    {k.count}
                  </span>
                </Tag>
              ))}
            </div>
          )}
        </Card>
      </div>

      {data.resume ? (
        <div className="lg:sticky lg:top-6">
          <div className="mb-2 text-[12px] text-text2">
            Prévia do currículo — as áreas destacadas correspondem aos pontos a
            melhorar.
          </div>
          <div className="max-h-[calc(100vh-7rem)] overflow-auto rounded-[12px] border border-border bg-bg3 p-4 sm:p-6">
            <ResumeDocument data={data.resume} annotations={annotations} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

// Maps an improvable check to the resume region it points at. Checks absent here
// (páginas, densidade, palavras-chave) are document-wide and have no highlight.
const CHECK_REGION: Record<string, ResumeRegionKey> = {
  contato: "contato",
  resumo: "resumo",
  experiencia: "experiencia",
  metricas: "experiencia",
  verbos: "experiencia",
  habilidades: "habilidades",
  formacao: "formacao",
};

function CheckRow({
  check,
  number,
  region,
  onHover,
  onSelect,
}: {
  check: AnalysisCheck;
  number?: number;
  region?: ResumeRegionKey;
  onHover: (region: ResumeRegionKey | null) => void;
  onSelect: (region: ResumeRegionKey | null) => void;
}) {
  const interactive = number !== undefined && region !== undefined;
  const tone = check.status === "fail" ? "#dc2626" : "#d97706";

  return (
    <li
      className={cnRow(interactive)}
      onMouseEnter={interactive ? () => onHover(region!) : undefined}
      onMouseLeave={interactive ? () => onHover(null) : undefined}
      onClick={interactive ? () => onSelect(region!) : undefined}
    >
      {interactive ? (
        <span
          className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full text-[11px] font-bold text-white"
          style={{ background: tone }}
        >
          {number}
        </span>
      ) : (
        <StatusIcon status={check.status} />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium">{check.label}</span>
          <span className="font-mono text-[11px] text-text3">
            {check.points}/{check.maxPoints}
          </span>
        </div>
        {check.hint && check.status !== "pass" ? (
          <p className="mt-0.5 text-[12px] text-text2">{check.hint}</p>
        ) : null}
      </div>
    </li>
  );
}

function cnRow(interactive: boolean): string {
  return interactive
    ? "flex cursor-pointer items-start gap-3 py-2.5 transition-colors hover:bg-bg3"
    : "flex items-start gap-3 py-2.5";
}

function StatusIcon({ status }: { status: AnalysisStatus }) {
  if (status === "pass") {
    return (
      <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-pos-soft text-pos">
        <CheckIcon className="h-3.5 w-3.5" />
      </span>
    );
  }
  if (status === "warn") {
    return (
      <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-warn-soft text-warn">
        <AlertIcon className="h-3.5 w-3.5" />
      </span>
    );
  }
  return (
    <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-danger/10 text-danger">
      <XIcon className="h-3.5 w-3.5" />
    </span>
  );
}

function ScoreGauge({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(100, score));
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  const color = scoreColor(pct);

  return (
    <div className="relative h-[132px] w-[132px]">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 132 132">
        <circle
          cx="66"
          cy="66"
          r={r}
          fill="none"
          strokeWidth="10"
          className="stroke-bg3"
        />
        <circle
          cx="66"
          cy="66"
          r={r}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          stroke={color}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 600ms ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[32px] font-bold leading-none tabular-nums">
          {pct}
        </span>
        <span className="mt-0.5 text-[11px] text-text2">/ 100</span>
      </div>
    </div>
  );
}

// ---- criteria (mirrors the weights/categories in the backend AtsAnalyzer) ----

interface Criterion {
  label: string;
  category: string;
  points: number;
  description: string;
}

const CRITERIA: Criterion[] = [
  {
    label: "Contato completo",
    category: "Identificação",
    points: 12,
    description: "E-mail, telefone e ao menos um link (LinkedIn, GitHub ou site).",
  },
  {
    label: "Resumo profissional",
    category: "Conteúdo",
    points: 12,
    description: "Um resumo de 2–4 linhas no topo do currículo.",
  },
  {
    label: "Experiência com períodos",
    category: "Conteúdo",
    points: 13,
    description: "Seção de experiência com os períodos (mês/ano) de cada cargo.",
  },
  {
    label: "Habilidades",
    category: "Conteúdo",
    points: 10,
    description: "Seção de habilidades técnicas e comportamentais.",
  },
  {
    label: "Formação",
    category: "Conteúdo",
    points: 8,
    description: "Sua formação acadêmica.",
  },
  {
    label: "Resultados quantificáveis",
    category: "Impacto",
    points: 12,
    description: "Conquistas com números, ex.: \"reduzi custos em 20%\".",
  },
  {
    label: "Verbos de ação",
    category: "Impacto",
    points: 10,
    description: "Frases iniciadas por verbos (desenvolvi, liderei, otimizei…).",
  },
  {
    label: "Comprimento adequado",
    category: "Estrutura",
    points: 6,
    description: "Currículo em 1–2 páginas.",
  },
  {
    label: "Densidade de texto",
    category: "Estrutura",
    points: 5,
    description: "Volume de conteúdo equilibrado — nem curto, nem excessivo.",
  },
  {
    label: "Riqueza de palavras-chave",
    category: "Palavras-chave",
    points: 12,
    description: "Vocabulário técnico variado e recorrente da sua área.",
  },
];

function groupCriteria(items: Criterion[]): [string, Criterion[]][] {
  const order: string[] = [];
  const map = new Map<string, Criterion[]>();
  for (const c of items) {
    if (!map.has(c.category)) {
      map.set(c.category, []);
      order.push(c.category);
    }
    map.get(c.category)!.push(c);
  }
  return order.map((cat) => [cat, map.get(cat)!]);
}

// ---- helpers ----

function groupByCategory(checks: AnalysisCheck[]): [string, AnalysisCheck[]][] {
  const order: string[] = [];
  const map = new Map<string, AnalysisCheck[]>();
  for (const c of checks) {
    if (!map.has(c.category)) {
      map.set(c.category, []);
      order.push(c.category);
    }
    map.get(c.category)!.push(c);
  }
  return order.map((cat) => [cat, map.get(cat)!]);
}

function scoreTone(score: number): "pos" | "warn" | "accent" {
  if (score >= 70) return "pos";
  if (score >= 50) return "accent";
  return "warn";
}

// Reads the app's semantic colors from CSS variables so the gauge matches theme.
function scoreColor(score: number): string {
  if (score >= 70) return "var(--color-pos)";
  if (score >= 50) return "var(--color-accent)";
  return "var(--color-danger)";
}
