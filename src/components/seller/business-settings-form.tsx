"use client";
import { FormEvent, useState } from "react";

interface Business {
  business_name: string;
  whatsapp_phone: string;
  city: string;
  state: string;
  short_description: string;
  pickup_note: string;
  delivery_note: string;
  return_policy: string;
}

export function BusinessSettingsForm({ business }: { business: Business }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/seller/settings/profile", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form)),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setNotice("Business profile saved. Buyer pages will use the updated details.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Profile could not be saved");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="panel form-stack" onSubmit={submit}>
      <h2>Business profile</h2>
      <label>Business name<input name="businessName" required minLength={2} maxLength={100} defaultValue={business.business_name} /></label>
      <label>WhatsApp phone<input name="whatsappPhone" required inputMode="tel" defaultValue={business.whatsapp_phone} /></label>
      <div className="settings-grid">
        <label>City<input name="city" required maxLength={80} defaultValue={business.city} /></label>
        <label>State<input name="state" required maxLength={80} defaultValue={business.state} /></label>
      </div>
      <label>Trust description<textarea name="shortDescription" required minLength={10} maxLength={240} defaultValue={business.short_description} /></label>
      <label>Pickup note<textarea name="pickupNote" maxLength={500} defaultValue={business.pickup_note} /></label>
      <label>Delivery note<textarea name="deliveryNote" maxLength={500} defaultValue={business.delivery_note} /></label>
      <label>Return/refund policy<textarea name="returnPolicy" required minLength={10} maxLength={1500} defaultValue={business.return_policy} /></label>
      <button className="button button-small" disabled={busy}>{busy ? "Saving…" : "Save profile"}</button>
      {notice && <p className="notice" role="status">{notice}</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
    </form>
  );
}
