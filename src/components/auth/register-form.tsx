"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/auth/password-input";
type Details = { fullName: string; email: string; password: string };
type Action = "submit" | "resend" | null;
export function RegisterForm() {
  const router = useRouter(),
    [step, setStep] = useState<"details" | "otp">("details"),
    [details, setDetails] = useState<Details | null>(null),
    [code, setCode] = useState(""),
    [action, setAction] = useState<Action>(null),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  async function requestCode(email: string) {
    const response = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      }),
      result = (await response.json()) as {
        error?: string;
        message?: string;
        delivery?: { fallbackUsed: boolean };
      };
    if (!response.ok) throw new Error(result.error);
    return result;
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAction("submit");
    setError("");
    setNotice("");
    const form = new FormData(event.currentTarget);
    try {
      if (step === "details") {
        const next = {
            fullName: String(form.get("fullName")).trim(),
            email: String(form.get("email")).trim().toLowerCase(),
            password: String(form.get("password")),
          },
          result = await requestCode(next.email);
        setDetails(next);
        setCode("");
        setNotice(
          result.message ??
            "The email provider accepted your code for delivery.",
        );
        setStep("otp");
      } else {
        if (!details) throw new Error("Enter your account details again.");
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ ...details, code }),
          }),
          result = await response.json();
        if (!response.ok) throw new Error(result.error);
        router.push("/login?registered=1");
      }
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Something went wrong",
      );
    } finally {
      setAction(null);
    }
  }
  async function resend() {
    if (!details) return;
    setAction("resend");
    setError("");
    setNotice("");
    try {
      const result = await requestCode(details.email);
      setNotice(
        result.message ??
          "A new code was accepted for delivery. Your earlier unexpired code will still work.",
      );
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Code could not be resent",
      );
    } finally {
      setAction(null);
    }
  }
  return (
    <form key={step} className="form-stack" onSubmit={submit}>
      {step === "details" ? (
        <div className="form-stack" key="account-details">
          <label>
            Full name
            <input
              name="fullName"
              required
              minLength={2}
              maxLength={80}
              autoComplete="name"
            />
          </label>
          <label>
            Email address
            <input
              name="email"
              required
              type="email"
              maxLength={254}
              autoComplete="email"
            />
          </label>
          <PasswordInput
            autoComplete="new-password"
            minLength={8}
            maxLength={72}
          />
          <small>
            Use at least 8 characters. Your password is never emailed.
          </small>
          <button className="button" disabled={action !== null}>
            {action === "submit"
              ? "Requesting code…"
              : "Send verification code"}
          </button>
        </div>
      ) : (
        <div className="form-stack" key="verification-code">
          <div className="notice">
            Enter the 6-digit code sent to <strong>{details?.email}</strong>.
            Codes expire after 10 minutes.
          </div>
          <label>
            Verification code
            <input
              key="otp-code"
              name="code"
              type="text"
              required
              inputMode="numeric"
              pattern="[0-9]{6}"
              minLength={6}
              maxLength={6}
              autoComplete="one-time-code"
              value={code}
              onChange={(event) =>
                setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="000000"
              autoFocus
            />
          </label>
          <button
            className="button"
            disabled={action !== null || code.length !== 6}
          >
            {action === "submit"
              ? "Creating account…"
              : "Verify and create account"}
          </button>
          <button
            type="button"
            className="link-button"
            onClick={resend}
            disabled={action !== null}
          >
            {action === "resend" ? "Requesting a new code…" : "Send a new code"}
          </button>
          <button
            type="button"
            className="link-button"
            onClick={() => {
              setStep("details");
              setDetails(null);
              setCode("");
              setError("");
              setNotice("");
            }}
            disabled={action !== null}
          >
            Change details
          </button>
        </div>
      )}
      {notice && (
        <p className="notice" role="status">
          {notice}
        </p>
      )}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
