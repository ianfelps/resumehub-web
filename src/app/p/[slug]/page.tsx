import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicResume } from "@/lib/api/public";
import { PortfolioView } from "@/components/portfolio/PortfolioView";

// Always render fresh so edits to the profile or inventory show immediately.
export const dynamic = "force-dynamic";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resume = await getPublicResume(slug).catch(() => null);
  if (!resume) return { title: "Portfólio não encontrado · ResumeHub" };
  const who = resume.owner.fullName ?? resume.name;
  return {
    title: `${who} · Portfólio`,
    description:
      resume.summary ?? resume.owner.headline ?? `Portfólio de ${who}.`,
  };
}

export default async function PublicPortfolioPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const resume = await getPublicResume(slug);
  if (!resume) notFound();

  return (
    <div className="min-h-screen">
      <PortfolioView data={resume} />
    </div>
  );
}
