"use client";
import { FormEvent, useState } from "react";
export function RestockForm({
  campaignCode,
  sellerName,
}: {
  campaignCode: string;
  sellerName: string;
}) {
  const [state, setState] = useState<"idle" | "busy" | "done">("idle"),
    [error, setError] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("busy");
    setError("");
    const f = new FormData(e.currentTarget),
      max = Number(f.get("maximumPrice"));
    const response = await fetch("/api/restock-interest", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          campaignCode,
          fullName: f.get("fullName"),
          phone: f.get("phone"),
          email: f.get("email"),
          variation: f.get("variation"),
          quantity: Number(f.get("quantity")),
          maximumPriceKobo: max ? max * 100 : undefined,
        }),
      }),
      body = await response.json();
    if (!response.ok) {
      setState("idle");
      setError(body.error);
      return;
    }
    setState("done");
  }
  if (state === "done")
    return (
      <section className="checkout-card empty-state">
        <span className="badge">Request saved</span>
        <h1>{sellerName} can now see what you need</h1>
        <p>
          This was not an order and you were not charged. The seller can contact
          you when the requested option returns.
        </p>
      </section>
    );
  return (
    <form className="checkout-card form-stack" onSubmit={submit}>
      <span className="eyebrow">Restock interest</span>
      <h1>Tell {sellerName} what you need</h1>
      <p>This is a request, not an order. You will not be charged.</p>
      <label>
        Full name
        <input name="fullName" required />
      </label>
      <label>
        WhatsApp phone
        <input name="phone" required inputMode="tel" />
      </label>
      <label>
        Email
        <input name="email" type="email" required />
      </label>
      <label>
        Colour / size / option
        <input name="variation" required />
      </label>
      <label>
        Quantity
        <input
          name="quantity"
          type="number"
          min="1"
          max="20"
          defaultValue="1"
        />
      </label>
      <label>
        Maximum acceptable price (optional)
        <input name="maximumPrice" type="number" min="1" />
      </label>
      <button className="button" disabled={state === "busy"}>
        {state === "busy" ? "Saving…" : "Save my request"}
      </button>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
