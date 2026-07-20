import Link from "next/link";
import {
  BadgeDollarSign,
  Flag,
  LayoutDashboard,
  Receipt,
  Settings,
  ShieldCheck,
  Store,
  Tags,
} from "lucide-react";
import { publicConfig } from "@/lib/config";
const links = [
  ["/admin/dashboard", "Overview", LayoutDashboard],
  ["/admin/sellers", "Sellers", Store],
  ["/admin/campaigns", "Campaigns", Tags],
  ["/admin/transactions", "Transactions", Receipt],
  ["/admin/rewards", "Rewards", BadgeDollarSign],
  ["/admin/disputes", "Disputes", Flag],
  ["/admin/pricing", "Pricing", ShieldCheck],
  ["/admin/settings", "Settings", Settings],
] as const;
export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <Link className="brand" href="/">
          <span className="brand-mark">↗</span>
          {publicConfig.NEXT_PUBLIC_APP_SHORT_NAME} Admin
        </Link>
        <nav>
          {links.map(([h, l, I]) => (
            <Link href={h} key={h}>
              <I size={18} />
              {l}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">Sensitive actions are audited</div>
      </aside>
      <main className="app-main">{children}</main>
    </div>
  );
}
