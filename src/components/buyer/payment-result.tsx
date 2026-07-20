"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, RefreshCw, Share2 } from "lucide-react";
export function PaymentResult({
  reference,
  demo,
}: {
  reference: string;
  demo: boolean;
}) {
  const [state, setState] = useState<"checking" | "success" | "failed">(
      "checking",
    ),
    [message, setMessage] = useState(""),
    [orderUrl, setOrderUrl] = useState("/order/demo-order-token");
  useEffect(() => {
    fetch("/api/payments/verify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ reference }),
    })
      .then(async (r) => ({ ok: r.ok, body: await r.json() }))
      .then(({ ok, body }) => {
        const token = sessionStorage.getItem("skwerPendingOrderToken");
        if (token) setOrderUrl(`/order/${encodeURIComponent(token)}`);
        setState(ok && body.verified ? "success" : "failed");
        setMessage(body.error ?? "");
        if (ok) sessionStorage.removeItem("skwerPendingOrderToken");
      })
      .catch(() => setState("failed"));
  }, [reference]);
  if (state === "checking")
    return (
      <div className="empty-state">
        <RefreshCw className="spin" />
        <h1>Confirming your payment</h1>
        <p>Please keep this page open. We verify directly with Paystack.</p>
      </div>
    );
  if (state === "failed")
    return (
      <div className="empty-state">
        <h1>Payment not confirmed yet</h1>
        <p>{message}</p>
        <button className="button" onClick={() => location.reload()}>
          Check again
        </button>
      </div>
    );
  return (
    <div className="empty-state">
      <CheckCircle2 size={58} color="#15803d" />
      <h1>{demo ? "Demo order confirmed" : "Payment confirmed"}</h1>
      <p>
        Your order is recorded. Save this page and share the product after you
        receive your personal link.
      </p>
      <div className="hero-actions">
        <Link className="button" href={orderUrl}>
          View my order
        </Link>
        <button className="button button-secondary">
          <Share2 size={17} /> Share product
        </button>
      </div>
      {demo && (
        <p className="notice">
          This is local demonstration mode. No money moved and no production
          payment claim is being made.
        </p>
      )}
    </div>
  );
}
