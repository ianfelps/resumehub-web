import {
  languageProficiencyLabels,
  skillLevelLabels,
} from "@/lib/enums";
import { formatPeriod, formatMonthYear } from "@/lib/format";
import { Markdown } from "@/components/ui/Markdown";
import type { PublicResumeResponse } from "@/lib/types";

/**
 * The assembled resume "paper". Intentionally uses fixed light colors (it's a
 * document, not chrome) so it looks identical in both themes. Shared by the
 * builder's live preview and the public portfolio page.
 *
 * The analysis page passes `annotations` to highlight the regions the ATS score
 * flags for improvement; when omitted the document renders exactly as before.
 */

/** Regions of the document an analysis check can point at. */
export type ResumeRegionKey =
  | "contato"
  | "resumo"
  | "experiencia"
  | "habilidades"
  | "formacao";

export interface ResumeAnnotation {
  tone: "warn" | "fail";
  /** Numbers shown on the region marker, tying it back to the checklist. */
  markers: number[];
  /** Emphasized because the matching checklist item is hovered/focused. */
  active?: boolean;
}

export type ResumeAnnotations = Partial<
  Record<ResumeRegionKey, ResumeAnnotation>
>;

/** Ensures a link is absolute (prefix https:// when the scheme is missing). */
function href(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

/** Short display label for a URL (last path segment or hostname). */
function linkLabel(url: string): string {
  try {
    const u = new URL(href(url));
    const seg = u.pathname.split("/").filter(Boolean).pop();
    return seg ? `${u.hostname.replace(/^www\./, "")}/${seg}` : u.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function ResumeDocument({
  data,
  annotations,
}: {
  data: PublicResumeResponse;
  annotations?: ResumeAnnotations;
}) {
  const { owner } = data;
  const linkStyle = {
    color: "#2f5fff",
    textDecoration: "underline",
    textUnderlineOffset: "2px",
  } as const;
  const contacts = [
    owner.location ? { key: "loc", node: <span>{owner.location}</span> } : null,
    owner.phoneNumber ? { key: "tel", node: <span>{owner.phoneNumber}</span> } : null,
    owner.email
      ? {
          key: "mail",
          node: (
            <a href={`mailto:${owner.email}`} style={linkStyle}>
              {owner.email}
            </a>
          ),
        }
      : null,
    owner.linkedInUrl
      ? {
          key: "linkedin",
          node: (
            <a href={href(owner.linkedInUrl)} target="_blank" rel="noreferrer" style={linkStyle}>
              linkedin
            </a>
          ),
        }
      : null,
    owner.gitHubUrl
      ? {
          key: "github",
          node: (
            <a href={href(owner.gitHubUrl)} target="_blank" rel="noreferrer" style={linkStyle}>
              github
            </a>
          ),
        }
      : null,
    owner.websiteUrl
      ? {
          key: "website",
          node: (
            <a href={href(owner.websiteUrl)} target="_blank" rel="noreferrer" style={linkStyle}>
              {linkLabel(owner.websiteUrl)}
            </a>
          ),
        }
      : null,
  ].filter((c): c is { key: string; node: React.ReactElement } => c !== null);

  const header = (
    <header>
      <h1 className="text-[26px] font-bold leading-tight tracking-tight text-[#101113]">
        {owner.fullName ?? data.name}
      </h1>
      {owner.headline ? (
        <div className="mt-0.5 text-[13px] font-semibold text-[#2f5fff]">
          {owner.headline}
        </div>
      ) : null}
      {contacts.length > 0 ? (
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11px] text-[#6b7280]">
          {contacts.map((ct, i) => (
            <span key={ct.key} className="flex items-center gap-2.5">
              {i > 0 && <span className="text-[#c4c9d2]">·</span>}
              {ct.node}
            </span>
          ))}
        </div>
      ) : annotations?.contato ? (
        <div className="mt-1.5 font-mono text-[11px] text-[#9aa1ad]">
          Sem informações de contato — adicione e-mail, telefone e um link.
        </div>
      ) : null}
    </header>
  );

  return (
    <div
      className="mx-auto w-full max-w-[720px] rounded-[6px] bg-white px-8 py-9 text-[#15171c] sm:px-12 sm:py-12"
      style={{ boxShadow: "0 18px 44px rgba(0,0,0,.18)" }}
    >
      <Region id="contato" annotation={annotations?.contato}>
        {header}
      </Region>

      <ResumeSummary summary={data.summary} annotation={annotations?.resumo} />

      <AnnotatedSection
        title="Experiência"
        regionKey="experiencia"
        show={data.experiences.length > 0}
        annotation={annotations?.experiencia}
        missingHint="Adicione experiências profissionais com períodos e resultados quantificáveis."
      >
        {data.experiences.map((e) => (
          <Entry
            key={e.id}
            title={`${e.role} · ${e.company}`}
            period={formatPeriod(e.startDate, e.endDate)}
            subtitle={e.location ?? undefined}
            body={
              <Markdown
                content={e.description}
                className="mt-1.5 text-[11.5px] leading-relaxed text-[#4b5563]"
              />
            }
          />
        ))}
      </AnnotatedSection>

      <Section title="Projetos" show={data.projects.length > 0}>
        {data.projects.map((p) => (
          <Entry
            key={p.id}
            title={p.name}
            period={p.date ? formatMonthYear(p.date) : undefined}
            subtitle={p.url ?? undefined}
            body={
              <div className="mt-1.5 text-[11.5px] leading-relaxed text-[#4b5563]">
                <Markdown content={p.description} />
              </div>
            }
          />
        ))}
      </Section>

      <AnnotatedSection
        title="Formação"
        regionKey="formacao"
        show={data.education.length > 0}
        annotation={annotations?.formacao}
        missingHint="Inclua sua formação acadêmica."
      >
        {data.education.map((ed) => (
          <Entry
            key={ed.id}
            title={ed.degree}
            period={formatPeriod(ed.startDate, ed.endDate)}
            subtitle={[ed.institution, ed.field].filter(Boolean).join(" · ")}
          />
        ))}
      </AnnotatedSection>

      <AnnotatedSection
        title="Habilidades"
        regionKey="habilidades"
        show={data.skills.length > 0}
        annotation={annotations?.habilidades}
        missingHint="Liste suas principais habilidades técnicas e comportamentais."
      >
        <div className="flex flex-wrap gap-1.5">
          {data.skills.map((s) => (
            <span
              key={s.id}
              className="rounded-[4px] bg-[#eef3ff] px-2 py-1 font-mono text-[10.5px] text-[#1d44c7]"
            >
              {s.name}
              <span className="text-[#6b86e0]"> · {skillLevelLabels[s.level]}</span>
            </span>
          ))}
        </div>
      </AnnotatedSection>

      {data.languages.length > 0 ? (
        <Section title="Idiomas" show>
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[12px] text-[#374151]">
            {data.languages.map((l) => (
              <span key={l.id}>
                <span className="font-semibold">{l.name}</span>
                <span className="text-[#6b7280]">
                  {" "}
                  — {languageProficiencyLabels[l.proficiency]}
                </span>
              </span>
            ))}
          </div>
        </Section>
      ) : null}

      <Section title="Cursos" show={data.courses.length > 0}>
        {data.courses.map((c) => (
          <Entry
            key={c.id}
            title={c.name}
            period={c.completionDate ? formatMonthYear(c.completionDate) : undefined}
            subtitle={c.provider ?? undefined}
          />
        ))}
      </Section>
    </div>
  );
}

/** Wraps a region with a colored highlight + numbered marker when annotated. */
function Region({
  id,
  annotation,
  children,
}: {
  id: ResumeRegionKey;
  annotation?: ResumeAnnotation;
  children: React.ReactNode;
}) {
  if (!annotation) return <>{children}</>;
  const color = annotation.tone === "fail" ? "#dc2626" : "#d97706";
  return (
    <div
      id={`rh-region-${id}`}
      className="relative scroll-mt-6 rounded-[8px] transition-all"
      style={{
        outline: `2px ${annotation.active ? "solid" : "dashed"} ${color}`,
        outlineOffset: 5,
        background: annotation.active ? `${color}18` : `${color}0a`,
      }}
    >
      <span
        className="pointer-events-none absolute -top-2.5 right-1 z-10 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
        style={{ background: color }}
      >
        {annotation.markers.join(" · ")}
      </span>
      {children}
    </div>
  );
}

function ResumeSummary({
  summary,
  annotation,
}: {
  summary?: string | null;
  annotation?: ResumeAnnotation;
}) {
  if (!annotation) {
    return (
      <Markdown
        content={summary}
        className="mt-4 text-[12.5px] leading-relaxed text-[#4b5563]"
      />
    );
  }
  const has = Boolean(summary && summary.trim());
  return (
    <Region id="resumo" annotation={annotation}>
      {has ? (
        <Markdown
          content={summary}
          className="mt-4 text-[12.5px] leading-relaxed text-[#4b5563]"
        />
      ) : (
        <div className="mt-4 text-[11.5px] italic text-[#9aa1ad]">
          Adicione um resumo profissional de 2–4 linhas no topo do currículo.
        </div>
      )}
    </Region>
  );
}

/** A section that can also render a placeholder when absent-but-flagged. */
function AnnotatedSection({
  title,
  regionKey,
  show,
  annotation,
  missingHint,
  children,
}: {
  title: string;
  regionKey: ResumeRegionKey;
  show: boolean;
  annotation?: ResumeAnnotation;
  missingHint: string;
  children: React.ReactNode;
}) {
  if (!show) {
    if (!annotation) return null;
    return (
      <Region id={regionKey} annotation={annotation}>
        <section className="mt-6">
          <h2 className="border-b border-dashed border-[#e6e8ec] pb-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#9aa1ad]">
            {title}
          </h2>
          <div className="mt-2 text-[11.5px] italic text-[#9aa1ad]">
            {missingHint}
          </div>
        </section>
      </Region>
    );
  }
  return (
    <Region id={regionKey} annotation={annotation}>
      <Section title={title} show>
        {children}
      </Section>
    </Region>
  );
}

function Section({
  title,
  show,
  children,
}: {
  title: string;
  show: boolean;
  children: React.ReactNode;
}) {
  if (!show) return null;
  return (
    <section className="mt-6">
      <h2 className="border-b border-[#e6e8ec] pb-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#2f5fff]">
        {title}
      </h2>
      <div className="mt-3 flex flex-col gap-3.5">{children}</div>
    </section>
  );
}

function Entry({
  title,
  period,
  subtitle,
  body,
}: {
  title: string;
  period?: string;
  subtitle?: string;
  body?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[12.5px] font-bold text-[#101113]">{title}</span>
        {period ? (
          <span className="flex-none font-mono text-[10px] text-[#9aa1ad]">
            {period}
          </span>
        ) : null}
      </div>
      {subtitle ? (
        <div className="mt-0.5 text-[11px] text-[#6b7280]">{subtitle}</div>
      ) : null}
      {body}
    </div>
  );
}
