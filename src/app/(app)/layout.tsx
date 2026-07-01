import { AppShell } from "@/components/layout/AppShell";

/** Layout for the authenticated console area (sidebar + topbar + guard). */
export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
