"use client";
import { FormEvent, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ImagePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  calculatePublicPrice,
  type FeeConfig,
} from "@/features/pricing/calculate-public-price";
import { formatNaira } from "@/lib/money";
const previewFee: FeeConfig = {
  paystackPercentBasisPoints: 150,
  paystackFixedKobo: 10000,
  paystackFixedThresholdKobo: 250000,
  paystackCapKobo: 200000,
  platformPercentBasisPoints: 200,
  platformFlatKobo: 0,
  platformMinKobo: 10000,
  platformMaxKobo: null,
  safetyBufferKobo: 5000,
  roundingIncrementKobo: 5000,
};
interface Draft {
  name: string;
  description: string;
  category: string;
  stockMode: "fixed" | "on_request" | "preorder";
  colours: string;
  sizes: string;
  quantity: number;
  paymentMode: "full" | "fixed_deposit" | "percentage_deposit";
  depositValue: number;
  takeHome: number;
  cost: number;
  reward: number;
  fulfilment: string;
  deliveryNote: string;
  returnPolicy: string;
  allowRestock: boolean;
  allowSubstitution: boolean;
}
const initial: Draft = {
  name: "",
  description: "",
  category: "Beauty",
  stockMode: "fixed",
  colours: "",
  sizes: "",
  quantity: 10,
  paymentMode: "full",
  depositValue: 0,
  takeHome: 10000,
  cost: 0,
  reward: 300,
  fulfilment: "pickup",
  deliveryNote: "",
  returnPolicy: "",
  allowRestock: true,
  allowSubstitution: false,
};
export function CampaignForm() {
  const [step, setStep] = useState(1),
    [draft, setDraft] = useState(initial),
    [file, setFile] = useState<File | null>(null),
    [mediaConsent, setMediaConsent] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    router = useRouter(),
    price = useMemo(
      () =>
        calculatePublicPrice(
          draft.takeHome * 100,
          draft.reward * 100,
          previewFee,
        ),
      [draft.takeHome, draft.reward],
    );
  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
      return;
    }
    setBusy(true);
    setError("");
    try {
      const colours = draft.colours
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
        sizes = draft.sizes
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
        values = colours.length ? colours : ["Standard"],
        variants = values.flatMap((colour) =>
          (sizes.length ? sizes : [""]).map((size) => ({
            option1Name: colours.length ? "Colour" : "Option",
            option1Value: colour,
            option2Name: size ? "Size" : "",
            option2Value: size,
            availableQuantity:
              draft.stockMode === "fixed" ? draft.quantity : null,
          })),
        );
      const response = await fetch("/api/seller/campaigns", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            name: draft.name,
            description: draft.description,
            category: draft.category,
            stockMode: draft.stockMode,
            paymentMode: draft.paymentMode,
            depositValue:
              draft.paymentMode === "full"
                ? null
                : draft.paymentMode === "fixed_deposit"
                  ? draft.depositValue * 100
                  : draft.depositValue * 100,
            sellerMinimumTakeHomeKobo: draft.takeHome * 100,
            sellerPurchaseCostKobo: draft.cost ? draft.cost * 100 : null,
            referralRewardKobo: draft.reward * 100,
            reservationMinutes: 30,
            allowRestockInterest: draft.allowRestock,
            allowSubstitution: draft.allowSubstitution,
            variants,
          }),
        }),
        result = await response.json();
      if (!response.ok) throw new Error(result.error);
      if (file) {
        const form = new FormData();
        form.set("file", file);
        form.set("campaignId", result.campaignId);
        form.set("altText", draft.name);
        form.set("consentConfirmed", String(mediaConsent));
        const upload = await fetch("/api/media/upload", { method: "POST", body: form });
        if (!upload.ok) {
          const uploadResult = await upload.json();
          console.error("campaign-image-upload", uploadResult.error ?? "upload failed");
          router.push(`/seller/campaigns?created=${result.shortCode}&image=failed`);
          router.refresh();
          return;
        }
      }
      router.push(`/seller/campaigns?created=${result.shortCode}`);
      router.refresh();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Campaign could not be created",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="panel form-stack" onSubmit={submit}>
      {step === 1 && (
        <>
          <div className="notice">
            <strong>What are you selling?</strong>
            <br />
            Start with one clear product and a good primary image.
          </div>
          <label>
            Product image
            <div className="upload-box">
              <ImagePlus /> {file ? file.name : "Tap to choose an image"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>
          </label>
          {file && <label className="checkbox"><input type="checkbox" required checked={mediaConsent} onChange={(event)=>setMediaConsent(event.target.checked)} /> I own this image or have permission from every identifiable person to publish it.</label>}
          <label>
            Product title
            <input
              required
              value={draft.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Soft Glam Set"
            />
          </label>
          <label>
            Category
            <select
              value={draft.category}
              onChange={(e) => set("category", e.target.value)}
            >
              <option>Beauty</option>
              <option>Fashion</option>
              <option>Home</option>
              <option>Accessories</option>
            </select>
          </label>
          <label>
            Short description
            <textarea
              maxLength={1200}
              value={draft.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </label>
        </>
      )}
      {step === 2 && (
        <>
          <div className="notice">
            <strong>Options and stock</strong>
            <br />
            Use at most two option types so buying stays simple.
          </div>
          <label>
            Stock mode
            <select
              value={draft.stockMode}
              onChange={(e) =>
                set("stockMode", e.target.value as Draft["stockMode"])
              }
            >
              <option value="fixed">Fixed stock</option>
              <option value="on_request">Available on request</option>
              <option value="preorder">Preorder</option>
            </select>
          </label>
          <label>
            Colours, separated by commas
            <input
              value={draft.colours}
              onChange={(e) => set("colours", e.target.value)}
              placeholder="Black, Red, Cream"
            />
          </label>
          <label>
            Sizes, separated by commas
            <input
              value={draft.sizes}
              onChange={(e) => set("sizes", e.target.value)}
              placeholder="S, M, L, XL"
            />
          </label>
          {draft.stockMode === "fixed" && (
            <label>
              Quantity per option
              <input
                type="number"
                min="0"
                value={draft.quantity}
                onChange={(e) => set("quantity", Number(e.target.value))}
              />
            </label>
          )}
        </>
      )}
      {step === 3 && (
        <>
          <div className="notice">
            <strong>Price and buyer reward</strong>
            <br />
            Your customer sees one final price with no surprise platform fee.
          </div>
          <label>
            How much must you receive? (₦)
            <input
              type="number"
              min="500"
              value={draft.takeHome}
              onChange={(e) => set("takeHome", Number(e.target.value))}
            />
          </label>
          <label>
            Private purchase cost (optional, ₦)
            <input
              type="number"
              min="0"
              value={draft.cost}
              onChange={(e) => set("cost", Number(e.target.value))}
            />
          </label>
          <label>
            Buyer reward (₦)
            <input
              type="number"
              min="0"
              value={draft.reward}
              onChange={(e) => set("reward", Number(e.target.value))}
            />
          </label>
          <label>
            Payment mode
            <select
              value={draft.paymentMode}
              onChange={(e) =>
                set("paymentMode", e.target.value as Draft["paymentMode"])
              }
            >
              <option value="full">Full payment</option>
              <option value="fixed_deposit">Fixed deposit</option>
              <option value="percentage_deposit">Percentage deposit</option>
            </select>
          </label>
          {draft.paymentMode !== "full" && (
            <label>
              {draft.paymentMode === "fixed_deposit"
                ? "Deposit amount (₦)"
                : "Deposit percentage"}
              <input
                type="number"
                min="1"
                value={draft.depositValue}
                onChange={(e) => set("depositValue", Number(e.target.value))}
              />
            </label>
          )}
          <div className="pricing-preview">
            <p>
              <span>You receive at least</span>
              <strong>{formatNaira(price.sellerTakeHomeKobo)}</strong>
            </p>
            <p>
              <span>Buyer sees</span>
              <strong>{formatNaira(price.publicPriceKobo)}</strong>
            </p>
            <p>
              <span>Buyer can earn</span>
              <strong>{formatNaira(price.rewardFundingKobo)}</strong>
            </p>
            <small>
              Final server pricing uses the active admin configuration.
            </small>
          </div>
        </>
      )}
      {step === 4 && (
        <>
          <div className="notice">
            <strong>Delivery and publish</strong>
            <br />
            Give buyers a clear expectation before they pay.
          </div>
          <label>
            Fulfilment method
            <select
              value={draft.fulfilment}
              onChange={(e) => set("fulfilment", e.target.value)}
            >
              <option value="pickup">Pickup</option>
              <option value="seller_delivery">Seller delivery</option>
              <option value="dispatch">Dispatch</option>
              <option value="waybill">Waybill</option>
              <option value="meet_up">Meet-up</option>
            </select>
          </label>
          <label>
            Pickup or delivery note
            <textarea
              required
              value={draft.deliveryNote}
              onChange={(e) => set("deliveryNote", e.target.value)}
            />
          </label>
          <label>
            Return/refund policy
            <textarea
              required
              value={draft.returnPolicy}
              onChange={(e) => set("returnPolicy", e.target.value)}
            />
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={draft.allowRestock}
              onChange={(e) => set("allowRestock", e.target.checked)}
            />{" "}
            Accept restock requests when unavailable
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={draft.allowSubstitution}
              onChange={(e) => set("allowSubstitution", e.target.checked)}
            />{" "}
            Allow substitution offers
          </label>
        </>
      )}
      <div className="wizard-actions">
        {step > 1 && (
          <button
            type="button"
            className="button button-secondary"
            onClick={() => setStep(step - 1)}
          >
            <ArrowLeft size={17} /> Back
          </button>
        )}
        <button className="button" disabled={busy}>
          {step < 4 ? (
            <>
              Save and continue <ArrowRight size={17} />
            </>
          ) : (
            <>
              {busy ? "Publishing…" : "Publish and share"} <Check size={17} />
            </>
          )}
        </button>
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
