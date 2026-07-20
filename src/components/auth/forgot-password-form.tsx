"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { PasswordInput } from "@/components/auth/password-input";

export function ForgotPasswordForm() {
  const [step, setStep] = useState<"email" | "reset" | "done">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  async function requestCode(address: string) {
    const response = await fetch("/api/auth/password-reset/request", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: address }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    return result.message as string;
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    const form = new FormData(event.currentTarget);
    try {
      if (step === "email") {
        const address = String(form.get("email")).trim().toLowerCase();
        const message = await requestCode(address);
        setEmail(address);
        setNotice(message);
        setStep("reset");
      } else if (step === "reset") {
        const password = String(form.get("newPassword"));
        const confirmation = String(form.get("confirmPassword"));
        if (password !== confirmation) throw new Error("The new passwords do not match.");
        const response = await fetch("/api/auth/password-reset/confirm", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email, code, password }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        setStep("done");
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Password reset failed");
    } finally {
      setBusy(false);
    }
  }
  if (step === "done") return <div className="form-stack"><p className="notice" role="status">Your password has been changed. You can sign in now.</p><Link className="button" href="/login">Return to sign in</Link></div>;
  return (
    <form className="form-stack" onSubmit={submit}>
      {step === "email" ? (
        <label>Email address<input name="email" type="email" required autoComplete="email" /></label>
      ) : (
        <>
          <div className="notice">Enter the code sent to <strong>{email}</strong>.</div>
          <label>Six-digit code<input name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" minLength={6} maxLength={6} required value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} /></label>
          <PasswordInput name="newPassword" label="New password" autoComplete="new-password" minLength={8} maxLength={72} />
          <PasswordInput name="confirmPassword" label="Confirm new password" autoComplete="new-password" minLength={8} maxLength={72} />
        </>
      )}
      <button className="button" disabled={busy || (step === "reset" && code.length !== 6)}>{busy ? "Please wait…" : step === "email" ? "Send reset code" : "Change password"}</button>
      {step === "reset" && <button type="button" className="link-button" disabled={busy} onClick={async()=>{setBusy(true);setError("");try{setNotice(await requestCode(email))}catch(caught){setError(caught instanceof Error?caught.message:"Code could not be resent")}finally{setBusy(false)}}}>Send a new code</button>}
      {notice && <p className="notice" role="status">{notice}</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
    </form>
  );
}
