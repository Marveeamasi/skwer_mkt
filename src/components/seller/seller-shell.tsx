import Link from "next/link";
import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  PackagePlus,
  ReceiptText,
  Settings,
  Users,
} from "lucide-react";
import { publicConfig } from "@/lib/config";
const links = [
  ["/seller/dashboard", "Dashboard", LayoutDashboard],
  ["/seller/campaigns", "Sales links", Boxes],
  ["/seller/orders", "Orders", ReceiptText],
  ["/seller/customers", "Customers", Users],
  ["/seller/reports", "Reports", BarChart3],
  ["/seller/settings", "Settings", Settings],
] as const;
export function SellerShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <Link className="brand" href="/">
          <span className="brand-mark">↗</span>
          {publicConfig.NEXT_PUBLIC_APP_NAME}
        </Link>
        <nav>
          {links.map(([href, label, Icon]) => (
            <Link key={href} href={href}>
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          Pilot mode · Payments safely disabled until approval
        </div>
      </aside>
      <div className="app-main">{children}</div>
      <nav className="mobile-menu">
        {links.slice(0, 5).map(([href, label, Icon]) => (
          <Link key={href} href={href}>
            <Icon size={20} />
            {label}
          </Link>
        ))}
        <Link href="/seller/campaigns/new">
          <PackagePlus size={20} />
          Create
        </Link>
      </nav>
    </div>
  );
}
