/** Shared typographic primitives for the static legal documents. */

export function DocTitle({
  title,
  updatedAt,
}: {
  title: string;
  updatedAt: string;
}) {
  return (
    <>
      <h1 className="text-[32px] font-bold tracking-[-0.02em]">{title}</h1>
      <p className="mt-2 font-mono text-[12px] tracking-[0.08em] text-text3">
        ÚLTIMA ATUALIZAÇÃO · {updatedAt}
      </p>
    </>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-9">
      <h2 className="text-[18px] font-semibold tracking-[-0.01em]">{title}</h2>
      <div className="mt-3 flex flex-col gap-3 text-[14.5px] leading-[1.7] text-text2">
        {children}
      </div>
    </section>
  );
}

export function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="flex list-disc flex-col gap-2 pl-5">
      {items.map((it) => (
        <li key={it}>{it}</li>
      ))}
    </ul>
  );
}
