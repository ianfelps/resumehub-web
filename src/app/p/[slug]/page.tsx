import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicResume } from "@/lib/api/public";
import { ResumeDocument } from "@/components/resume/ResumeDocument";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resume = await getPublicResume(slug).catch(() => null);
  if (!resume) return { title: "Currículo não encontrado · ResumeHub" };
  const who = resume.owner.fullName ?? resume.name;
  return {
    title: `${who} · ResumeHub`,
    description: resume.summary ?? `Currículo público de ${who}.`,
  };
}

export default async function PublicResumePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const resume = await getPublicResume(slug);
  if (!resume) notFound();

  return (
    <div className="min-h-screen bg-bg py-8 sm:py-14">
      <div className="mx-auto mb-5 flex max-w-[720px] items-center justify-between px-4">
        <span className="flex items-center gap-2 font-mono text-[12px] text-text2">
          <span className="flex h-5 w-5 items-center justify-center rounded-[5px] bg-accent text-[10px] font-semibold text-white">
            R
          </span>
          resumehub
        </span>
        <span className="font-mono text-[11px] text-text3">/{slug}</span>
      </div>
      <div className="px-4">
        <ResumeDocument data={resume} />
      </div>
    </div>
  );
}
