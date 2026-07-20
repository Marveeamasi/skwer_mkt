import Link from "next/link";
import { publicConfig } from "@/lib/config";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="auth-page">
      <header className="auth-header">
      <Link className="brand" href="/">
        <span className="brand-mark">↗</span>
        {publicConfig.NEXT_PUBLIC_APP_NAME}
      </Link>
      </header>
      <div className="auth-content">
        <section className="auth-card">{children}</section>
      </div>
      <footer className="auth-foot">
        Secure selling tools for Nigerian WhatsApp businesses.
      </footer>
    </main>
  );
}
