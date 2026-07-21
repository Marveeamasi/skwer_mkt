"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/auth/password-input";
export function LoginForm() {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    router = useRouter();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: String(form.get("email")).trim().toLowerCase(),
          password: String(form.get("password")),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      router.push("/seller/dashboard");
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Email or password is incorrect.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="form-stack" onSubmit={submit}>
      <label>
        Email address
        <input name="email" type="email" required autoComplete="email" />
      </label>
      <PasswordInput autoComplete="current-password" />
      <div className="form-between">
        <span>Your session stays secure on this device.</span>
        <Link href="/forgot-password">Forgot password?</Link>
      </div>
      <button className="button" disabled={busy}>
        {busy ? "Signing in…" : "Sign in"}
      </button>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
