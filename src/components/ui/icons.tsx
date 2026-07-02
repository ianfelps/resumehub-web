/** App icon set backed by lucide-react (currentColor, 1.7 stroke, 17px default). */

import {
  BarChart3,
  Check,
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  Home,
  Layers,
  LogOut,
  type LucideIcon,
  type LucideProps,
  Menu,
  Plus,
  Search,
  Settings,
  Vault,
} from "lucide-react";

/** Wrap a lucide icon with the app's default size/stroke; props still override. */
function icon(Icon: LucideIcon) {
  return function AppIcon(props: LucideProps) {
    return <Icon size={17} strokeWidth={1.7} aria-hidden {...props} />;
  };
}

export const HomeIcon = icon(Home);
export const VaultIcon = icon(Vault);
export const LayersIcon = icon(Layers);
export const GlobeIcon = icon(Globe);
export const ChartIcon = icon(BarChart3);
export const SettingsIcon = icon(Settings);
export const PlusIcon = icon(Plus);
export const SearchIcon = icon(Search);
export const LogoutIcon = icon(LogOut);
export const MenuIcon = icon(Menu);
export const ExternalIcon = icon(ExternalLink);
export const EyeIcon = icon(Eye);
export const EyeOffIcon = icon(EyeOff);
export const CheckIcon = icon(Check);
