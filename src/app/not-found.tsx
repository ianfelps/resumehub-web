import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
      <div className="font-mono text-[12px] tracking-[0.18em] text-accent-text">
        404
      </div>
      <h1 className="text-[22px] font-semibold tracking-tight">
        Página não encontrada
      </h1>
      <p className="text-[13.5px] text-text2">
        O recurso que você procura não existe ou não está público.
      </p>
      <Link
        href="/dashboard"
        className="mt-2 rounded-[9px] bg-accent px-4 py-2.5 text-[13px] font-semibold text-white"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
