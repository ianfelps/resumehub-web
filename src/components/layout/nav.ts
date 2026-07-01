import {
  ChartIcon,
  GlobeIcon,
  HomeIcon,
  LayersIcon,
  SettingsIcon,
  VaultIcon,
} from "@/components/ui/icons";

export interface NavItem {
  href: string;
  label: string;
  icon: (p: React.SVGProps<SVGSVGElement>) => React.ReactNode;
  /** Routes that aren't built yet render disabled with an "em breve" hint. */
  enabled: boolean;
}

export const navItems: NavItem[] = [
  { href: "/dashboard", label: "Início", icon: HomeIcon, enabled: true },
  { href: "/cofre", label: "Cofre", icon: VaultIcon, enabled: true },
  { href: "/perfis", label: "Perfis", icon: LayersIcon, enabled: true },
  { href: "/portfolio", label: "Portfólio", icon: GlobeIcon, enabled: true },
  { href: "/analises", label: "Análises", icon: ChartIcon, enabled: false },
  {
    href: "/configuracoes",
    label: "Configurações",
    icon: SettingsIcon,
    enabled: true,
  },
];
