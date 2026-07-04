import { ImageResponse } from "next/og";
import { getPublicResume } from "@/lib/api/public";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type Params = { slug: string };

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const resume = await getPublicResume(slug).catch(() => null);
  const name = resume?.owner.fullName ?? resume?.name ?? "ResumeHub";
  const headline = resume?.owner.headline ?? resume?.summary ?? "Portfolio profissional";
  const accent = resume?.accentColor ?? "#5b8cff";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0d10",
          color: "#eef1f6",
          padding: 72,
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            color: accent,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          <div style={{ width: 18, height: 18, borderRadius: 999, background: accent }} />
          ResumeHub
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              maxWidth: 920,
              fontSize: 76,
              lineHeight: 1.05,
              fontWeight: 800,
            }}
          >
            {name}
          </div>
          <div
            style={{
              maxWidth: 880,
              color: "#b8c1d1",
              fontSize: 34,
              lineHeight: 1.25,
            }}
          >
            {headline}
          </div>
        </div>
        <div style={{ color: "#7b8494", fontSize: 26 }}>/p/{slug}</div>
      </div>
    ),
    size,
  );
}
