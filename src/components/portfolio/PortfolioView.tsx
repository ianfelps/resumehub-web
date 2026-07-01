import {
  languageProficiencyLabels,
  skillCategoryLabels,
  skillLevelLabels,
} from "@/lib/enums";
import { formatMonthYear, formatPeriod } from "@/lib/format";
import { hexToRgba } from "@/lib/color";
import { Markdown } from "@/components/ui/Markdown";
import { SkillCategory } from "@/lib/types";
import type { PublicResumeResponse } from "@/lib/types";

/**
 * Public web portfolio — a themed, accent-driven one-pager. Distinct from the
 * (future) PDF résumé: this is the online showcase. Colors derive from the
 * profile's `theme` + `accentColor`; everything is inline-styled so it renders
 * identically inside the builder preview and on the public route.
 */
export function PortfolioView({ data }: { data: PublicResumeResponse }) {
  const accent = data.accentColor || "#5b8cff";
  const dark = data.theme !== "light";

  const c = dark
    ? {
        bg: "#0b0d10",
        surface: "#14171c",
        surface2: "#1a1e25",
        text: "#eef1f6",
        muted: "#98a2b3",
        border: "rgba(255,255,255,.09)",
      }
    : {
        bg: "#fafbfc",
        surface: "#ffffff",
        surface2: "#f3f5f8",
        text: "#12141a",
        muted: "#5b6573",
        border: "rgba(10,20,40,.10)",
      };

  const accentSoft = hexToRgba(accent, dark ? 0.16 : 0.1);
  const accentBorder = hexToRgba(accent, 0.4);

  const { owner } = data;
  const displayName = owner.fullName ?? data.name;
  const links = [
    owner.linkedInUrl ? { label: "LinkedIn", url: owner.linkedInUrl } : null,
    owner.gitHubUrl ? { label: "GitHub", url: owner.gitHubUrl } : null,
    owner.websiteUrl ? { label: "Website", url: owner.websiteUrl } : null,
  ].filter((l): l is { label: string; url: string } => l !== null);

  const skillGroups = [
    SkillCategory.Technology,
    SkillCategory.Tool,
    SkillCategory.SoftSkill,
  ]
    .map((cat) => ({
      cat,
      items: data.skills.filter((s) => s.category === cat),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div
      style={{ background: c.bg, color: c.text }}
      className="min-h-full font-sans"
    >
      {/* Accent glow header band */}
      <div
        style={{
          background: `radial-gradient(120% 120% at 50% -20%, ${accentSoft} 0%, transparent 60%)`,
        }}
      >
        <div className="mx-auto max-w-[940px] px-5 pb-4 pt-12 sm:px-8 sm:pt-16">
          <div
            className="font-mono text-[11px] tracking-[0.22em]"
            style={{ color: accent }}
          >
            PORTFÓLIO
          </div>
          <h1 className="mt-3 text-[clamp(30px,6vw,52px)] font-bold leading-[1.05] tracking-tight">
            {displayName}
          </h1>
          {owner.headline ? (
            <div
              className="mt-2 text-[clamp(15px,2.4vw,20px)] font-semibold"
              style={{ color: accent }}
            >
              {owner.headline}
            </div>
          ) : null}

          {data.summary ? (
            <Markdown
              content={data.summary}
              linkColor={accent}
              className="mt-4 max-w-[640px] text-[15px] leading-relaxed"
              // muted-ish body via inline style on wrapper
            />
          ) : null}

          {/* Contact / social row */}
          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            {owner.location ? (
              <span
                className="rounded-full px-3 py-1.5 text-[12.5px]"
                style={{ background: c.surface, border: `1px solid ${c.border}`, color: c.muted }}
              >
                {owner.location}
              </span>
            ) : null}
            {links.map((l) => (
              <a
                key={l.url}
                href={/^https?:\/\//i.test(l.url) ? l.url : `https://${l.url}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition-opacity hover:opacity-80"
                style={{
                  background: accentSoft,
                  border: `1px solid ${accentBorder}`,
                  color: accent,
                }}
              >
                {l.label} ↗
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[940px] flex-col gap-14 px-5 py-14 sm:px-8">
        {/* Projects — the showcase */}
        {data.projects.length > 0 ? (
          <Section title="Projetos" accent={accent} muted={c.muted}>
            <div className="grid gap-4 sm:grid-cols-2 sm:[&>*:last-child:nth-child(odd)]:col-span-2">
              {data.projects.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col rounded-2xl p-5 transition-colors"
                  style={{ background: c.surface, border: `1px solid ${c.border}` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[16px] font-semibold leading-snug">
                      {p.name}
                    </h3>
                  </div>
                  {p.description ? (
                    <Markdown
                      content={p.description}
                      linkColor={accent}
                      className="mt-2 text-[13.5px] leading-relaxed"
                    />
                  ) : null}
                  {p.highlights ? (
                    <Markdown
                      content={p.highlights}
                      linkColor={accent}
                      className="mt-2 text-[13px] leading-relaxed"
                    />
                  ) : null}
                  {p.url || p.repoUrl ? (
                    <div className="mt-4 flex flex-wrap gap-3 pt-1 text-[13px] font-medium">
                      {p.url ? (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: accent }}
                        >
                          Ver projeto ↗
                        </a>
                      ) : null}
                      {p.repoUrl ? (
                        <a
                          href={p.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: c.muted }}
                        >
                          Código
                        </a>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {/* Experience — timeline */}
        {data.experiences.length > 0 ? (
          <Section title="Experiência" accent={accent} muted={c.muted}>
            <div
              className="flex flex-col gap-6 pl-5"
              style={{ borderLeft: `1px solid ${c.border}` }}
            >
              {data.experiences.map((e) => (
                <div key={e.id} className="relative">
                  <span
                    className="absolute -left-[26px] top-1.5 h-2.5 w-2.5 rounded-full"
                    style={{ background: accent, boxShadow: `0 0 0 4px ${accentSoft}` }}
                  />
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <h3 className="text-[15px] font-semibold">
                      {e.role} · {e.company}
                    </h3>
                    <span
                      className="font-mono text-[12px]"
                      style={{ color: c.muted }}
                    >
                      {formatPeriod(e.startDate, e.endDate)}
                    </span>
                  </div>
                  {e.location ? (
                    <div className="text-[12.5px]" style={{ color: c.muted }}>
                      {e.location}
                    </div>
                  ) : null}
                  {e.description ? (
                    <Markdown
                      content={e.description}
                      linkColor={accent}
                      className="mt-1.5 text-[13.5px] leading-relaxed"
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {/* Skills */}
        {skillGroups.length > 0 ? (
          <Section title="Habilidades" accent={accent} muted={c.muted}>
            <div className="flex flex-col gap-4">
              {skillGroups.map((g) => (
                <div key={g.cat}>
                  <div
                    className="mb-2 font-mono text-[11px] tracking-[0.1em]"
                    style={{ color: c.muted }}
                  >
                    {skillCategoryLabels[g.cat].toUpperCase()}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {g.items.map((s) => (
                      <span
                        key={s.id}
                        className="rounded-lg px-3 py-1.5 text-[13px]"
                        style={{
                          background: accentSoft,
                          border: `1px solid ${accentBorder}`,
                          color: c.text,
                        }}
                        title={skillLevelLabels[s.level]}
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {/* Education + Courses + Languages */}
        {data.education.length > 0 ? (
          <Section title="Formação" accent={accent} muted={c.muted}>
            <div className="flex flex-col gap-3">
              {data.education.map((ed) => (
                <Row
                  key={ed.id}
                  title={ed.degree}
                  subtitle={[ed.institution, ed.field].filter(Boolean).join(" · ")}
                  meta={formatPeriod(ed.startDate, ed.endDate)}
                  muted={c.muted}
                  border={c.border}
                  surface={c.surface}
                />
              ))}
            </div>
          </Section>
        ) : null}

        {data.courses.length > 0 ? (
          <Section title="Cursos & Certificações" accent={accent} muted={c.muted}>
            <div className="flex flex-col gap-3">
              {data.courses.map((co) => (
                <Row
                  key={co.id}
                  title={co.name}
                  subtitle={co.provider ?? undefined}
                  meta={co.completionDate ? formatMonthYear(co.completionDate) : undefined}
                  href={co.certificateUrl ?? undefined}
                  accent={accent}
                  muted={c.muted}
                  border={c.border}
                  surface={c.surface}
                />
              ))}
            </div>
          </Section>
        ) : null}

        {data.languages.length > 0 ? (
          <Section title="Idiomas" accent={accent} muted={c.muted}>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {data.languages.map((l) => (
                <span key={l.id} className="text-[14px]">
                  <span className="font-semibold">{l.name}</span>
                  <span style={{ color: c.muted }}>
                    {" "}
                    — {languageProficiencyLabels[l.proficiency]}
                  </span>
                </span>
              ))}
            </div>
          </Section>
        ) : null}

        <footer
          className="mt-2 border-t pt-6 text-[12px]"
          style={{ borderColor: c.border, color: c.muted }}
        >
          <span className="font-mono">{displayName}</span> · feito com{" "}
          <span style={{ color: accent }}>ResumeHub</span>
        </footer>
      </div>
    </div>
  );
}

function Section({
  title,
  accent,
  muted,
  children,
}: {
  title: string;
  accent: string;
  muted: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-5 flex items-center gap-3">
        <span className="h-3 w-3 rounded-full" style={{ background: accent }} />
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em]">
          {title}
        </h2>
        <span className="h-px flex-1" style={{ background: muted, opacity: 0.2 }} />
      </div>
      {children}
    </section>
  );
}

function Row({
  title,
  subtitle,
  meta,
  href,
  accent,
  muted,
  border,
  surface,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
  href?: string;
  accent?: string;
  muted: string;
  border: string;
  surface: string;
}) {
  return (
    <div
      className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-xl px-4 py-3"
      style={{ background: surface, border: `1px solid ${border}` }}
    >
      <div className="min-w-0">
        <div className="text-[14px] font-semibold">
          {title}
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="ml-2 text-[12px] font-medium"
              style={{ color: accent ?? muted }}
            >
              certificado ↗
            </a>
          ) : null}
        </div>
        {subtitle ? (
          <div className="text-[12.5px]" style={{ color: muted }}>
            {subtitle}
          </div>
        ) : null}
      </div>
      {meta ? (
        <span className="font-mono text-[12px]" style={{ color: muted }}>
          {meta}
        </span>
      ) : null}
    </div>
  );
}
