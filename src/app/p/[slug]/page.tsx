import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicResume } from "@/lib/api/public";
import { PortfolioView } from "@/components/portfolio/PortfolioView";

// Always render fresh so edits to the profile or inventory show immediately.
export const dynamic = "force-dynamic";

type Params = { slug: string };

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resume = await getPublicResume(slug).catch(() => null);
  if (!resume) return { title: "Portfolio nao encontrado · ResumeHub" };

  const who = resume.owner.fullName ?? resume.name;
  const title = `${who} · Portfolio`;
  const description =
    resume.summary ?? resume.owner.headline ?? `Portfolio de ${who}.`;
  const url = new URL(`/p/${slug}`, siteUrl).toString();

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "profile",
      siteName: "ResumeHub",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
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
