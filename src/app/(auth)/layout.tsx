import Link from "next/link";

/** Minimal centered layout for login / register (no app chrome). */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-accent font-mono text-[15px] font-semibold text-white">
          R
        </span>
        <span className="text-[17px] font-semibold tracking-tight">
          ResumeHub
        </span>
      </Link>
      <div className="w-full max-w-[400px]">{children}</div>
      <p className="mt-8 font-mono text-[11px] tracking-[0.12em] text-text3">
        SEU CENTRO DE COMANDO DE CARREIRA
      </p>
    </div>
  );
}
