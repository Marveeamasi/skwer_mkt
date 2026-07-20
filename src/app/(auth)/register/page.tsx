import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
export const metadata = { title: "Create seller account" };
export default function Page() {
  return (
    <>
      <span className="eyebrow">Invite-only seller access</span>
      <h1>Create your seller account</h1>
      <p>
        Start with one product. You can publish a test sales link in a few
        minutes.
      </p>
      <RegisterForm />
      <p className="auth-switch">
        Already registered? <Link href="/login">Sign in</Link>
      </p>
    </>
  );
}
