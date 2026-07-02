import Link from "next/link";

/** Public chrome for static legal docs (termos / privacidade). */
export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg text-text">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-[760px] items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-[29px] w-[29px] items-center justify-center rounded-lg bg-accent font-mono text-[15px] font-semibold text-white">
              R
            </span>
            <span className="text-[16px] font-semibold tracking-[-0.01em]">
              ResumeHub
            </span>
          </Link>
          <Link href="/" className="text-[13px] text-text2 hover:text-text">
            ← Voltar
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-[760px] px-6 py-16">{children}</main>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-[760px] flex-wrap justify-between gap-2.5 px-6 py-[18px] font-mono text-[11.5px] text-text3">
          <span>© {new Date().getFullYear()} ResumeHub</span>
          <div className="flex gap-5">
            <Link href="/termos" className="hover:text-text2">
              Termos
            </Link>
            <Link href="/privacidade" className="hover:text-text2">
              Privacidade
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
