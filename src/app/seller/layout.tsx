import { SellerShell } from "@/components/seller/seller-shell";
export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <SellerShell>{children}</SellerShell>;
}
