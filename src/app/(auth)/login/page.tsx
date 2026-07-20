import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
export const metadata = { title: "Seller login" };
export default function Page() {
  return (
    <>
      <span className="eyebrow">Welcome back</span>
      <h1>Sign in to keep selling</h1>
      <p>Manage orders, customers and sales links from one place.</p>
      <LoginForm />
      <p className="auth-switch">
        New seller? <Link href="/register">Create an account</Link>
      </p>
    </>
  );
}
