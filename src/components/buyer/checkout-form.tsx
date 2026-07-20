"use client";
import { FormEvent, useState } from "react";
import type { PublicCampaign } from "@/features/campaigns/public-campaign";
import { formatNaira } from "@/lib/money";
import { Gift, ShieldCheck } from "lucide-react";

export function CheckoutForm({
  campaign,
  variantId,
  rewardCode,
}: {
  campaign: PublicCampaign;
  variantId: string;
  rewardCode?: string;
}) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/checkout/initialize", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          campaignCode: campaign.shortCode,
          variantId,
          quantity: Number(form.get("quantity")),
          fullName: form.get("fullName"),
          phone: form.get("phone"),
          email: form.get("email"),
          fulfilmentMethod: form.get("fulfilmentMethod"),
          deliveryAddress: form.get("deliveryAddress"),
          buyerNote: form.get("buyerNote"),
          rewardCode: form.get("rewardCode") || undefined,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      if (result.orderToken)
        sessionStorage.setItem("skwerPendingOrderToken", result.orderToken);
      location.assign(result.authorizationUrl);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Checkout could not start",
      );
      setBusy(false);
    }
  }
  return (
    <form className="checkout-card form-stack" onSubmit={submit}>
      <h1>Complete your order</h1>
      <p>
        No account required. We use these details only for this order and its
        fulfilment.
      </p>
      <label>
        Full name
        <input name="fullName" required autoComplete="name" />
      </label>
      <label>
        WhatsApp phone
        <input
          name="phone"
          required
          inputMode="tel"
          autoComplete="tel"
          placeholder="0803 000 0000"
        />
      </label>
      <label>
        Email for payment receipt
        <input name="email" required type="email" autoComplete="email" />
      </label>
      <label>
        How will you receive it?
        <select name="fulfilmentMethod" required>
          {campaign.seller.fulfilmentMethods.map((method) => (
            <option key={method} value={method}>
              {method.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </label>
      <label>
        Delivery address (only when required)
        <textarea name="deliveryAddress" autoComplete="street-address" />
      </label>
      <label>
        Note to seller (optional)
        <textarea name="buyerNote" maxLength={500} />
      </label>
      <label>
        <span className="secure">
          <Gift size={16} /> Seller reward code (optional)
        </span>
        <input
          name="rewardCode"
          defaultValue={rewardCode}
          minLength={8}
          maxLength={100}
          autoComplete="off"
          aria-describedby="reward-help"
        />
      </label>
      <small id="reward-help">
        A reward is checked against this seller, its expiry and the phone number
        above. It cannot be combined with a referral.
      </small>
      <input type="hidden" name="quantity" value="1" />
      <div className="order-summary">
        <p>
          <span>{campaign.product.name} × 1</span>
          <strong>{formatNaira(campaign.publicPriceKobo)}</strong>
        </p>
        <p>
          <span>Delivery</span>
          <strong>Confirmed above</strong>
        </p>
        <p>
          <span>Reward</span>
          <strong>
            {rewardCode ? "Validated securely at payment" : "None entered"}
          </strong>
        </p>
        <p className="total">
          <span>Before valid reward</span>
          <strong>{formatNaira(campaign.publicPriceKobo)}</strong>
        </p>
      </div>
      <p className="notice">
        By paying, you accept the seller&apos;s fulfilment and refund policy.
        The advertised item price does not receive a surprise platform fee.
      </p>
      <button className="button" disabled={busy}>
        {busy ? "Preparing secure payment…" : "Pay securely"}
      </button>
      <small className="secure">
        <ShieldCheck size={16} /> Card details are entered only on Paystack.
      </small>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
