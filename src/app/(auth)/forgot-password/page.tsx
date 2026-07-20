import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
export const metadata = { title: "Reset password" };
export default function Page() {
  return (
    <>
      <span className="eyebrow">Account recovery</span>
      <h1>Reset your password</h1>
      <p>Use the email attached to your seller account. We will send a six-digit code that expires after 10 minutes.</p>
      <ForgotPasswordForm />
    </>
  );
}
