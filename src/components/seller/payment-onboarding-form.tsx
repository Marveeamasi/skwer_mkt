"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Bank {
  name: string;
  code: string;
}

export function PaymentOnboardingForm() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    let active = true;
    fetch("/api/paystack/banks")
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error);
        if (active) setBanks(body.banks);
      })
      .catch((caught) => {
        if (active) {
          setError(
            caught instanceof Error ? caught.message : "Banks could not be loaded.",
          );
        }
      })
      .finally(() => {
        if (active) setLoadingBanks(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/seller/payment-account", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          bankCode: form.get("bankCode"),
          accountNumber: form.get("accountNumber"),
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error);
      router.push("/seller/campaigns/new?onboarding=complete");
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Payment account could not be connected.",
      );
      setBusy(false);
    }
  }

  return (
    <form className="form-stack payment-onboarding" onSubmit={submit}>
      <h3>Where should Paystack settle your sales?</h3>
      <p className="settings-help">
        Your account name is checked directly with Paystack before it is saved.
        SKWER stores only the last four account digits.
      </p>
      <label>
        Bank
        <select name="bankCode" required disabled={loadingBanks || busy}>
          <option value="">
            {loadingBanks ? "Loading Nigerian banks…" : "Choose your bank"}
          </option>
          {banks.map((bank) => (
            <option value={bank.code} key={`${bank.code}-${bank.name}`}>
              {bank.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Account number
        <input
          name="accountNumber"
          required
          inputMode="numeric"
          autoComplete="off"
          pattern="[0-9]{10}"
          minLength={10}
          maxLength={10}
          placeholder="10-digit account number"
          disabled={busy}
        />
      </label>
      <div className="notice">
        Test payments may be used during the pilot. Live settlement stays off
        until the payment account and SKWER&apos;s Paystack model are approved.
      </div>
      <button className="button" disabled={busy || loadingBanks || !banks.length}>
        {busy ? "Checking account…" : "Verify account and create first link"}
      </button>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
