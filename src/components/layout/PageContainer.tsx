import { cn } from "@/lib/cn";

/** Consistent max-width + padding wrapper for page content. */
export function PageContainer({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1100px] px-5 py-6 sm:py-8", className)}>
      {children}
    </div>
  );
}
