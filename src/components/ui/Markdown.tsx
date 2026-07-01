import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { cn } from "@/lib/cn";

/**
 * Renders Markdown (GFM) for free-text fields. Text color is inherited from the
 * parent so it adapts to wherever it's placed; link color is configurable via
 * `linkColor` (defaults to the CV blue).
 */
function buildComponents(linkColor: string): Components {
  return {
    p: ({ children }) => (
      <p className="my-1.5 first:mt-0 last:mb-0">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="my-1.5 flex list-disc flex-col gap-1 pl-4">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="my-1.5 flex list-decimal flex-col gap-1 pl-4">{children}</ol>
    ),
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    a: ({ children, href }) => (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        style={{ color: linkColor, textDecoration: "underline" }}
      >
        {children}
      </a>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="rounded bg-black/10 px-1 py-0.5 font-mono text-[0.9em]">
        {children}
      </code>
    ),
    h1: ({ children }) => <p className="font-semibold">{children}</p>,
    h2: ({ children }) => <p className="font-semibold">{children}</p>,
    h3: ({ children }) => <p className="font-semibold">{children}</p>,
  };
}

const defaultComponents = buildComponents("#2f5fff");

export function Markdown({
  content,
  className,
  linkColor,
}: {
  content?: string | null;
  className?: string;
  linkColor?: string;
}) {
  if (!content?.trim()) return null;
  const components = linkColor ? buildComponents(linkColor) : defaultComponents;
  return (
    <div className={cn("[&>*:first-child]:mt-0 [&>*:last-child]:mb-0", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
